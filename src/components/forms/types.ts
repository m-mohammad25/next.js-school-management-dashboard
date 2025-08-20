import { Dispatch, SetStateAction } from "react";

export type FormProps = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
};
