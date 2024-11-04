import { Blog } from "@/lib/models";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft, Trash } from "lucide-react";
import BlogViewClient from "./blog_view_client";
import { Marked } from "marked";

import { markedHighlight } from "marked-highlight";

import hljs from "highlight.js";
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';
import go from 'highlight.js/lib/languages/go';
import matlab from 'highlight.js/lib/languages/matlab';

import { Session } from "next-auth";
import markedKatex from "marked-katex-extension";
import BlogLikeBar from "./blog-like-bar";
import { getUser } from "@/lib/blog/blogpost";
import DOMPurify from "isomorphic-dompurify";

import renderer from "@/lib/blog/renderer";
import { sepFiles } from "@/lib/utils";

const BlogView = async (props: {
  blog: Blog;
  passedId: string;
  authh: Session | null;
}) => {

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('c', c);
  hljs.registerLanguage('go', go);
  hljs.registerLanguage('matlab', matlab);

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  marked.setOptions({renderer, gfm: true, breaks: true});
  marked.use(markedKatex({ throwOnError: false }));

  const htmlString = await marked.parse(props.blog.content);
  const htmlPureString = DOMPurify.sanitize(htmlString);
  const htmlSectionsSeppedByFiles = await sepFiles(htmlPureString);

  var alreadyLiked = null;
  if (props.authh?.user?.email) {
    alreadyLiked = (await getUser(props.authh.user.email))?.liked;
  }

  return (
    <div className="flex flex-col items-center">
      <Link className="block md:absolute self-start mt-8 ml-8" href="/">
        {" "}
        <Button variant={"outline"}>
          {" "}
          <ArrowLeft /> {" "}Back{" "}
        </Button>
      </Link>
      <div className="px-8 w-full md:w-11/12 lg:w-2/3 blog-view-div">
        <div className="italic font-bold text-sm md:text-md my-6">
          <div className="flex flex-row gap-4">
            <div>
              {" "}
              Written by {props.blog.name} on{" "}
              {props.blog.dateAdded.toLocaleDateString()}{" "}
              {props.blog.email == props.authh?.user?.email ? (
                <div className="ml-4 hidden md:inline">
                  <Link href={"/api/blogs/delete-blog/" + props.blog.blogId}>
                    <Button variant={"destructive"} size={"icon"}>
                      <Trash></Trash>
                    </Button>
                  </Link>
                </div>
              ) : null}
            </div>
            {/*<div className="opacity-50 self-center justify-self-center">
              <EyeIcon className="inline" /> {props.blog.views}
            </div>*/}
          </div>
        </div>
        <BlogViewClient
          blogId={props.blog.blogId}
          authorEmail={props.blog.email}
          markdownText={props.blog.content}
          htmlSectionsSeppedByFiles={htmlSectionsSeppedByFiles}
        />
        <BlogLikeBar blogId={props.blog.blogId} alreadyLiked={alreadyLiked} />
      </div>
    </div>
  );
};

export default BlogView;
