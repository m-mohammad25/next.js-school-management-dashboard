import Link from "next/link";
import Image from "next/image";

type MenuItemProps = {
  label: string;
  icon: string;
  path: string;
};

const MenuItem = ({ label, icon, path }: MenuItemProps) => {
  return (
    <Link
      href={path}
      className="rounded-md hover:bg-lamaSkyLight  flex items-center justify-center lg:justify-start py-2 md:px-2 text-gray-500 gap-4"
    >
      <Image src={icon} alt={label} width={20} height={20} />
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
};

export default MenuItem;
