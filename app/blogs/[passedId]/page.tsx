import { auth } from "@/app/auth";
import { useSession } from "next-auth/react";

const IdPage = async ({ params }: { params: { passedId: String } }) => {
  // on the basis of this id, we fetch a post from fetch api
  const session = await auth();
  if (session?.user) {
    return (
      <p>
        {" "}
        welcome {session.user.name} This is id page: {params.passedId}
      </p>
    );
  } else {
    return <p>Please login to view the blog, thank you so much</p>;
  }
};

export default IdPage;
