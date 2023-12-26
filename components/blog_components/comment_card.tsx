import { BlogComment } from "@/lib/models";
import { Dot } from "lucide-react";
import { User } from "next-auth";

const CommentCard = (props: { blogComment: BlogComment; userObj: User }) => {
  return (
    <div className="flex flex-col gap-2 text-lg border dark:border-zinc-200 border-zinc-400 rounded-lg py-4 px-6 w-full">
      <div className="flex gap-2 text-sm">
        <div>
          {" "}
          {props.blogComment.email == props.userObj.email
            ? "You"
            : props.blogComment.name}
        </div>
        <div>
          <Dot />
        </div>
        <div>
          {" "}
          {new Date().valueOf() - props.blogComment.dateAdded.valueOf() > 120000
            ? props.blogComment.dateAdded.toISOString()
            : "just now"}
        </div>
      </div>
      <div>{props.blogComment.content}</div>
    </div>
  );
};
export default CommentCard;
