export interface Blog {
  id: string;
  content: string;
  name: string;
  email: string;
  category: string;
  dateAdded: Date;
}

export const initBlog: Blog = {
  id: "",
  content: "",
  name: "",
  email: "",
  category: "",
  dateAdded: new Date(),
};

export function parseObjToBlog(el: any) {
  const blog: Blog = initBlog;
  blog.name = el["name"];
  blog.email = el["email"];
  blog.content = el["content"];
  blog.dateAdded = el["dateAdded"];
  blog.category = el["category"];
  blog.id = el["_id"].toString();
  return blog;
}

export const categories = [
  "webdev",
  "android",
  "physics",
  "space",
  "philosophy",
  "culture",
  "history",
  "maths",
];
