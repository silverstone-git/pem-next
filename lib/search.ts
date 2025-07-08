"use server";

import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import { GoogleGenAI } from "@google/genai";
import { Blog, parseObjToBlog } from "./models";

const apiKey = process.env.GOOGLE_API_KEY;

export const onSearch: (query: string) => Promise<Blog[]> = async (
  query: string,
) => {
  console.log("queried: ", query);

  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set.");
    return [];
  }

  try {
    let ai;
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (error) {
      console.error("Failed to import @google/generative-ai:", error);
      return [];
    }

    const result = await ai.models.embedContent({
      model: "gemini-embedding-exp-03-07",
      contents: query,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
      },
    });

    let embedding;
    if (result.embeddings && Array.isArray(result.embeddings)) {
      // Map over the embeddings array to get the 'values' from each embedding object
      embedding = result.embeddings[0].values;
    } else {
      console.log("No embeddings found or unexpected format.");
      return [];
    }

    console.log("embed: ", embedding);

    const client = await clientPromise;
    const db = client.db("pem");
    const blogChunksCollection = db.collection("blog_chunks");
    const blogsCollection = db.collection("blogs");

    // 1. Atlas Search query
    const searchResults = await blogChunksCollection
      .aggregate([
        {
          $vectorSearch: {
            index: "gemini_vectors",
            path: "embedding",
            queryVector: embedding,
            numCandidates: 10, // Number of nearest neighbors to consider (adjust as needed for performance/recall)
            limit: 5, // The 'k' from knn, now part of $vectorSearch
          },
        },
        {
          $project: {
            docId: 1,
            _id: 0,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    console.log("Atlas Search results:", searchResults.length);

    // 2. Extract distinct docId values, preserving order
    const distinctDocIds = [
      ...new Map(searchResults.map((item) => [item.docId, item])).values(),
    ].map((item) => item.docId);

    // 3. Fetch blogs based on distinct docId values
    const objectIds = distinctDocIds.map((docId) => new ObjectId(docId));

    const blogs = await blogsCollection
      .find({ _id: { $in: objectIds } })
      .toArray();

    // 4. Sort blogs to match the order of distinctDocIds
    const sortedBlogs = distinctDocIds
      .map((docId) => {
        return blogs.find((blog) => blog._id.toString() === docId);
      })
      .filter(Boolean); // Filter out undefined values in case a blog is not found

    const sortedBlogsArr: Blog[] = sortedBlogs.map((blog) => {
      return parseObjToBlog({ ...blog, blogId: blog!._id });
    });
    return sortedBlogsArr;
  } catch (e) {
    console.error(e);
    return [];
  }
};
