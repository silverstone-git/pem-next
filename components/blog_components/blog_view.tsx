"use client";
import { Blog } from "@/lib/models";
import { Session } from "next-auth";
import Markdown from "react-markdown";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "lucide-react";
import { auth } from "@/app/auth";
import { useSession } from "next-auth/react";
import { deleteBlogById } from "@/lib/blog/blogpost";

/*
const parseLatex = async (htmlString: string) => {
  // parses latex in an html string
  var res = "";
  var i = 0;
  while (i < htmlString.length - 1) {
    if (
      htmlString[i] == "\\" &&
      (htmlString[i + 1] == "[" || htmlString[i + 1] == "(")
    ) {
      // if block latex opener is spotted, find out where it ends
      var j = i + 2;
      var toBeLatexxed = "";
      while (
        j < htmlString.length - 1 &&
        !(
          htmlString[j] == "\\" &&
          (htmlString[j + 1] == "]" || htmlString[j + 1] == ")")
        )
      ) {
        toBeLatexxed += htmlString[j];
        j++;
      }
      res += katex.renderToString(toBeLatexxed);
      i = j + 1;
    } else {
      res += htmlString[i];
    }
    i++;
  }
  return res;
};
*/

const deleteBlog = async (id: string) => {
  // delete the monogo blog by article id
  //
  console.log("delete button has been clicked");
  deleteBlogById(id);
};

const BlogView = (props: {
  session: Session;
  blog: Blog;
  passedId: string;
}) => {
  // console.log("\n\n\nstring before latex: \n\n", props.blog.content);
  // var htmlString = katex.renderToString(props.blog.content);
  // console.log("\n\nstring after latex: \n\n", htmlString);
  // var htmlString = await marked.parse(props.blog.content);
  var htmlString = props.blog.content;
  const session = useSession();
  useEffect(() => {
    window.renderMathInElement(document.body);
  }, []);
  //console.log("\n\nstring after mkd: \n\n", htmlString);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:w-11/12 lg:w-2/3 blog-view-div">
        <div className="italic font-bold my-6">
          {" "}
          Written by {props.blog.name} on{" "}
          {props.blog.dateAdded.toLocaleDateString()}{" "}
          {props.blog.name == session.data?.user?.name ? (
            <div onClick={() => deleteBlog(props.blog.id)}>
              {" "}
              <Button>Delete Article</Button>
            </div>
          ) : null}
        </div>
        {/*
        <div
          dangerouslySetInnerHTML={{ __html: htmlString }}
          id="blogViewMd"
        ></div>
	*/}
        <Markdown>{htmlString}</Markdown>
      </div>
    </div>
  );
};

export default BlogView;
