import { getLatestBlogs } from "@/lib/blog/blogpost";
import BlogCardLanding from "./blog_components/blog_card";
import { Blog, parseObjToBlog } from "@/lib/models";

const LandingPage = async () => {
  // load recent 5 blogs
  // put them in an array
  var blogs: Blog[] = [];
  // you would usually use useeffect here in normal react, but, this is a server function, so, we'll
  // fetch data just by calling and awaiting a function

  const res = await getLatestBlogs();
  if (res) {
    const parsedRes = res.map((el) => {
      return parseObjToBlog(el);
    });
    blogs = parsedRes;
  }

  return (
    <div className="text-xl p-8">
      This is the landing page, I will explain what it all is in a jiffy <br />
      Recent Blogs -
      <div className="flex flex-col">
        {blogs.map((blog) => {
          // return each blog div here
          return <BlogCardLanding key={blog.id} blog={blog}></BlogCardLanding>;
        })}
      </div>
    </div>
  );
};
export default LandingPage;
