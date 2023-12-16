"use client";
export function refreshLocal(resArray: any[]) {
  if (typeof window === "undefined") return;
  console.log("so the code is being run on the client");
  const blogsRn: any[] = JSON.parse(localStorage.getItem("blogs") ?? "[]");
  const newBlogObjects = resArray.map((el) => {
    const id = el._id.toString();
    const blogObj: any = {};
    blogObj[id] = el;
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
