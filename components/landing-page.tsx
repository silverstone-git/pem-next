"use client";

import BlogCardLanding from "./blog_components/blog_card";
import { Blog, categories } from "@/lib/models";
import { Suspense, useState } from "react";
import Loading from "./loading_landing_cards";
import { Badge } from "./ui/badge";
import LoadingBlogPage from "./loading_blog_page";

const BlogCards = (props: {
  blogs: Blog[];
  showCategory: string;
  setLoadingBlog: any;
}) => {
  return (
    <div className="w-full md:w-1/2 lg:w-6/12 min-h-[80vh] text-xl flex flex-col items-center">
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

  return loadingBlog ? (
    <LoadingBlogPage />
  ) : (
    <div className="flex flex-col md:flex-row justify-normal md:justify-center gap-16 md:gap-4 pt-16">
      <BlogCards
        blogs={props.res}
        showCategory={selectedCategory}
        setLoadingBlog={setLoadingBlog}
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
  );
};
export default LandingPage;
