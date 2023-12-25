"use client";

import { getDrawingsByBlogId } from "@/lib/blog/blogpost";
import { Excali } from "@/lib/models";
import { useEffect, useState } from "react";
import LoadingCard from "../loading_card";
import { useTheme } from "next-themes";
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

  useEffect(() => {
    if (props.htmlSectionsSeppedByDrawings.length > 1) {
      getDrawingsByBlogId(props.blogId).then((val: Excali[]) => {
        console.log("got drawings: ", val);
        setDrawings(val);
      });
    }
  }, [props.blogId, props.htmlSectionsSeppedByDrawings.length]);

  const { theme } = useTheme();

  return (
    <div>
      {props.htmlSectionsSeppedByDrawings.map(
        (el: string, curIndex: number) => {
          return (
            <div key={curIndex}>
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
};

export default BlogViewClient;
