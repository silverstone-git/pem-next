"use client";
import { DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import {useState} from "react";
import LoadingSpinner from "./spinner";

const LoginDialogContent = () => {
  const [email, setEmail] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  return (
    <DialogContent>
      <DialogHeader>Please Log In in to continue</DialogHeader>
      { loadingLogin ? <div className="h-[31vh] w-full flex justify-center items-center"><LoadingSpinner /></div>  : <form
      className="flex flex-col gap-2"
        action=""
        onSubmit={(e: any) => {
          e.preventDefault();
	  setLoadingLogin(true);
          console.log(email);
	  signIn("email", { email });
        }}
      >
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              E-Mail
            </Label>
            <Input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value.trim())}
              className="col-span-3"
              required
            />
          </div>
        </div>
	<div className="flex gap-2 pt-3 pb-5 self-center">
		<div className="dark:bg-zinc-300 bg-zinc-700 w-32 h-[1px] self-center"></div>
		<div>Or</div>
		<div className="dark:bg-zinc-300 bg-zinc-700 w-32 h-[1px] self-center"></div>
	</div>
        <div className="flex flex-col gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              signIn("github");
            }}
          >
            <Github className="mx-4" /> Github
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              signIn("google");
            }}
          >
            <svg
              className="dark:fill-zinc-100 fill-zinc-900 mx-4"
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="15.25"
              viewBox="0 0 488 512"
            >
              <path
                opacity="1"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              />
            </svg>
            Google
          </Button>
        </div>
        <DialogFooter>
          <Button className="mt-2" type="submit">
            Log In
          </Button>
        </DialogFooter>
      </form>}
    </DialogContent>
  );
};
export default LoginDialogContent;
