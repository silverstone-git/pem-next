"use server";
import { signOut } from "@/app/auth";

export async function LogoutAction() {
  await signOut();
}
