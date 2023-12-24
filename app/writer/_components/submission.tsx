"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { submitBlogToDB } from "@/lib/blog/blogpost";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Excali } from "@/lib/models";
import { Input } from "@/components/ui/input";

const SubmissionComponent = () => {
  const [fileStr, setFileStr] = useState("");
  const [category, setCatgory] = useState("");
  const initExcaliDrawings: Excali[] = [];
  const [excalidrawings, setExcalidrawings] = useState(initExcaliDrawings);
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

  const getExcaliDrawingsFromFileList = async (fileList: File[]) => {
    const excaliDrawingsLocal: Excali[] = [];
    for (var i = 0; i < fileList.length; i++) {
      // looping through the .excalidraw.md files
      const reader = new FileReader();
      reader.readAsText(fileList[i]);

      reader.onloadend = () => {
        if (reader.result == null) return;
        // the text content
        const excaliMdText = reader.result.toString();
        var jsonText = excaliMdText.substring(
          excaliMdText.indexOf("```") + 3,
          excaliMdText.lastIndexOf("```") - 1
        );
        jsonText = jsonText.substring(
          jsonText.indexOf("{"),
          jsonText.lastIndexOf("}") + 1
        );

        const excaliObj = JSON.parse(jsonText);
        const excali: Excali = {
          elements: excaliObj.elements,
          appState: excaliObj.appState,
          files: excaliObj.files,
          scrollToContent: true,
        };
        excaliDrawingsLocal.push(excali);
      };
    }
    return excaliDrawingsLocal;
  };

  const handleExcalidrawFiles = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files == null) return;
    const fileList = Array.from(e.target.files);

    const excalidrawingsRes: Excali[] = await getExcaliDrawingsFromFileList(fileList);
    setExcalidrawings(excalidrawingsRes);
  };

  return (
    <div className="h-[85vh] w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 w-[50%]">
        <form
          className="flex flex-col gap-4"
          onSubmit={() => {
            submitBlogToDB(userObj, fileStr, category, excalidrawings).then(
              () => {
                console.log("blog submitted successfully!");
                router.replace("/");
              }
            );
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="file-picker-blog-markdown">
              Choose a Blog File (.md)
            </label>
            <Input
              id="file-picker-blog-markdown"
              onChange={handleFile}
              type="file"
              required
            ></Input>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="blog-category-input-field">
              Write down a category for this article
            </label>
            <Input
              id="blog-category-input-field"
              onChange={(event) => {
                setCatgory(event.target.value.trim());
              }}
              type="text"
              required
            ></Input>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="file-picker-images">
              Select all the .excalidraw.md files for this blog
            </label>
            <Input
              id="file-picker-excalidraw"
              onChange={handleExcalidrawFiles}
              type="file"
              multiple={true}
            />
          </div>
          <Button type="submit">Submit blog</Button>
        </form>
        {/*<Button
          onClick={() => {
            console.log("excalidrawings is: ");
            console.log(excalidrawings);
          }}
        >
          Log Excali
        </Button>*/}
      </div>
    </div>
  );
};

export default SubmissionComponent;
