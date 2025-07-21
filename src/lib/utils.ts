import { currentUser } from "@clerk/nextjs/server";

export const getUserRole = async () => {
  const user = await currentUser();
  return user?.publicMetadata.role as string;
};

export const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
};
