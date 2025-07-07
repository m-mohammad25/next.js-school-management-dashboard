type MenuTitleProps = {
  title: string;
  className?: string;
};

const MenuTitle = ({ title, className }: MenuTitleProps) => {
  return <span className={className}>{title}</span>;
};

export default MenuTitle;
