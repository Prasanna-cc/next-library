"use client";

import React, { ReactNode } from "react";
import Popup from "reactjs-popup";
import { Toaster } from "./ui/toaster";

interface PopupProps {
  triggerComp: JSX.Element;
  popupContent: JSX.Element;
}

export const ModalPopup = ({ triggerComp, popupContent }: PopupProps) => {
  return (
    <Popup trigger={triggerComp} modal closeOnDocumentClick>
      {
        ((close: () => void) => (
          <div
            className="w-screen h-screen backdrop-filter backdrop-blur-md backdrop-brightness-75 flex justify-center items-center"
            onClick={close}
          >
            <div
              className="bg-white p-6 flex flex-col justify-between gap-3 rounded-md shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              {popupContent}
              <Toaster />
            </div>
          </div>
        )) as unknown as ReactNode
      }
    </Popup>
  );
};
