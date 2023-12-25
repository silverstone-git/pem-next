"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import LoginDialogContent from "../login-dialog-content";
import { useTheme } from "next-themes";

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
      className={`py-3 px-4 flex flex-row gap-2 dark:text-zinc-100 text-zinc-900 ${filledHeart ? "" :  "hover:dark:text-pink-300 hover:text-pink-700 cursor-pointer"} border border-zinc-700 rounded-lg ${className}`}
    >
      <Heart
        fill={
          filledHeart && resolvedTheme === "dark"
            ? "white"
            : (filledHeart
            ? "black"
            : undefined)
        }
        className={`inline mr-2`}
      ></Heart>
      <div>Like</div>
    </div>
  );
};

const BlogLikeBar = (props: { blogId: string }) => {
  "use client";
  const [commentMode, setCommentMode] = useState(false);
  const [liked, setLiked] = useState(false);

  const session = useSession();
  console.log("session data user is: ", session.data?.user);
  if (session.data?.user) {
    return (
      <div className="flex flex-row gap-4 mt-7">
        {liked ? (
          <LikeButton filledHeart={true} />
        ) : (
          <LikeButton
            onClick={async () => {
              // sendLike(props.blogId, session);
              console.log("like button was clicked as loggedin");
              setLiked(true);
            }}
          />
        )}
        <CommentButton
          onClick={() => {
            console.log("comment button was clicked as loggedin");
            if (session?.data?.user) {
              setCommentMode(true);
            }
            //...
          }}
        />
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
