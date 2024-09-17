import { AlertCircle, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import React, { useState, useEffect } from "react";

interface AlertMessageProps extends React.ComponentPropsWithoutRef<"div"> {}

const AlertMessage = ({}: AlertMessageProps) => {
  const [showAlert, setShowAlert] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowAlert(false);
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);
  return (
    <>
      {showAlert && (
        <Alert
          variant="destructive"
          className="max-w-80 top-2 z-[100] absolute bg-white bg-opacity-50 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className=" flex justify-between gap-2 ">
            <AlertCircle className="h-4 w-8" />
            <div className=" flex flex-col">
              <div className=" flex justify-between">
                <AlertTitle className="flex justify-center">Sign Up</AlertTitle>
                <button
                  className="p-0 h-full"
                  onClick={() => setShowAlert(false)}
                >
                  <X className="h-4 w-fit"></X>
                </button>
              </div>
              <AlertDescription className="max-w-fit">
                Looks like you do not have an account, please signup to continue
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </>
  );
};

export default AlertMessage;
