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
import {
  deleteProfessor,
  inviteProfessor,
  registerProfessor,
  updateProfessor,
} from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { IProfessor, IProfessorBase } from "@/lib/models/professor.model";
import { ProfessorSchemaBase } from "@/lib/models/professor.schema";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

type ProfessorFormProps = {
  professorData?: IProfessor;
  handleBack?: () => void;
};

const ProfessorForm = ({ handleBack, professorData }: ProfessorFormProps) => {
  const isEditMode = !!professorData;
  const form = useForm<IProfessorBase>({
    resolver: zodResolver(ProfessorSchemaBase),
    defaultValues: professorData || {
      name: "",
      email: "",
      department: "",
      shortBio: null,
      eventLink: null,
    },
    mode: "onChange",
  });

  const formFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "text" },
    { label: "Department", name: "department", type: "text" },
    { label: "Short Bio", name: "shortBio", type: "text" },
    { label: "Event Link", name: "eventLink", type: "text" },
  ];

  const onSubmitCreate = async (data: IProfessorBase) => {
    try {
      const professorDetails: IProfessorBase = {
        ...data,
        shortBio: data.shortBio || null,
        eventLink:
          (data.eventLink?.includes("https://calendly.com/") &&
            data.eventLink) ||
          null,
      };
      const response = await inviteProfessor(professorDetails);

      if (!response?.message.includes("Failed")) {
        toast({
          variant: "default",
          title: "Professor added successfully",
        });
        form.reset();
        window.location.reload();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not add the professor",
        description: "Please try again.",
      });
    }
  };

  const onSubmitUpdate = async (data: IProfessorBase) => {
    try {
      if (!professorData) throw new Error();
      const response = await updateProfessor(professorData.id, data);
      if (response) {
        toast({
          variant: "default",
          title: "Changes updated successfully",
        });
        window.location.reload();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not update the changes",
        description: "Please try again.",
      });
    }
  };

  const onDeleteProfessor = async () => {
    try {
      if (!professorData) throw new Error();
      const response = await deleteProfessor(professorData.id);
      if (response) {
        toast({
          variant: "default",
          title: "Professor deleted successfully",
        });
        window.location.reload();
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
        onSubmit={form.handleSubmit(
          !isEditMode ? onSubmitCreate : onSubmitUpdate
        )}
        className="w-full h-full"
      >
        <div className="pb-2 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {isEditMode ? "Edit Professor Details" : "Add Professor"}
          </h3>
          {/* {isEditMode && (
            <Button variant="ghost" onClick={handleBack}>
              <X className="w-4 h-4" />
            </Button>
          )} */}
        </div>
        <div className="w-full flex flex-col gap-1">
          {formFields.map((field) => (
            <FormItem key={field.name}>
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <FormControl>
                {field.name !== "shortBio" ? (
                  <Input
                    id={field.name}
                    type={field.type}
                    {...form.register(field.name as keyof IProfessorBase, {
                      valueAsNumber: field.type === "number",
                    })}
                  />
                ) : (
                  <Textarea
                    id={field.name}
                    className="min-h-[100px] resize-y"
                    {...form.register(field.name as keyof IProfessorBase)}
                  />
                )}
              </FormControl>
              <div className="text-red-600 min-h-4 overflow-x-auto no-scrollbar">
                <FormMessage className="text-xs">
                  {
                    form.formState.errors[field.name as keyof IProfessorBase]
                      ?.message
                  }
                </FormMessage>
              </div>
            </FormItem>
          ))}
        </div>
        {isEditMode ? (
          <div className="pt-2 flex justify-end gap-2">
            <Button type="submit">Save</Button>
            <DeleteConfirmationDialog onConfirm={() => onDeleteProfessor()} />
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

export default ProfessorForm;
