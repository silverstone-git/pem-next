import { Blog } from "@/lib/models";
import { Button } from "../ui/button";
import { getTitleFromContent } from "@/lib/blog/blog_client";
import Link from "next/link";

const BlogCardSearch = (props: { blog: Blog }) => {
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  var titleString: string = getTitleFromContent(props.blog.content);

  console.log("got blog:", props.blog);

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold mb-4">{titleString}</div>
      <div>{`${props.blog.content
        .slice(0, 200)
        .replace(/[^A-Za-z0-9]/g, " ")}...`}</div>
      <Link className="mt-4" href={`/blogs/${props.blog.blogId}`}>
        <Button>Read Further</Button>
      </Link>
    </div>
  );
};

export default BlogCardSearch;
