"use server";
import clientPromise from "@/lib/mongodb";
import { Db, ObjectId } from "mongodb";
import { Blog, Excali, pageLengthLanding, parseObjToBlog } from "../models";

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

export const getDrawingsByBlogId: (blogId: string) => Promise<Excali[]> = async (blogId: string) => {
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
  }
};

export const submitBlogToDB = async (
  user: { name: string; email: string },
  blogContent: string,
  blogCategory: string,
  excalidrawings: Excali[]
) => {
  // auth and then send it to db
  const client = await clientPromise;
  try {
    console.log("client connection awaited");
    const db = client.db("pem");
    const { insertedId } = await db.collection("blogs").insertOne({
      name: user.name,
      email: user.email,
      content: blogContent,
      category: blogCategory,
      dateAdded: new Date(),
    });
    console.log("inserted the blog, now, for the pictures.. \\/");
    await submitDrawings(db, user.email, insertedId.toString(), excalidrawings);
    console.log("done submitting the drawings \\/");
    return 0;
  } catch (e) {
    console.log("an error ocurred while submitting to mongodb");
    return 1;
  } finally {
    client.close();
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
        id: doc["_id"].toString(),
        name: doc["name"],
        email: doc["email"],
        content: doc["content"],
        dateAdded: doc["dateAdded"],
        category: doc["category"],
      });
    }
    //console.log("\narray end => \n");
    //console.log(resArray);
    return resArray;
  } catch (e) {
    console.log("error is: ", e);
    return [];
  }
};

export const getBlogById = async (id: string) => {
  // fetches latest 5 blogs from mongo
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    const res = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    return res;
  } catch (e) {
    console.log("error is: ", e);
  }
};

export const deleteBlogById = async (id: string) => {
  // deletes the article by id
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
  } catch (e) {
    console.log("there was an error doing all that");
  }
};
