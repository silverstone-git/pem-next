import { Blog } from "@/lib/models";
import { marked } from "marked";
import { Session } from "next-auth";

const BlogView = (props: {
  session: Session;
  blog: Blog;
  passedId: string;
}) => {
  const htmlString = marked.parse(props.blog.content);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:w-11/12 lg:w-2/3 blog-view-div">
        <div className="italic font-bold my-6">
          {" "}
          Written by {props.blog.name} on{" "}
          {props.blog.dateAdded.toLocaleDateString()}
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>
      </div>
    </div>
  );
};

export default BlogView;
