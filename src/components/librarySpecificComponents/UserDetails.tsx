import { findMember } from "@/lib/actions";
import MemberEditForm from "./adminComponents/MemberEditForm";

type Props = {
  id: number;
  handleBack: () => void;
};

export const UserEdit = async ({ id, handleBack }: Props) => {
  try {
    const userDetails = await findMember(id);
    if (!userDetails) throw new Error("Internal issue try again.");
    return <MemberEditForm member={userDetails} handleBack={handleBack} />;
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};
