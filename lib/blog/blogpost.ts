"use server";
import clientPromise from "@/lib/mongodb";
import {
  CountDocumentsOptions,
  Db,
  Document,
  ObjectId,
  OptionalId,
  WithId,
} from "mongodb";
import {
  Blog,
  BlogComment,
  Excali,
  commentsPageLength,
  pageLengthLanding,
} from "../models";
import { Session, User } from "next-auth";
import { auth } from "@/app/auth";

const writers: string[] = ["silverstone965@gmail.com"];

export const isNotWriter = (inp: string) => {
  if (writers.find((val: string, index: number) => val === inp)) {
    return false;
  } else {
    return true;
  }
};

const submitDrawings = async (
  db: Db,
  email: string,
  blogId: string,
  excalidrawings: Excali[]
) => {
  for (var i = 0; i < excalidrawings.length; i++) {
    await db.collection("drawings").insertOne({
      email: email,
      blogId: blogId,
      drawing: excalidrawings[i],
    });
  }
};

export const getDrawingsByBlogId: (
  blogId: string
) => Promise<Excali[]> = async (blogId: string) => {
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    const excalidrawingsCursor = db
      .collection("drawings")
      .find({ blogId: blogId });
    const excalidrawings: Excali[] = [];
    for await (const doc of excalidrawingsCursor) {
      excalidrawings.push(doc.drawing);
    }
    return excalidrawings;
  } catch (e) {
    console.log("image fetching error");
    return [];
  } finally {
    //client.close();
  }
};

export const submitBlogToDB = async (
  user: { name: string; email: string },
  blogContent: string,
  blogCategory: string,
  excalidrawings: Excali[]
) => {
  // auth and then send it to db
  const session = await auth();
  if (session?.user?.email == null || isNotWriter(session?.user?.email)) {
    console.log("______ 403 ______");
    return;
  }
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    const { insertedId } = await db.collection("blogs").insertOne({
      name: user.name,
      email: user.email,
      content: blogContent,
      category: blogCategory,
      dateAdded: new Date(),
      views: 0,
    });
    console.log("inserted the blog, now, for the pictures.. \\/");
    await submitDrawings(db, user.email, insertedId.toString(), excalidrawings);
    console.log("done submitting the drawings \\/");
    return 0;
  } catch (e) {
    console.log("an error ocurred while submitting to mongodb");
    return 1;
  } finally {
    //client.close();
  }
};

export const getLatestBlogs: (
  lastBlogId: string | null
) => Promise<Blog[]> = async (lastBlogId: string | null = "0") => {
  // fetches latest 5 blogs from mongo
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    let cur;
    if (lastBlogId == null) {
      cur = db
        .collection("blogs")
        .find({})
        .sort({ _id: 1 })
        .limit(pageLengthLanding);
    } else {
      cur = db
        .collection("blogs")
        .find({ _id: { $gt: new ObjectId(lastBlogId) } })
        .sort({ _id: 1 })
        .limit(pageLengthLanding);
    }
    const resArray: Blog[] = [];

    //
    // TODO: we ought to do this in models but it memoizes the result, resulting in duplication
    //
    for await (const doc of cur) {
      resArray.push({
        blogId: doc["_id"].toString(),
        name: doc["name"],
        email: doc["email"],
        content: doc["content"],
        dateAdded: doc["dateAdded"],
        category: doc["category"],
        views: doc["views"],
        likes: doc["likes"],
      });
    }
    //console.log("\narray end => \n");
    //console.log(resArray);
    return resArray;
  } catch (e) {
    console.log("error is: ", e);
    return [];
  } finally {
    //client.close();
  }
};

export const getBlogById = async (blogId: string, session: Session | null) => {
  // fetches latest 5 blogs from mongo
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    var res;
    if (session?.user) {
      res = await db
        .collection("blogs")
        .findOneAndUpdate(
          { _id: new ObjectId(blogId) },
          { $inc: { views: 1 } }
        );
      if (res) {
        // since the old doc is fetched, not the updated one, updating the local copy as well ...
        res["views"] = res["views"] + 1;
      }
    } else {
      res = await db.collection("blogs").findOne({ _id: new ObjectId(blogId) });
    }
    return res;
  } catch (e) {
    console.log("error is: ", e);
  } finally {
    //client.close();
  }
};

export const deleteBlogById = async (blogId: string) => {
  // deletes the article by id
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    await db.collection("blogs").deleteOne({ _id: new ObjectId(blogId) });
    console.log("delete blog done, now, deleting drawings associated with it");
    await db.collection("drawings").deleteMany({ blogId: blogId });
    console.log("deleted drawings as well, now, comments =>");
    await db.collection("comments").deleteMany({ blogId: blogId });
  } catch (e) {
    console.log("there was an error in deleting");
  } finally {
    //client.close();
  }
};

export const sendLike = async (blogId: string, userObj: User | undefined) => {
  if (!userObj?.email) return;
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    await db
      .collection("users")
      .updateOne({ email: userObj.email }, { $push: { liked: blogId } });
    await db
      .collection("blogs")
      .updateOne({ _id: new ObjectId(blogId) }, { $inc: { likes: 1 } });
  } catch (e) {
    console.log("there was an error while liking");
  } finally {
    //client.close();
  }
  return;
};

export const getUser = async (email: string) => {
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    const user = await db.collection("users").findOne({ email: email });
    return user;
  } catch (e) {
    console.log(e);
  }
};

export const getLatestComments: (
  blogId: string,
  lastCommentId: string | null
) => Promise<BlogComment[]> = async (
  blogId: string,
  lastCommentId: string | null
) => {
  const client = await clientPromise;
  const db = client.db("pem");
  var res: BlogComment[] = [];
  try {
    if (lastCommentId) {
      // fetch comments older than this
      const docs = await db
        .collection("comments")
        .find({ blogId: blogId, _id: { $lt: new ObjectId(lastCommentId) } })
        .sort({ _id: -1 })
        .limit(commentsPageLength)
        .toArray();
      res = docs.map((el: WithId<Document>) => {
        return {
          commentId: el._id.toString(),
          name: el.name,
          email: el.email,
          dateAdded: el.dateAdded,
          content: el.content,
        } as BlogComment;
      });
    } else {
      // fetch latest <pageLength>
      const docs = await db
        .collection("comments")
        .find({ blogId: blogId })
        .sort({ _id: -1 })
        .limit(commentsPageLength)
        .toArray();
      res = docs.map((el: WithId<Document>) => {
        return {
          commentId: el._id.toString(),
          name: el.name,
          email: el.email,
          dateAdded: el.dateAdded,
          content: el.content,
        } as BlogComment;
      });
    }
  } catch (e) {
    console.log("an error occured while fetching comments: e");
  }
  return res;
};

export const sendComment = async (comment: BlogComment) => {
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    const tbi: WithId<Document> = { ...comment, _id: new ObjectId() };
    delete tbi.commentId;
    if (tbi.name == "") {
      tbi.name = tbi.email;
    }
    await db.collection("comments").insertOne(tbi);
    console.log("comment inserted \\/");
  } catch (e) {
    console.log("an error occured while sending comment: ", e);
  }
};
