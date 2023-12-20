import LoadingCard from "./loading_card";

const Loading = () => {
  return (
    <div className="h-[70vh] w-full flex flex-col gap-16 justify-center">
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  );
};
export default Loading;
