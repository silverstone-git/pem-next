"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const submitBlogToDB = async (
  user: { name: string; email: string },
  blogContent: string,
  blogCategory: string
) => {
  // auth and then send it to db
  const client = await clientPromise;
  try {
    console.log("client connection awaited");
    const db = client.db("pem");
    await db.collection("blogs").insertOne({
      name: user.name,
      email: user.email,
      content: blogContent,
      category: blogCategory,
      dateAdded: new Date(),
    });
    console.log("inserted \\/");
    return 0;
  } catch (e) {
    console.log("an error ocurred while submitting to mongodb");
    return 1;
  } finally {
    client.close();
  }
};

export const getLatestBlogs = async () => {
  // fetches latest 5 blogs from mongo
  const client = await clientPromise;
  try {
    const db = client.db("pem");
    const cur = db.collection("blogs").find({}).sort({ _id: 1 }).limit(5);
    const resArray = await cur.toArray();
    return resArray;
  } catch (e) {
    console.log("error is: ", e);
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
