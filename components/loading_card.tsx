import { Skeleton } from "./ui/skeleton";

const LoadingCard = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-1/2 h-6 " />
      <Skeleton className="w-full h-16 " />
      <Skeleton className="w-1/3 h-6 " />
    </div>
  );
};

export default LoadingCard;
