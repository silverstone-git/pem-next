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
    <div className="p-4 pl-6">
      <div className="blog-view-div">
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
