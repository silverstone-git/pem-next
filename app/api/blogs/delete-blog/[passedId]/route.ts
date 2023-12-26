import {deleteBlogById} from "@/lib/blog/blogpost";
import {redirect} from "next/navigation";

export async function GET(request: Request, { params }: { params: { passedId: string } }) {
	// await deleteBlogById(params.passedId);
	redirect("http://localhost:3000/");
}
