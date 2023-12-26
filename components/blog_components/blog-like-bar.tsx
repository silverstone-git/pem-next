"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import LoginDialogContent from "../login-dialog-content";
import { useTheme } from "next-themes";
import { sendLike } from "@/lib/blog/blogpost";
import BlogComments from "./blog_comments";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Accordion } from "../ui/accordion";

const CommentButton = ({ onClick = () => {}, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="py-3 px-4 flex flex-row gap-2 dark:text-zinc-100 text-zinc-900 hover:dark:text-pink-300 hover:text-pink-700 border border-zinc-700 rounded-md"
    >
      <MessageCircle className="inline"></MessageCircle>
      <div>Comment</div>
    </button>
  );
};

const LikeButton = ({
  onClick = () => {},
  className = "",
  filledHeart = false,
  ...props
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`py-3 px-4 flex flex-row gap-2 dark:text-zinc-100 text-zinc-900 ${
        filledHeart
          ? ""
          : "hover:dark:text-pink-300 hover:text-pink-700 cursor-pointer"
      } border border-zinc-700 rounded-lg ${className}`}
    >
      <Heart
        fill={
          filledHeart && resolvedTheme === "dark"
            ? "white"
            : filledHeart
            ? "black"
            : undefined
        }
        className={`inline mr-2`}
      ></Heart>
      <div>Like</div>
    </div>
  );
};

const BlogLikeBar = (props: {
  blogId: string;
  alreadyLiked: string[] | null;
}) => {
  "use client";
  const [commentMode, setCommentMode] = useState(false);
  const [liked, setLiked] = useState(
    props.alreadyLiked == null
      ? false
      : props.alreadyLiked.find((val) => props.blogId == val)
  );

  const session = useSession();
  console.log("session data user is: ", session.data?.user);
  if (session.data?.user) {
    return (
      <div className="flex flex-col gap-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <div className="flex flex-row gap-4 mt-7">
              {liked ? (
                <LikeButton filledHeart={true} />
              ) : (
                <LikeButton
                  onClick={async () => {
                    console.log("like button was clicked as loggedin");
                    setLiked(true);
                    sendLike(props.blogId, session.data?.user).then((val) => {
                      console.log(
                        "<<stop loading>>\n\n like action successfully performed"
                      );
                    });
                  }}
                />
              )}
              <AccordionTrigger>
                <CommentButton
                  onClick={() => {
                    console.log("comment button was clicked as loggedin");
                    if (session?.data?.user) {
                      setCommentMode(true);
                    }
                    //...
                  }}
                />
              </AccordionTrigger>
            </div>
            <AccordionContent>
              {commentMode ? (
                <BlogComments
                  blogId={props.blogId}
                  userObj={session.data.user}
                />
              ) : null}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  } else {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-row gap-4 mt-7 w-fit">
            <LikeButton />
            <CommentButton />
          </div>
        </DialogTrigger>
        <LoginDialogContent />
      </Dialog>
    );
  }
};

export default BlogLikeBar;
