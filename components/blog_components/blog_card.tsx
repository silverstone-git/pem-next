import { Blog } from "@/lib/models";
import { Button } from "../ui/button";
import Link from "next/link";

const BlogCardLanding = (props: { blogObj: any }) => {
  const title = props.blogObj["content"].match(/^#.*/gm);
  var titleString: string = "";
  if (title != null && title instanceof Array) {
    //console.log("found the title:");
    titleString = title[0].toString().trim().slice(1).trim();
    //console.log(titleString);
  }
  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold mb-2">{titleString}</div>
      <div>{`${props.blogObj["content"]
        .slice(0, 400)
        .replace(/[^A-Za-z0-9]/g, " ")}...`}</div>
      <Link className="mt-2" href={`/blogs/${props.blogObj["_id"].toString()}`}>
        <Button>Read Further</Button>
      </Link>
    </div>
  );
};

export default BlogCardLanding;
