"use client";

import React, { useState, useEffect, ReactElement } from "react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CustomCard } from "@/components/displayAndInput/CustomCard";
import { AllowedDataTypes } from "@/app/[locale]/(home)/dashboard/admin/(libraryManagement)/TableWithPreview";

interface CustomDrawerProps<T extends AllowedDataTypes> {
  data: T | null;
  trigger: React.ReactNode;
}

const CustomDrawer = <T extends AllowedDataTypes>({
  data,
  trigger,
}: CustomDrawerProps<T>) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <div className="p-4">
          {data ? (
            <CustomCard data={data} />
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
