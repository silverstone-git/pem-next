"use client";
import { Blog } from "@/lib/models";
import { Button } from "../ui/button";
import Link from "next/link";

const BlogCardLanding = (props: { key: string; blog: Blog }) => {
  return (
    <div className="flex flex-col bg-zinc-200 dark:bg-zinc-800">
      <div>
        Written by {props.blog.name} at{" "}
        {props.blog.dateAdded.toISOString().slice(0, 10)}
      </div>
      <div>{`${props.blog.content.slice(0, 20)}...`}</div>
      <Link href={`/blogs/${props.blog.id}`}>
        <Button>Read Further</Button>
      </Link>
    </div>
  );
};

export default BlogCardLanding;
