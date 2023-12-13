"use client";

import { useSession } from "next-auth/react";
import { ModeToggle } from "./shadcn-buttons/mode-toggle";
import { Button } from "./ui/button";
import { LogoutAction } from "./auth-actions";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  return (
    <div>
      <form action={LogoutAction}>
        <Button variant={"outline"}>Log Out</Button>
      </form>
    </div>
  );
};

const LoginButton = () => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      onClick={() => {
        router.replace("/api/auth/signin");
      }}
    >
      Sign In
    </Button>
  );
};

const HeaderBar = () => {
  const session = useSession();
  return (
    <div>
      <div className="h-16 dark:bg-zinc-900 bg-zinc-100 flex items-center justify-between w-full dark:text-zinc-100 text-zinc-900 px-4">
        <div className="font-whisper text-3xl font-extrabold">
          Please Explain Me!
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <ModeToggle></ModeToggle>
          </div>
          <div>{session.data?.user ? <LogoutButton /> : <LoginButton />}</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
