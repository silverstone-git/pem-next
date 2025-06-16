import { initBlog } from "./models";

export const onSearch = async (query: string) => {
  console.log("queried: ", query);
  return [initBlog];
};
