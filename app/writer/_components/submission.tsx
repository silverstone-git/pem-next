"use client";
import { useSession } from "next-auth/react";
import React, { MutableRefObject, useState } from "react";
import { submitBlogToDB } from "@/lib/blog/blogpost";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SubmissionComponent = () => {
  const [fileStr, setFileStr] = useState("");
  const [category, setCatgory] = useState("");
  const session = useSession();
  const router = useRouter();
  const userObj = {
    name: session.data?.user?.name ?? "",
    email: session.data?.user?.email ?? "",
  };

  /*
  function blobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject();
        }
      };
      reader.readAsDataURL(blob);
    });
  }
  const parseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // parses image into blob string once input is filled in
    if (e.target.files == null) return;
    const fileList = Array.from(e.target.files);
    if (fileList) {
      const file = fileList[0];
      const blob = new Blob([file], { type: "image/*" });
      const blobStr: string = await blobToBase64(blob);
      setImageStr(blobStr);
    }
  };
  */

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    const fileList = Array.from(e.target.files);
    const file = fileList[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      if (reader.result == null) return;
      // send this to serber
      setFileStr(reader.result.toString());
    };
  };

  return (
    <div className="h-[85vh] w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 w-[50%]">
        <form
          className="flex flex-col gap-4"
          onSubmit={() => {
            submitBlogToDB(userObj, fileStr, category).then(() => {
              console.log("blog submitted successffully!");
              router.replace("/");
            });
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="file-picker-blog-markdown">
              Choose a Blog Markdown File
            </label>
            <input
              className="bg-zinc-200 dark:bg-zinc-800"
              id="file-picker-blog-markdown"
              onChange={handleFile}
              type="file"
              required
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="blog-category-input-field">
              Write down a category for this article
            </label>
            <input
              className="bg-zinc-200 dark:bg-zinc-800"
              id="blog-category-input-field"
              onChange={(event) => {
                setCatgory(event.target.value.trim());
              }}
              type="text"
              required
            ></input>
          </div>
          <Button type="submit">Submit blog</Button>
        </form>
      </div>
    </div>
  );
};

export default SubmissionComponent;
