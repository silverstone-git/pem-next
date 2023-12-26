import { User } from "next-auth";
import { useEffect, useState } from "react";
import LoadingCard from "../loading_card";
import CommentCard from "./comment_card";
import { BlogComment, commentsPageLength } from "@/lib/models";
import { getLatestComments, sendComment } from "@/lib/blog/blogpost";
import { ArrowRight } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const CommentInput = (props: {blogComments: BlogComment[]; setBlogComments: any, userObj: User}) => {
  const [commentEntered, setCommentEntered] = useState("");
  return (
    <div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          console.log("entered comment is: ", commentEntered);
	  const newComment: BlogComment = {
	  	commentId: "",
		name: props.userObj.name ?? "",
		email: props.userObj.email ?? "",
		dateAdded: new Date(),
		content: commentEntered
	  }
	  props.setBlogComments([...props.blogComments, newComment])
	  console.log("sending comment");
	  sendComment(newComment).then((val) => {
	  console.log("sent comment");
	  });
        }}
      >
        <Label className="mt-7" htmlFor="comment-input">
          Enter your comment <ArrowRight className="inline" />{" "}
        </Label>
        <Input
          type="text"
          id="comment-input"
          onChange={(e) => setCommentEntered(e.target.value.trim())}
        />
        <Button type="submit" className="my-8">
          Submit
        </Button>
      </form>
    </div>
  );
};

const BlogComments = (props: { blogId: string; userObj: User }) => {
  const [loadingComments, setLoadingComments] = useState(true);
  const initCommentsArr: BlogComment[] = [];
  const [blogComments, setBlogComments] = useState(initCommentsArr);
  useEffect(() => {
    getLatestComments(
      props.blogId,
      blogComments.length > 0
        ? blogComments[blogComments.length - 1].commentId
        : null
    ).then((val) => {
      setLoadingComments(false);
      setBlogComments([...blogComments, ...val]);
    });
  }, []);
  if (loadingComments) {
    return (
      <div className="w-full h-[40vh] flex flex-col gap-4">
        {Array.from(Array(commentsPageLength - 3).keys()).map((el, index) => {
          return <LoadingCard key={index} />;
        })}
        <CommentInput blogComments={blogComments} setBlogComments={setBlogComments} userObj={props.userObj} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-6 py-8">
        {blogComments.map((el, index) => {
          return (
            <CommentCard key={index} blogComment={el} userObj={props.userObj} />
          );
        })}
        <CommentInput blogComments={blogComments} setBlogComments={setBlogComments} userObj={props.userObj} />
      </div>
    );
  }
};

export default BlogComments;
