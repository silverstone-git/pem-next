import { Blog } from "@/lib/models";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {getTitleFromContent} from "@/lib/blog/blog_client";

const BlogCardLanding = async (props: { blog: Blog; setLoadingBlog: any }) => {
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  var titleString: string = getTitleFromContent(props.blog.content);
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold mb-4">{titleString}</div>
      <div>{`${props.blog.content
        .slice(0, 200)
        .replace(/[^A-Za-z0-9]/g, " ")}...`}</div>
      <div
        className="mt-4"
        onClick={() => {
          router.replace(`/blogs/${props.blog.id}`);
          props.setLoadingBlog(true);
        }}
      >
        <Button>Read Further</Button>
      </div>
    </div>
  );
};

export default BlogCardLanding;
