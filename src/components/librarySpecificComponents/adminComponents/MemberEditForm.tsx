"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { updateMember, updateMemberPassword } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { IMember } from "@/lib/models/member.model";
import { MemberSchema, PasswordChangeSchema } from "@/lib/models/member.schema";
import { ArrowLeft, StepBack, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { z } from "zod";
import React from "react";
import { onDeleteMember } from "./MemberForm";
import { useSession } from "next-auth/react";

type MemberEditFormProps = {
  member: IMember | undefined | null;
  handleBack?: () => void;
  forProfile?: boolean;
};

const MemberEditForm = ({
  member,
  handleBack,
  forProfile,
}: MemberEditFormProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const { data: session } = useSession();
  const detailsForm = useForm<IMember>({
    resolver: zodResolver(MemberSchema.omit({ password: true })),
    defaultValues: member ?? undefined,
    mode: "onChange",
  });

  const passwordForm = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const formFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Age", name: "age", type: "number" },
    { label: "Email", name: "email", type: "text" },
    { label: "Phone", name: "phoneNumber", type: "text" },
    { label: "Address", name: "address", type: "text" },
  ];

  const onSubmitDetails = async (data: IMember) => {
    try {
      if (member) {
        const response = await updateMember(member.id, data);
        if (response) {
          toast({
            variant: "default",
            title: "Member details updated successfully",
          });
          handleBack?.();
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not update member details",
        description: "Please try again.",
      });
    }
  };

  const onSubmitPassword = async (
    data: z.infer<typeof PasswordChangeSchema>
  ) => {
    try {
      if (member) {
        const response = await updateMemberPassword(
          member.id,
          data.currentPassword,
          data.newPassword
        );
        if (response) {
          toast({
            variant: "default",
            title: "Password updated successfully",
          });
          passwordForm.reset();
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not update password",
        description: "Please check your current password and try again.",
      });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
      <div className="flex justify-between gap-1 items-center mb-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>
        <Button variant="ghost" onClick={handleBack}>
          {!forProfile ? (
            <X className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      <TabsContent value="details">
        <Form {...detailsForm}>
          <form
            onSubmit={detailsForm.handleSubmit(onSubmitDetails)}
            className="space-y-4"
          >
            {formFields.map((field) => (
              <FormItem key={field.name}>
                <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    id={field.name}
                    type={field.type}
                    {...detailsForm.register(field.name as keyof IMember, {
                      valueAsNumber: field.type === "number",
                    })}
                  />
                </FormControl>
                <FormMessage className="text-xs">
                  {
                    detailsForm.formState.errors[field.name as keyof IMember]
                      ?.message
                  }
                </FormMessage>
              </FormItem>
            ))}

            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  value={detailsForm.watch("role") || "user"}
                  onValueChange={(value: "user" | "admin") =>
                    detailsForm.setValue("role", value)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <FormLabel htmlFor="user">User</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <FormLabel htmlFor="admin">Admin</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>

            <div className="flex justify-end gap-2">
              <Button type="submit">Save Changes</Button>
              {!forProfile ? (
                <DeleteConfirmationDialog
                  onConfirm={() => member && onDeleteMember(member.id)}
                />
              ) : (
                ""
              )}
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="password">
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="space-y-4"
          >
            <FormItem>
              <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
              <FormControl>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                />
              </FormControl>
              <FormMessage>
                {passwordForm.formState.errors.currentPassword?.message}
              </FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <FormControl>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                />
              </FormControl>
              <FormMessage className="text-xs">
                {passwordForm.formState.errors.newPassword?.message}
              </FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="confirmPassword">
                Confirm New Password
              </FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                />
              </FormControl>
              <FormMessage>
                {passwordForm.formState.errors.confirmPassword?.message}
              </FormMessage>
            </FormItem>

            <Button type="submit">Change Password</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default MemberEditForm;
