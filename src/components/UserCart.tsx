import Image from "next/image";

const UserCart = ({ type }: { type: string }) => {
  return (
    <div className="rounded-2xl p-4 even:bg-lamaYellow odd:bg-lamaPurple flex-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] bg-white rounded-full px-2 py-1 text-green-600">
          2025/6
        </span>
        <Image src="/more.png" alt="more" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">1,234</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};
export default UserCart;
