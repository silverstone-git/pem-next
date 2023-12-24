import { Blog } from "@/lib/models";
import { Session } from "next-auth";
import { Button } from "../ui/button";
import katex from "katex";
import { auth } from "@/app/auth";
import Link from "next/link";
import { marked } from "marked";
import { Trash } from "lucide-react";
import BlogViewClient from "./blog_view_client";

const parseLatexAndSepDrawings = async (htmlString: string) => {
  // parses latex in an html string
  // and separates blog by images
  var res = "";
  var i = 0;
  const htmlSectionsSeppedByDrawings: string[] = [];
  while (i < htmlString.length - 1) {
    if (htmlString[i] == "$" && htmlString[i + 1] == "$") {
      // if block latex opener is spotted, find out where it ends
      var j = i + 2;
      var toBeLatexxed = "";
      while (
        j < htmlString.length - 1 &&
        !(htmlString[j] == "$" && htmlString[j + 1] == "$")
      ) {
        toBeLatexxed += htmlString[j];
        j++;
      }
      res +=
        "<div class='katex-display-true'>" +
        katex.renderToString(toBeLatexxed) +
        "</div>";
      i = j + 1;
    } else if (htmlString[i] == "$") {
      // if inline latex opener is spotted, find out where it ends
      var j = i + 1;
      var toBeLatexxed = "";
      while (j < htmlString.length - 1 && !(htmlString[j] == "$")) {
        toBeLatexxed += htmlString[j];
        j++;
      }
      res +=
        "<div class='katex-display-false'>" +
        katex.renderToString(toBeLatexxed) +
        "</div>";
      i = j;
    } else if (
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
  session: Session;
  blog: Blog;
  passedId: string;
}) => {
  const authh = await auth();

  const htmlString = await marked.parse(props.blog.content);
  const htmlSectionsSeppedByDrawings = await parseLatexAndSepDrawings(
    htmlString
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:w-11/12 lg:w-2/3 blog-view-div">
        <div className="italic font-bold my-6">
          {" "}
          Written by {props.blog.name} on{" "}
          {props.blog.dateAdded.toLocaleDateString()}{" "}
          {props.blog.name == authh?.user?.name ? (
            <div className="ml-4 inline">
              <Link href={"/api/blogs/delete-blog/" + props.blog.id}>
                <Button variant={"destructive"} size={"icon"}>
                  <Trash></Trash>
                </Button>
              </Link>
            </div>
          ) : null}
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
