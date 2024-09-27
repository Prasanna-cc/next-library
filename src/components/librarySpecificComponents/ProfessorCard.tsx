"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Edit, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import ProfessorForm from "./adminComponents/ProfessorForm";
import { IProfessor } from "@/lib/models/professor.model";
import CustomDialog from "../CustomDialog";
import { Link } from "@/i18n/routing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { refreshCalendlyLink } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

interface ProfessorCardProps {
  details: Partial<IProfessor>;
  isAdmin?: boolean;
  isMobileView?: boolean;
  // onCheckStatus?: (professorId: string) => Promise<void>;
}

const ProfessorCard: React.FC<ProfessorCardProps> = ({
  details,
  isAdmin,
  isMobileView,
  // onCheckStatus,
}) => {
  const { data: session } = useSession();
  const [isChecking, setIsChecking] = React.useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    if (details.email) {
      try {
        const result = await refreshCalendlyLink(details.email);
        toast({
          variant: result.success ? "default" : "destructive",
          title: result.message,
        });
      } catch (error) {
        console.error("Error checking status:", error);

        error instanceof Error &&
          toast({
            variant: "destructive",
            title: error.message,
          });
      } finally {
        setIsChecking(false);
      }
    }
  };

  return (
    <Card className="w-full relative">
      {/* Edit Button */}
      {isAdmin && session?.user.role === "admin" && (
        <CustomDialog
          triggerButtonVariant="ghost"
          triggerButtonSize="sm"
          triggerText={<Edit className="w-4 h-4" />}
          triggerButtonClass="absolute top-2 right-2 rounded-full"
        >
          <ProfessorForm professorData={details as IProfessor} />
        </CustomDialog>
      )}

      <CardContent className="p-4 flex flex-row items-center gap-4 ">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {(details.name || "")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <h3 className="text-sm font-semibold">{details.name}</h3>
            {isAdmin && !details.eventLink && (
              <div className="flex items-center">
                {/* <Badge variant="destructive" className="text-xs mr-2">
                Pending
              </Badge> */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCheckStatus}
                        disabled={isChecking}
                        className="w-fit h-fit rounded-full p-0"
                      >
                        {isChecking ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm text-slate-500">
                        This professor has yet to set up their Calendly account,
                        <span className="text-black font-medium">
                          {" "}
                          Click
                        </span>{" "}
                        to check if they have or not.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="text-xs w-fit">
            {details.department}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Mail className="h-3 w-3 mr-1" />
            {details.email}
          </div>
        </div>
        {isMobileView && (
          <div className="w-full flex justify-end">
            {details.eventLink ? (
              <Link href={`/dashboard/sessions?eventLink=${details.eventLink}`}>
                <Button>View Sessions</Button>
              </Link>
            ) : (
              <span className="text-xs text-slate-500">no sessions yet...</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessorCard;
