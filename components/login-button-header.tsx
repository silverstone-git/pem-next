"use client";

import LoginDialogContent from "./login-dialog-content";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";

const LoginButtonHeader = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Sign In</Button>
      </DialogTrigger>
      <LoginDialogContent />
    </Dialog>
  );
};

export default LoginButtonHeader;
