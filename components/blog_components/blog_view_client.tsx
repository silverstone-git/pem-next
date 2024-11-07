"use client";

import { getDrawingsByBlogId, submitEditUser } from "@/lib/blog/blogpost";
import { Excali } from "@/lib/models";
import { useEffect, useState } from "react";
import LoadingCard from "../loading_card";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import DOMPurify from "isomorphic-dompurify";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { Edit2 } from "lucide-react";
import { useSession } from "next-auth/react";
import renderer from "@/lib/blog/renderer";
import { Skeleton } from "../ui/skeleton";
import LoadingSpinner from "../spinner";
import { getTitleFromContent } from "@/lib/blog/blog_client";
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

const BlogInnerContent = (props: {secc: string, title: string}) => {
  if(props.title.includes('otebook')) {
    let counter = 1;
    let modifiedHtmlString = props.secc.replace(/<code([^>]*)>/g, (match, p1) => {
      let newClass = `code-notebook code-count-${counter}`;
      
      // Increment the counter for the next <code> element
      counter++;

      // Check if there are existing classes
      if (p1.includes('class="')) {
          // If there are existing classes, append the new classes to them
          return `<code${p1.replace(/class="([^"]*)"/, (m: any, classes: any) => `class="${classes} ${newClass}"`)}>`;
      } else {
          // If there are no existing classes, just add the new classes
          return `<code class="${newClass}">`;
      }
    });

    console.log("an extra class is added as its a notebook");
    return <div dangerouslySetInnerHTML={{ __html: modifiedHtmlString }}></div>
  }
  console.log("NO extra classes are added as its not a notebook");
  //console.log(props.title)
  return <div dangerouslySetInnerHTML={{ __html: props.secc }}></div>
}

const ExcalidrawFromDataDiv = (props: {secc: string, drawings: any, theme?: string}) => {

  const match = props.secc.match(/data-filename="([^"]+)"/);
  const filename = match ? match[1] : null;
  if(filename && filename in props.drawings) {
    return <div className="h-[50vh] w-full"> 
      <Excalidraw
        initialData={props.drawings[filename]}
        viewModeEnabled={true}
        theme={
          props.theme === "light" || props.theme === "dark" ? props.theme : "dark"
        }
      />
    </div> 
  } else {
    //console.log("filename not found in drawings obj or div")
    //console.log("filename", filename);
    //console.log(secc);
    return <div className="h-36 w-full flex justify-center items-center"><LoadingSpinner /></div>;
  }
}

const BlogViewClient = (props: {
  blogId: string;
  authorEmail: string;
  markdownText: string;
  htmlSectionsSeppedByFiles: string[];
}) => {

  const session = useSession();
  const [drawings, setDrawings] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [htmlStringEditPreview, setHTMLStringEditPreview] = useState("");
  const [markdownEdit, setMarkdownEdit] = useState(props.markdownText);


 
  useEffect(() => {
    if (props.htmlSectionsSeppedByFiles.length > 1) {
      getDrawingsByBlogId(props.blogId).then((val: [string, Excali][]) => {
        //console.log("got drawings: ", val);
        const filenameExcaliObject = Object.fromEntries(val);
        setDrawings((prevState: any) => ({
          ...prevState,
          ...filenameExcaliObject
        }));
        //console.log("set the drwaings successfully");
        //console.log(filenameExcaliObject);
      });
      // make other calls for other files later. add them to respective states and
      // render it in the file preview using, say, mp3files[filename] like we did for excalidraw
    }
  }, [props.blogId, props.htmlSectionsSeppedByFiles.length]);

  const handleMarkdownChange = async (val: string) => {
    //console.log("change: ", val);
    setMarkdownEdit(val);
  }

  const { theme } = useTheme();

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );


  if(editMode) {
    return <div className="flex flex-col gap-4 w-full">
        <textarea
          value={markdownEdit}
          onChange={(e => handleMarkdownChange(e.target.value))}
          placeholder='Khaali Blog Mat Daalna'
          className={`w-full h-[60vh] p-4 border border-gray-300 rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            resize-none`}  />

        <div className="flex flex-col gap-4">
          <div className="py-2 px-4 bg-zinc-800 text-zinc-200 cursor-pointer rounded" onClick={async () => {
            // generating the markdown preview on click
            if(marked) {
              marked.setOptions({renderer, gfm: true, breaks: true});
              marked.use(markedKatex({ throwOnError: false }));
              const htmlString = await marked.parse(markdownEdit);
              const htmlPureString = DOMPurify.sanitize(htmlString);
              console.log(htmlPureString)

              setHTMLStringEditPreview(htmlPureString);
            } else {
              //console.log("marked is: ", marked);
            }
          }}>Generate Preview</div>
          <div dangerouslySetInnerHTML={{__html: htmlStringEditPreview}} ></div>
          <div className="py-2 px-4 bg-zinc-800 text-zinc-200 cursor-pointer rounded" onClick={async () => {
            // get user session and submit to api
            const { statusCode } = await submitEditUser(
              props.blogId,
              markdownEdit,
            );
            if(statusCode == 204) {
              // done
              console.log("donezooo");
              setEditMode(false);
            } else {
              console.log("un problemo");
            }
          }} >
            Save Changes
          </div>

        </div>
      </div>
  } else {
    return (
      <div>
        {session.data?.user?.email == props.authorEmail ? <div className="flex justify-center items-center" > <div className="flex gap-4 cursor-pointer" onClick={() => setEditMode(true)}>
            <Edit2 />
            <div>
              Edit
            </div>
          </div> </div> : null}
          <div>
            {props.htmlSectionsSeppedByFiles.map((secc: string, curIndex: number) => {
              return <div key={curIndex}>
                {secc.slice(0, 19) == "<div data-filename=" ?
                  <ExcalidrawFromDataDiv secc={secc} drawings={drawings} theme={theme} />
                  : <BlogInnerContent secc={secc} title={getTitleFromContent(props.markdownText)} />
                }
              </div>
            })}
          </div>
      </div>
    );
  }
};

export default BlogViewClient;
