import { auth } from "../auth";

const writerPage = async () => {
  // this is the writer page, auth the guy and let him
  // ask the guy for the md file and it'll upload
  const session = await auth();
  if (session) {
    return (
      <div>
        <div>
          Hi {session.user?.name}, we will now check if you are a writer or not
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>Please log in to write on PEM</div>
      </div>
    );
  }
};

export default writerPage;
