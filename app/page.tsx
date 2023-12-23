import LandingPage from "@/components/landing-page";
import { getLatestBlogs } from "@/lib/blog/blogpost";
import { Blog } from "@/lib/models";
export default async function Home() {
  const res: Blog[] = await getLatestBlogs(null);

  return (
    <div>
      <LandingPage res={res}></LandingPage>
    </div>
  );
}
