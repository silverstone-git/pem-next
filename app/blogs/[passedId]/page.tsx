import { auth } from "@/app/auth";
import BlogView from "@/components/blog_components/blog_view";
import { Button } from "@/components/ui/button";
import { getBlogById } from "@/lib/blog/blogpost";
import { Blog, initBlog, parseObjToBlog } from "@/lib/models";
import Link from "next/link";

const IdPage = async ({ params }: { params: { passedId: string } }) => {
  // on the basis of this id, we fetch a post from fetch api
  const session = await auth();
  if (!session) {
    return (
      <div className="flex flex-col gap-4 w-full h-[80vh] justify-center items-center">
        <div> Please login to view the blog, thank you so much</div>
        <Link href={"/api/auth/signin"}>
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }
  var blog: Blog = initBlog;
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await getBlogById(params.passedId);
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
        session={session}
      ></BlogView>
    </div>
  );
};

export default IdPage;
