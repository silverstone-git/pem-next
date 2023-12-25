import { User } from "next-auth";
import { useEffect, useState } from "react";
import LoadingCard from "../loading_card";
import CommentCard from "./comment_card";
import {BlogComment, commentsPageLength} from "@/lib/models";
import {getLatestComments} from "@/lib/blog/blogpost";

const BlogComments = (props: { blogId: string; userObj: User }) => {
  const [loadingComments, setLoadingComments] = useState(true);
  const initCommentsArr: BlogComment[] = [];
  const [blogCommentsArr, setBlobCommentsArr] = useState(initCommentsArr);
  useEffect(() => {
    getLatestComments(props.blogId, blogCommentsArr.length > 0 ? blogCommentsArr[blogCommentsArr.length - 1].commentId : null);
  }, []);
  if (loadingComments) {
    return (
      <div className="w-full h-[40vh] flex flex-col">
        {Array.from(Array(commentsPageLength - 3).keys()).map((el, index) => {
          return <LoadingCard key={index} />;
        })}
      </div>
    );
  } else {
    return <div className="flex flex-col">
    {blogCommentsArr.map((el, index) => {
    	return <CommentCard key={index} blogComment={el} userObj={props.userObj} />
    })}
    </div>;
  }
};

export default BlogComments;
