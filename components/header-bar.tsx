import { auth } from "@/app/auth";
import { ModeToggle } from "./shadcn-buttons/mode-toggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogoutAction } from "./auth-actions";

const LogoutButton = async () => {
  return (
    <div>
      <form action={LogoutAction}>
        <Button variant={"outline"}>Log Out</Button>
      </form>
    </div>
  );
};

const LoginButton = () => {
  return (
    <Link href={"/api/auth/signin"}>
      <Button variant={"outline"}>Sign In</Button>
    </Link>
  );
};

const HeaderBar = async () => {
  const session = await auth();
  return (
    <div>
      <div className="h-[8vh] dark:bg-zinc-900 bg-zinc-100 flex items-center justify-between w-full dark:text-zinc-100 text-zinc-900 px-8">
        <Link
          href={"/"}
          className="font-whisper hover:cursor-pointer text-3xl font-extrabold hover:dark:text-pink-300 hover:text-pink-700"
        >
          Please Explain Me!
        </Link>
        <div className="flex gap-4 items-center">
          <div>
            <ModeToggle></ModeToggle>
          </div>
          <div>{session?.user ? <LogoutButton /> : <LoginButton />}</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
