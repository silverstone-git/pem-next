import { auth } from "../auth";
import SubmissionComponent from "./_components/submission";

const writerPage = async () => {
  // this is the writer page, auth the guy and let him
  // ask the guy for the md file and it'll upload
  const session = await auth();
  if (process.env.EMAILS_EDITORS!.split(";").findIndex((val) => session?.user?.email == val) != -1 ) {
    return (
      <div className="p-4">
        <SubmissionComponent></SubmissionComponent>
      </div>
    );
  } else if (session?.user) {
    return (
      <div>
        <div>Write to silverstone965@gmail.com to collaborate</div>
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
