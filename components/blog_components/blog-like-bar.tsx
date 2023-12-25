"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import LoginDialogContent from "../login-dialog-content";

const CommentButton = () => {
  return (
    <div>
      <MessageCircle className="inline"></MessageCircle> Comment
    </div>
  );
};

const BlogLikeBar = (props: { blogId: string }) => {
  "use client";
  const [commentMode, setCommentMode] = useState(false);
  const [showDialog, setShowDialog] = useState("closed");

  const session = useSession();
  console.log("session data user is: ", session.data?.user);
  if (session.data?.user) {
    return (
      <div className="flex flex-row gap-4 mt-7">
        <Button
          onClick={async () => {
            // sendLike(props.blogId, session);
            console.log("like button was clicked as loggedin");
          }}
        >
          <Heart className="inline mr-2"></Heart> Like
        </Button>
        <Button
          onClick={() => {
            console.log("comment button was clicked as loggedin");
            if (session?.data?.user) {
              setCommentMode(true);
            } else {
              setShowDialog("open");
            }
            //...
          }}
        >
          <CommentButton />
        </Button>
      </div>
    );
  } else {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-row gap-4 mt-7">
            <Button>
              <Heart className="inline"></Heart> Like
            </Button>
            <Button>
              <CommentButton />
            </Button>
          </div>
        </DialogTrigger>
        <LoginDialogContent />
      </Dialog>
    );
  }
};

export default BlogLikeBar;
