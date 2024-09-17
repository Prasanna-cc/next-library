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
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { deleteMember, registerMember, updateMember } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { IMember, IMemberBase } from "@/lib/models/member.model";
import { MemberSchema } from "@/lib/models/member.schema";
import { X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const onSubmitUpdate = async (data: IMember) => {
  try {
    const response = await updateMember(data.id, data);
    if (response) {
      toast({
        variant: "default",
        title: "Changes updated successfully",
      });
    }
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Could not update the changes",
      description: "Please try again.",
    });
  }
};

export const onDeleteMember = async (id: number) => {
  try {
    const response = await deleteMember(id);
    if (response) {
      toast({
        variant: "default",
        title: "Member deleted successfully",
      });
      window.location.reload();
    }
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Could not delete the member",
      description: "Please try again.",
    });
  }
};

type MemberFormProps = {
  member?: IMember;
  handleBack?: () => void;
};

const MemberForm = ({ member, handleBack }: MemberFormProps) => {
  const isEditMode = !!member; // Check if we're editing an existing member

  const form = useForm<IMember>({
    resolver: zodResolver(MemberSchema),
    defaultValues: member || {
      name: "",
      age: 0,
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      role: "user",
    },
    mode: "onChange",
  });

  const formFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Age", name: "age", type: "number" },
    { label: "Email", name: "email", type: "text" },
    { label: "Phone", name: "phoneNumber", type: "text" },
    { label: "Address", name: "address", type: "text" },
    // { label: "Password", name: "password", type: "text" },
  ];

  const onSubmitCreate = async (data: IMemberBase) => {
    try {
      const response = await registerMember(data);
      if (response) {
        toast({
          variant: "default",
          title: "Member added successfully",
        });
        handleBack?.();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not add the member",
        description: "Please try again.",
      });
    }
  };

  const onSubmitUpdate = async (data: IMember) => {
    try {
      const response = await updateMember(data.id, data);
      if (response) {
        toast({
          variant: "default",
          title: "Changes updated successfully",
        });
        handleBack?.();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not update the changes",
        description: "Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(member ? onSubmitUpdate : onSubmitCreate)}
        className="w-full h-full"
      >
        <div className="pb-2 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {isEditMode ? "Edit Member" : "Add Member"}
          </h3>
          {isEditMode && (
            <Button variant="ghost" onClick={handleBack}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="w-full flex flex-col gap-1">
          {formFields.map((field) => (
            <FormItem key={field.name}>
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <FormControl>
                <Input
                  id={field.name}
                  type={field.type}
                  {...form.register(field.name as keyof IMember, {
                    valueAsNumber: field.type === "number",
                  })}
                />
              </FormControl>
              <div className="text-red-600 min-h-4 overflow-x-auto no-scrollbar">
                <FormMessage className="text-xs">
                  {form.formState.errors[field.name as keyof IMember]?.message}
                </FormMessage>
              </div>
            </FormItem>
          ))}

          {/* Radio buttons for role */}
          <FormItem>
            <FormLabel htmlFor="role">Role</FormLabel>
            <FormControl>
              <RadioGroup
                value={form.watch("role") || "user"}
                onValueChange={(value: "user" | "admin") =>
                  form.setValue("role", value)
                }
                className="flex gap-2"
              >
                <RadioGroupItem value="user" id="user" />
                <FormLabel htmlFor="user">User</FormLabel>
                <RadioGroupItem value="admin" id="admin" />
                <FormLabel htmlFor="admin">Admin</FormLabel>
              </RadioGroup>
            </FormControl>
          </FormItem>
        </div>
        {isEditMode ? (
          <div className="pt-2 flex justify-end gap-2">
            <Button type="submit">Save</Button>
            <DeleteConfirmationDialog
              onConfirm={() => onDeleteMember(member!.id)}
            />
          </div>
        ) : (
          <Button type="submit" className="mt-2 w-full">
            Add
          </Button>
        )}
      </form>
    </Form>
  );
};

export default MemberForm;
