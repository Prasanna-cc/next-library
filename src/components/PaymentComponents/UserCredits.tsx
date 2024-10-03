import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import BuyCredits from "./BuyCredits";
import { IMember } from "@/lib/models/member.model";

interface UserCreditsProps {
  user: IMember;
  // onAddCredits?: () => void;
}

const UserCredits: React.FC<UserCreditsProps> = ({ user }) => {
  const [credits, setCredits] = useState(user?.wallet);

  const onSuccess = (amount: number) => {
    setCredits((prevCredits) => {
      const updatedCredits = prevCredits + amount;
      return updatedCredits;
    });
  };

  return (
    <div className="flex items-center justify-between  border pl-2 rounded-full">
      <div className="flex items-center">
        <Coins className="w-4 h-4" />
        <span className="max-w-24 overflow-x-auto no-scrollbar px-4 text-xs font-semibold">
          {credits}
        </span>
      </div>
      {user ? (
        <BuyCredits onSuccess={onSuccess} user={user} />
      ) : (
        <div className="h-8 w-8" />
      )}
    </div>
  );
};

export default UserCredits;
