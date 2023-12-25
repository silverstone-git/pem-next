"use client";

import BlogCardLanding from "./blog_components/blog_card";
import { Blog, categories, pageLengthLanding } from "@/lib/models";
import { Suspense, useState } from "react";
import Loading from "./loading_landing_cards";
import { Badge } from "./ui/badge";
import LoadingBlogPage from "./loading_blog_page";
import { Diamond, DiamondIcon, MoveRight } from "lucide-react";
import { getLatestBlogs } from "@/lib/blog/blogpost";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTitleFromContent } from "@/lib/blog/blog_client";

const BlogCards = (props: {
  blogs: Blog[];
  lastPage: boolean;
  showCategory: string;
  setCategory: any;
  setBlogs: any;
  setLoadingBlog: any;
  setLastPage: any;
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
                key={blog.blogId}
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

        {!props.lastPage ? (
          <div>
            <button
              className="mt-4 self-center dark:text-pink-300 text-pink-700 hover:dark:text-pink-100 hover:text-pink-900 transition-colors"
              onClick={async () => {
                // add new blogs to blog array
                const lastId: string = props.blogs[props.blogs.length - 1].blogId;
                const newBlogs: Blog[] = await getLatestBlogs(lastId);
                if (newBlogs.length < pageLengthLanding) {
                  props.setLastPage(true);
                }
                props.setBlogs([...props.blogs, ...newBlogs]);
                props.setCategory("*");
              }}
            >
              Load More <MoveRight className="inline"></MoveRight>
            </button>
          </div>
        ) : null}
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
  const [lastPage, setLastPage] = useState(false);
  const router = useRouter();

  const [blogsArr, setBlogsArr] = useState(props.res);

  return loadingBlog ? (
    <LoadingBlogPage />
  ) : (
    <div>
      <div className="flex flex-col md:flex-row justify-normal md:justify-center gap-16 md:gap-4 pt-16">
        <BlogCards
          blogs={blogsArr}
          lastPage={lastPage}
          showCategory={selectedCategory}
          setCategory={setCategory}
          setLoadingBlog={setLoadingBlog}
          setBlogs={setBlogsArr}
          setLastPage={setLastPage}
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
          <div className="text-pink-700 dark:text-pink-300 py-4 mt-7">
            POPULAR BLOGS
          </div>
          <div className="flex gap-3 flex-col">
            {blogsArr
              .toSorted((blogA, blogB) => blogB.views - blogA.views)
              .slice(0, 5)
              .map((el) => {
                return (
                  <div
                    key={el.blogId}
                    onClick={() => router.replace(`/blogs/${el.blogId}`)}
                    className="flex gap-2 w-fit cursor-pointer hover:dark:text-pink-300 hover:text-pink-700 transition-colors"
                  >
                    <Diamond className="inline text-xs"></Diamond>
                    <div>
                      {getTitleFromContent(el.content)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
