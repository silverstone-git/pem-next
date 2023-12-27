import { BlogComment } from "@/lib/models";
import { Dot } from "lucide-react";
import { User } from "next-auth";

const CommentCard = (props: { blogComment: BlogComment; userObj: User }) => {
  const kitnaPuranaComment =
    new Date().valueOf() - props.blogComment.dateAdded.valueOf();
  return (
    <div className="flex flex-col gap-2 text-lg border dark:border-zinc-200 border-zinc-400 rounded-lg py-4 px-6 w-full">
      <div className="flex gap-1 text-xs md:text-sm items-center">
        <div>
          {" "}
          {props.blogComment.email == props.userObj.email
            ? "You"
            : props.blogComment.name}
        </div>
        <div className="h-full flex items-center">
          <Dot />
        </div>
        <div>
          {" "}
          {kitnaPuranaComment > 31078079999
            ? `${Math.round(
                kitnaPuranaComment / (1000 * 60 * 60 * 24 * 30 * 12)
              )} years ago`
            : kitnaPuranaComment > 2583359999
            ? `${Math.round(
                kitnaPuranaComment / (1000 * 60 * 60 * 24 * 30)
              )} months ago`
            : kitnaPuranaComment > 86040000
            ? `${Math.round(
                kitnaPuranaComment / (1000 * 60 * 60 * 24)
              )} days ago`
            : kitnaPuranaComment > 3540000
            ? `${Math.round(kitnaPuranaComment / (1000 * 60 * 60))} hours ago`
            : kitnaPuranaComment > 59000
            ? `${Math.round(kitnaPuranaComment / (1000 * 60))} minutes ago`
            : kitnaPuranaComment > 10000
            ? `${Math.round(kitnaPuranaComment / 1000)} seconds ago`
            : "just now"}
        </div>
      </div>
      <div className="text-sm md:text-md">{props.blogComment.content}</div>
    </div>
  );
};
export default CommentCard;
