import { Blog } from "@/lib/models";
import { Button } from "../ui/button";
import Link from "next/link";
import { Trash } from "lucide-react";
import BlogViewClient from "./blog_view_client";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { Session } from "next-auth";
import markedKatex from "marked-katex-extension";
import BlogLikeBar from "./blog-like-bar";
import {getUser} from "@/lib/blog/blogpost";

const sepDrawings = async (htmlString: string) => {
  // parses latex in an html string
  // and separates blog by images
  var res = "";
  var i = 0;
  const htmlSectionsSeppedByDrawings: string[] = [];
  while (i < htmlString.length - 1) {
    if (
      htmlString[i] == "!" &&
      htmlString[i + 1] == "[" &&
      htmlString[i + 2] == "["
    ) {
      htmlSectionsSeppedByDrawings.push(res);
      res = "";
      while (
        !(htmlString[i] === "]" && htmlString[i + 1] === "]") &&
        i < htmlString.length - 2
      ) {
        i++;
      }
      i++;
    } else {
      res += htmlString[i];
    }
    i++;
  }
  htmlSectionsSeppedByDrawings.push(res);
  return htmlSectionsSeppedByDrawings;
};

const BlogView = async (props: {
  blog: Blog;
  passedId: string;
  authh: Session | null;
}) => {
  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  marked.use(markedKatex({ throwOnError: false }));
  const htmlString = await marked.parse(props.blog.content);
  const htmlSectionsSeppedByDrawings = await sepDrawings(htmlString);
  var alreadyLiked = null;
  if(props.authh?.user?.email) {
  	alreadyLiked = (await getUser(props.authh.user.email))?.liked;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="px-8 w-full md:w-11/12 lg:w-2/3 blog-view-div">
        <div className="italic font-bold text-sm md:text-md my-6">
          <div className="flex flex-row gap-4">
            <div>
              {" "}
              Written by {props.blog.name} on{" "}
              {props.blog.dateAdded.toLocaleDateString()}{" "}
              {props.blog.email == props.authh?.user?.email ? (
                <div className="ml-4 hidden md:inline">
                  <Link href={"/api/blogs/delete-blog/" + props.blog.blogId}>
                    <Button variant={"destructive"} size={"icon"}>
                      <Trash></Trash>
                    </Button>
                  </Link>
                </div>
              ) : null}
            </div>
            {/*<div className="opacity-50 self-center justify-self-center">
              <EyeIcon className="inline" /> {props.blog.views}
            </div>*/}
          </div>
        </div>
        <BlogViewClient
          blogId={props.blog.blogId}
          htmlSectionsSeppedByDrawings={htmlSectionsSeppedByDrawings}
        />
	<BlogLikeBar blogId={props.blog.blogId} alreadyLiked={alreadyLiked} />
      </div>
    </div>
  );
};

export default BlogView;
