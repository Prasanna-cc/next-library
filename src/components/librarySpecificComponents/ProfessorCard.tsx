import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import ProfessorForm from "./adminComponents/ProfessorForm";
import { IProfessor } from "@/lib/models/professor.model";
import CustomDialog from "../CustomDialog";

interface ProfessorCardProps {
  // name: string;
  // department: string;
  // email: string;
  details: Partial<IProfessor>;
  editHandler?: () => void;
}

const ProfessorCard: React.FC<ProfessorCardProps> = ({
  // name,
  // department,
  // email,
  details,
  editHandler,
}) => {
  const { data: session } = useSession();

  return (
    <Card className="w-full relative">
      {/* Edit Button */}
      {editHandler && session?.user.role === "admin" && (
        <CustomDialog
          triggerButtonVariant="ghost"
          triggerButtonSize="sm"
          triggerText={<Edit className="w-4 h-4" />}
          triggerButtonClass="absolute top-2 right-2 rounded-full"
        >
          <ProfessorForm professorData={details as IProfessor} />
        </CustomDialog>
        // <Button
        //   variant="ghost"
        //   onClick={editHandler}
        //   size="sm"
        //   className="absolute top-2 right-2"
        // >
        //   <Edit className="w-4 h-4" />
        // </Button>
      )}

      <CardContent className="p-4 flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {(details.name || "")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-semibold">{details.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {details.department}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Mail className="h-3 w-3 mr-1" />
            {details.email}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessorCard;
