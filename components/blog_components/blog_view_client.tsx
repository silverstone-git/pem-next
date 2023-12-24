"use client";

import { getDrawingsByBlogId } from "@/lib/blog/blogpost";
import { Excali } from "@/lib/models";
import { useEffect, useState } from "react";
import LoadingCard from "../loading_card";
import dynamic from "next/dynamic";

const BlogViewClient = (props: {
  htmlSectionsSeppedByDrawings: string[];
  blogId: string;
}) => {
  const initialDrawings: Excali[] = [];
  const [drawings, setDrawings] = useState(initialDrawings);

  const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
      ssr: false,
    }
  );

  console.log("sections are: ", props.htmlSectionsSeppedByDrawings);

  useEffect(() => {
    if (props.htmlSectionsSeppedByDrawings.length > 1) {
      getDrawingsByBlogId(props.blogId).then((val: Excali[]) => {
        console.log("got drawings, the first is: ", val[0].elements);
        setDrawings(val);
      });
    }
  }, [props.blogId, props.htmlSectionsSeppedByDrawings.length]);

  return (
    <div>
      {props.htmlSectionsSeppedByDrawings.map(
        (el: string, curIndex: number) => {
          return (
            <div key={curIndex}>
              <div dangerouslySetInnerHTML={{ __html: el }}></div>
              {drawings.length > 0 ? (
                <Excalidraw
                  initialData={drawings[curIndex]}
                  isCollaborating={false}
                />
              ) : props.htmlSectionsSeppedByDrawings.length > 1 ? (
                <LoadingCard />
              ) : null}
            </div>
          );
        }
      )}
    </div>
  );
};

export default BlogViewClient;
