export interface Blog {
  id: string;
  content: string;
  name: string;
  email: string;
  dateAdded: Date;
}

export const initBlog: Blog = {
  id: "",
  content: "",
  name: "",
  email: "",
  dateAdded: new Date(),
};

export function parseObjToBlog(el: any) {
  const blog: Blog = initBlog;
  blog.name = el["name"];
  blog.email = el["email"];
  blog.content = el["content"];
  blog.dateAdded = el["dateAdded"];
  blog.id = el["_id"].toString();
  return blog;
}
