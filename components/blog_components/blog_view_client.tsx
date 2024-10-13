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

const BlogViewClient = (props: {
  htmlSectionsSeppedByDrawings: string[];
  blogId: string;
  markdownText: string;
}) => {

  const session = useSession();
  const initialDrawings: Excali[] = [];
  const [drawings, setDrawings] = useState(initialDrawings);
  const [editMode, setEditMode] = useState(false);
  const [htmlStringEditPreview, setHTMLStringEditPreview] = useState("");

  const [markdownEdit, setMarkdownEdit] = useState(props.markdownText);

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
      ssr: false,
    }
  );

  useEffect(() => {
    if (props.htmlSectionsSeppedByDrawings.length > 1) {
      getDrawingsByBlogId(props.blogId).then((val: Excali[]) => {
        console.log("got drawings: ", val);
        setDrawings(val);
      });
    }
  }, [props.blogId, props.htmlSectionsSeppedByDrawings.length]);

  const handleMarkdownChange = async (val: string) => {
    console.log("change: ", val);
    setMarkdownEdit(val);
  }

  const { theme } = useTheme();


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
              marked.use(markedKatex({ throwOnError: false }));
              const htmlString = await marked.parse(markdownEdit);
              const htmlPureString = DOMPurify.sanitize(htmlString);
              console.log(htmlPureString)

              setHTMLStringEditPreview(htmlPureString);
            } else {
              console.log("marked is: ", marked);
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
        {props.htmlSectionsSeppedByDrawings.map(
          (el: string, curIndex: number) => {
            return (
              <div key={curIndex}>
                <div className="flex justify-center items-center" > <div className="flex gap-4 cursor-pointer" onClick={() => setEditMode(true)}>
                  <Edit2 />
                  <div>
                    Edit
                  </div>
                </div> </div>
                <div dangerouslySetInnerHTML={{ __html: el }}></div>
                {drawings.length > 0 && curIndex < drawings.length ? (
                  <div className="h-[50vh] w-full">
                    <Excalidraw
                      initialData={drawings[curIndex]}
                      viewModeEnabled={true}
                      theme={
                        theme === "light" || theme === "dark" ? theme : "dark"
                      }
                    />
                  </div>
                ) : props.htmlSectionsSeppedByDrawings.length > 1 &&
                  curIndex < drawings.length ? (
                  <LoadingCard />
                ) : null}
              </div>
            );
          }
        )}
      </div>
    );
  }
};

export default BlogViewClient;
