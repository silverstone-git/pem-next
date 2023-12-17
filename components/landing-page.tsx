import { getLatestBlogs } from "@/lib/blog/blogpost";
import BlogCardLanding from "./blog_components/blog_card";

const BlogCards = (props: { blogs: any }) => {
  return (
    <div className="text-xl p-8 flex flex-col items-center">
      <div className="w-full md:w-11/12 lg:w-2/3 text-lg py-4 text-pink-700 dark:text-pink-300">
        RECENT BLOGS
      </div>
      <div className="flex flex-col gap-8 w-11/12  md:w-2/3">
        {props.blogs.map((blogObj: any) => {
          // return each blog div here
          // console.log("received blog: ", blogObj);
          return (
            <BlogCardLanding
              key={blogObj["_id"].toString()}
              blogObj={blogObj}
            ></BlogCardLanding>
          );
        })}
      </div>
    </div>
  );
};

const LandingPage = async () => {
  // load recent 5 blogs
  // put them in an array
  // you would usually use useeffect here in normal react, but, this is a server function, so, we'll
  // fetch data just by calling and awaiting a function

  const res = await getLatestBlogs();
  return <BlogCards blogs={res} />;
};
export default LandingPage;
