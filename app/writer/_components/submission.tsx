"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { submitBlogToDB } from "@/lib/blog/blogpost";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SubmissionComponent = () => {
  const [fileStr, setFileStr] = useState("");
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
    //
    if (e.target.files == null) return;
    const fileList = Array.from(e.target.files);
    const file = fileList[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      if (reader.result == null) return;
      console.log("text is: ", reader.result.slice(1, 20), "...");
      // send this to serber
      setFileStr(reader.result.toString());
    };
  };

  return (
    <div>
      Hi writer upload article here
      <div className="flex flex-col gap-4 w-[50%]">
        <input onChange={handleFile} type="file"></input>
        <Button
          onClick={() => {
            submitBlogToDB(userObj, fileStr).then(() => {
              console.log("blog submitted successffully!");
              router.push("/");
            });
          }}
        >
          Submit blog
        </Button>
      </div>
    </div>
  );
};

export default SubmissionComponent;
