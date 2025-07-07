import Image from "next/image";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH */}
      <div className="hidden md:flex items-center gap-2 text-xs ring-[1.5px] ring-gray-300 px-2 rounded-full">
        <Image src="/search.png" alt="logo" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none p-2 bg-transparent w-[200px]"
        />
      </div>
      {/* ICONS & USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7  flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="logo" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <div className="absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center rounded-full text-xs text-white  bg-purple-500">
            1
          </div>
          <Image src="/announcement.png" alt="logo" width={20} height={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <Image
          src="/avatar.png"
          alt="avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
