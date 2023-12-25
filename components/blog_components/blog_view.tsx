import { Blog } from "@/lib/models";
import { Button } from "../ui/button";
import katex from "katex";
import { auth } from "@/app/auth";
import Link from "next/link";
import { Trash } from "lucide-react";
import BlogViewClient from "./blog_view_client";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import {Session} from "next-auth";
import markedKatex from "marked-katex-extension";


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

const BlogView = async (props: { blog: Blog; passedId: string; authh: Session | null}) => {
  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  marked.use(markedKatex({throwOnError: false}));
  const htmlString = await marked.parse(props.blog.content);
  const htmlSectionsSeppedByDrawings = await sepDrawings(
    htmlString
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:w-11/12 lg:w-2/3 blog-view-div">
        <div className="italic font-bold my-6">
          <div className="flex flex-row gap-4">
            <div>
              {" "}
              Written by {props.blog.name} on{" "}
              {props.blog.dateAdded.toLocaleDateString()}{" "}
              {props.blog.email == props.authh?.user?.email ? (
                <div className="ml-4 inline">
                  <Link href={"/api/blogs/delete-blog/" + props.blog.id}>
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
          blogId={props.blog.id}
          htmlSectionsSeppedByDrawings={htmlSectionsSeppedByDrawings}
        />
      </div>
    </div>
  );
};

export default BlogView;
