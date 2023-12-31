import { auth } from "@/app/auth";
import BlogView from "@/components/blog_components/blog_view";
import { getBlogById } from "@/lib/blog/blogpost";
import { Blog, initBlog, parseObjToBlog } from "@/lib/models";

const IdPage = async ({ params }: { params: { passedId: string } }) => {
  // on the basis of this id, we fetch a post from fetch api
  var blog: Blog = initBlog;
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const session = await auth();
  const res = await getBlogById(params.passedId, session);
  if (res) {
    blog = parseObjToBlog(res);
  } else {
    return (
      <div className="flex h-[85vh] w-full justify-center items-center font-bold text-2xl">
        404 | Not Found
      </div>
    );
  }
  return (
    <div>
      <BlogView
        blog={blog}
        passedId={params.passedId}
	authh={session}
      ></BlogView>
    </div>
  );
};

export default IdPage;
