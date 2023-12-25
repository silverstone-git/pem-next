"use client";

export function refreshLocal(resArray: any[]) {
  if (typeof window === "undefined") return;
  console.log("so the code is being run on the client");
  const blogsRn: any[] = JSON.parse(localStorage.getItem("blogs") ?? "[]");
  const newBlogObjects = resArray.map((el) => {
    const blogId = el._id.toString();
    const blogObj: any = {};
    blogObj[blogId] = el;
    return blogObj;
  });
  if (blogsRn && blogsRn.length > 0) {
    localStorage.setItem(
      "blogs",
      JSON.stringify([...blogsRn, ...newBlogObjects])
    );
  } else {
    localStorage.setItem("blogs", JSON.stringify([...newBlogObjects]));
  }
}


export const getTitleFromContent = (blogContent: string) => {
  const title = blogContent.match(/^#.*/gm);

  if (title != null && title instanceof Array) {
    //console.log("found the title:");
    return title[0].toString().trim().slice(1).trim();
    //console.log(titleString);
  } else {
    return "";
  }
};

