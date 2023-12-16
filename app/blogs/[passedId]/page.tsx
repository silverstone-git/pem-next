import { auth } from "@/app/auth";
import BlogView from "@/components/blog_components/blog_view";
import { getBlogById } from "@/lib/blog/blogpost";
import { Blog, initBlog, parseObjToBlog } from "@/lib/models";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const IdPage = async ({ params }: { params: { passedId: string } }) => {
  // on the basis of this id, we fetch a post from fetch api
  const session = await auth();
  var blog: Blog = initBlog;
  const res = await getBlogById(params.passedId);
  if (res) {
    blog = parseObjToBlog(res);
  }
  if (session?.user) {
    return (
      <div>
        <BlogView
          blog={blog}
          passedId={params.passedId}
          session={session}
        ></BlogView>
      </div>
    );
  } else {
    return <p>Please login to view the blog, thank you so much</p>;
  }
};

export default IdPage;
