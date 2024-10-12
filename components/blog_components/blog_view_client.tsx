"use client";

import { getDrawingsByBlogId } from "@/lib/blog/blogpost";
import { Excali } from "@/lib/models";
import { useEffect, useState } from "react";
import LoadingCard from "../loading_card";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import MarkdownEditor from "../markdown-editor";
import { Marked, marked } from "marked";
import { Button } from "../ui/button";
import markedKatex from "marked-katex-extension";
import DOMPurify from "isomorphic-dompurify";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const BlogViewClient = (props: {
  htmlSectionsSeppedByDrawings: string[];
  blogId: string;
  markdownText: string;
}) => {
  const initialDrawings: Excali[] = [];
  const [drawings, setDrawings] = useState(initialDrawings);
  const [editMode, setEditMode] = useState(false);
  const [htmlStringEditPreview, setHTMLStringEditPreview] = useState("");

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
    const htmlString = await marked.parse(val);
    const htmlPureString = DOMPurify.sanitize(htmlString);

    console.log(htmlPureString)
    setHTMLStringEditPreview(htmlPureString);


  }

  const { theme } = useTheme();


  if(editMode) {
    return <div className="flex flex-col gap-7 w-full">
        <MarkdownEditor markdownText={props.markdownText} onChange={handleMarkdownChange} />
        <div className="flex flex-col gap-4">
          <div>Preview</div>
          <div dangerouslySetInnerHTML={{__html: htmlStringEditPreview}} ></div>   
        </div>
      </div>
  } else {
    return (
      <div>
        {props.htmlSectionsSeppedByDrawings.map(
          (el: string, curIndex: number) => {
            return (
              <div key={curIndex}>
                <div className="cursor-pointer bg-green-100 text-green-900" onClick={() => setEditMode(true)}>EDIT</div>
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
