import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";

export interface Blog {
  blogId: string;
  content: string;
  name: string;
  email: string;
  category: string;
  dateAdded: Date;
  views: number;
  likes: number;
}

export interface Excali {
  elements: ExcalidrawElement[];
  appState: AppState;
  scrollToContent: boolean;
  files: BinaryFiles;
}

export const initBlog: Blog = {
  blogId: "",
  content: "",
  name: "",
  email: "",
  category: "",
  dateAdded: new Date(),
  views: 0,
  likes: 0,
};

export function parseObjToBlog(el: any) {
  const blog: Blog = initBlog;
  blog.name = el["name"];
  blog.email = el["email"];
  blog.content = el["content"];
  blog.dateAdded = el["dateAdded"];
  blog.category = el["category"];
  blog.views = el["views"];
  blog.likes = el["likes"];
  blog.blogId = el["_id"].toString();
  return blog;
}

export interface BlogComment {
  commentId: string;
  name: string;
  email: string;
  content: string;
  dateAdded: Date;
}

// CONSTANTS
//

export const pageLengthLanding = 5;
export const commentsPageLength = 5;

export const categories = [
  "webdev",
  "android",
  "physics",
  "space",
  "philosophy",
  "culture",
  "history",
  "maths",
  "sociology",
  "coding",
];
