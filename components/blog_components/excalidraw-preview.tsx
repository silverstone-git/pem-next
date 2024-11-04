import { getDrawingsByBlogId } from "@/lib/blog/blogpost";
import { Excali } from "@/lib/models";
import dynamic from "next/dynamic";

// Custom components for different file types
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

export const ExcalidrawPreview = async (props: {filename: string}) => {
  /*
    const drawings = await getDrawingsByBlogId(props.blogId);
    return (<div className="border rounded p-4 my-2 bg-gray-50">
    
      <Excalidraw
        initialData={drawings[curIndex]}
        viewModeEnabled={true}
        theme={
          theme === "light" || theme === "dark" ? theme : "dark"
        }
      />
  </div>
  );
*/
    return <p className="font-medium text-gray-700">Excalidraw Drawing: {props.filename}</p>
}
