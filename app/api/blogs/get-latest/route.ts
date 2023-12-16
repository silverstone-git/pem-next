import { getLatestBlogs } from "@/lib/blog/blogpost";

export async function GET() {
  const res = await getLatestBlogs();

  return Response.json({ res });
}
