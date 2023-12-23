import { Blog } from "@/lib/models";
import { Session } from "next-auth";
import { Button } from "../ui/button";
import katex from "katex";
import { auth } from "@/app/auth";
import Link from "next/link";
import { marked } from "marked";
import { Trash } from "lucide-react";

/*
const deleteBlog = async (id: string) => {
  // delete the monogo blog by article id
  //
  console.log("delete button has been clicked");
  await deleteBlogById(id);
  console.log("delete done");
};
*/

const parseLatex = async (htmlString: string) => {
  // parses latex in an html string
  var res = "";
  var i = 0;
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
    } else {
      res += htmlString[i];
    }
    i++;
  }
  return res;
};

const BlogView = async (props: {
  session: Session;
  blog: Blog;
  passedId: string;
}) => {
  // console.log("\n\n\nstring before latex: \n\n", props.blog.content);
  // var htmlString = katex.renderToString(props.blog.content);
  // console.log("\n\nstring after latex: \n\n", htmlString);
  var htmlString = props.blog.content;
  htmlString = await marked.parse(props.blog.content);
  htmlString = await parseLatex(htmlString);
  //const session = useSession();
  const authh = await auth();

  // we're using client because katexx apparently only renders best
  // using auto renderer, and that, is only exported to the window
  // object which is in client (browser)

  /*
  useEffect(() => {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    });
  }, []);
  */

  //console.log("\n\nstring after mkd: \n\n", htmlString);
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
        <div
          dangerouslySetInnerHTML={{ __html: htmlString }}
          id="blogViewMd"
        ></div>
        {/*<Markdown>{htmlString}</Markdown>*/}
      </div>
    </div>
  );
};

export default BlogView;
