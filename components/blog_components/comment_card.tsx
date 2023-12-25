import { BlogComment } from "@/lib/models";
import { User } from "next-auth";

const CommentCard = (props: { blogComment: BlogComment; userObj: User }) => {
  return (
    <div className="flex flex-col-gap-4 border border-zinc-100 py-4 px-6 w-full">
      <div>{props.blogComment.content}</div>
      <div>
        By{" "}
        {props.blogComment.email == props.userObj.email
          ? "You"
          : props.blogComment.name}{" "}
        at {props.blogComment.dateAdded.toISOString()}
      </div>
    </div>
  );
};
export default CommentCard;
