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

const CommentInput = (props: {
  blogComments: BlogComment[];
  setBlogComments: any;
  userObj: User;
  blogId: string;
}) => {
  const [commentEntered, setCommentEntered] = useState("");
  return (
    <div>
      <form
        action=""
        onSubmit={(e: any) => {
          e.preventDefault();
          e.target.reset();
          const curDate: Date = new Date();
          const newComment: BlogComment = {
            commentId: "",
            blogId: props.blogId,
            name: props.userObj.name ?? "",
            email: props.userObj.email ?? "",
            dateAdded: curDate,
            content: commentEntered,
          };
          props.setBlogComments([newComment, ...props.blogComments]);
          console.log("sending comment");
          sendComment(newComment).then((val) => {
            console.log("sent comment");
          });
        }}
      >
        <Label className="mt-6" htmlFor="commshesent-input">
          Enter your comment <ArrowRight className="inline" />{" "}
        </Label>
        <Input
	className="mt-2"
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
  const [lastPage, setLastPage] = useState(false);

  const getNextPage = async (blogId: string) => {
    const res = await getLatestComments(
      props.blogId,
      blogComments.length > 0
        ? blogComments[blogComments.length - 1].commentId
        : null
    );
    setLoadingComments(false);
    setBlogComments([...blogComments, ...res]);
    if (res.length < commentsPageLength) {
      setLastPage(true);
    }
  };

  useEffect(() => {
    getNextPage(props.blogId);
  }, [props.blogId]);
  if (loadingComments) {
    return (
      <div className="w-full h-[40vh] flex flex-col gap-4">
        <CommentInput
          blogComments={blogComments}
          setBlogComments={setBlogComments}
          userObj={props.userObj}
          blogId={props.blogId}
        />
        {Array.from(Array(commentsPageLength - 3).keys()).map((el, index) => {
          return <LoadingCard key={index} />;
        })}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-6 py-8">
        <CommentInput
          blogComments={blogComments}
          setBlogComments={setBlogComments}
          userObj={props.userObj}
          blogId={props.blogId}
        />
        {blogComments.map((el, index) => {
          return (
            <CommentCard key={index} blogComment={el} userObj={props.userObj} />
          );
        })}
        {lastPage ? null : (
          <Button
            className="my-4"
            variant={"outline"}
            onClick={() => getNextPage(props.blogId)}
          >
            Load More
          </Button>
        )}
      </div>
    );
  }
};

export default BlogComments;
