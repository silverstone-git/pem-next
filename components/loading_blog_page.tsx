import { Skeleton } from "./ui/skeleton";

const LoadingBlogPage = () => {
  return (
    <div className="h-[85vh] w-full flex justify-center">
      <div className="w-full flex flex-col gap-4 md:w-11/12 lg:w-2/3">
        <Skeleton className="h-8 w-2/6 mt-16" />
        <Skeleton className="h-16 w-1/3" />
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};
export default LoadingBlogPage;
