"use client";

import BlogCardLanding from "./blog_components/blog_card";
import { Blog, categories } from "@/lib/models";
import { Suspense, useState } from "react";
import Loading from "./loading_landing_cards";
import { Badge } from "./ui/badge";
import LoadingBlogPage from "./loading_blog_page";
import { MoveRight } from "lucide-react";
import { getLatestBlogs } from "@/lib/blog/blogpost";

const BlogCards = (props: {
  blogs: Blog[];
  showCategory: string;
  setCategory: any;
  setBlogs: any;
  setLoadingBlog: any;
}) => {
  return (
    <div className="w-full md:w-1/2 lg:w-6/12 h-full text-xl flex flex-col items-center">
      <div className="text-lg py-4 text-pink-700 dark:text-pink-300">
        RECENT BLOGS
      </div>
      <div className="flex flex-col gap-16 w-full">
        <Suspense fallback={<Loading />}>
          {props.blogs.map((blog: Blog) => {
            // return each blog div here
            return (
              <div
                key={blog.id}
                className={`${
                  props.showCategory == blog.category ||
                  props.showCategory == "*"
                    ? ""
                    : "hidden"
                } `}
              >
                <BlogCardLanding
                  blog={blog}
                  setLoadingBlog={props.setLoadingBlog}
                ></BlogCardLanding>
              </div>
            );
          })}
        </Suspense>

        <button
          className="mt-4 self-center dark:text-pink-300 text-pink-700"
          onClick={async () => {
            // add new blogs to blog array
            const lastId: string = props.blogs[props.blogs.length - 1].id;
            const newBlogs: Blog[] = await getLatestBlogs(lastId);
            props.setBlogs([...props.blogs, ...newBlogs]);
            props.setCategory("*");
          }}
        >
          Load More <MoveRight className="inline"></MoveRight>
        </button>
      </div>
    </div>
  );
};

const CategoryBadge = (props: {
  category: string;
  selectedCategory: string;
  categorySetter: any;
}) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        props.categorySetter(props.category);
      }}
    >
      <Badge
        variant={
          props.category == props.selectedCategory ? "default" : "outline"
        }
      >
        {props.category == "*"
          ? "All"
          : props.category.charAt(0).toUpperCase() + props.category.slice(1)}
      </Badge>
    </div>
  );
};

const LandingPage = (props: { res: Blog[] }) => {
  // load recent 5 blogs
  // put them in an array
  // you would usually use useeffect here in normal react, but, this is a server function, so, we'll
  // fetch data just by calling and awaiting a function

  const [selectedCategory, setCategory] = useState("*");
  const [loadingBlog, setLoadingBlog] = useState(false);

  const [blogsArr, setBlogsArr] = useState(props.res);

  return loadingBlog ? (
    <LoadingBlogPage />
  ) : (
    <div>
      <div className="flex flex-col md:flex-row justify-normal md:justify-center gap-16 md:gap-4 pt-16">
        <BlogCards
          blogs={blogsArr}
          showCategory={selectedCategory}
          setCategory={setCategory}
          setLoadingBlog={setLoadingBlog}
          setBlogs={setBlogsArr}
        />
        <div className="w-full md:w-1/3 lg:w-3/12">
          <div className="text-pink-700 dark:text-pink-300 py-4">
            TOP CATEGORIES
          </div>
          <div className="flex gap-3 flex-wrap">
            <CategoryBadge
              selectedCategory={selectedCategory}
              category="*"
              categorySetter={setCategory}
            />
            {categories.map((el) => {
              return (
                <CategoryBadge
                  key={el}
                  selectedCategory={selectedCategory}
                  category={el}
                  categorySetter={setCategory}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
