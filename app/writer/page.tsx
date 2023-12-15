import { auth } from "../auth";

const writerPage = async () => {
  // this is the writer page, auth the guy and let him
  // ask the guy for the md file and it'll upload
  const session = await auth();
  if (session?.user?.email === "silverstone965@gmail.com") {
    return (
      <div>
        <div>
          Hi writer upload article here ----
          <input type="text" />
        </div>
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
