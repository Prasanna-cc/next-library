import { TypeOf, z, ZodObject, ZodTypeAny } from "zod";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the props for the generic form component
interface FormField<T> {
  label: string;
  name: keyof T; // The field name should correspond to the keys of the form data
  type: string; // Field type, e.g., text, number, email, etc.
}

interface Props<T extends ZodTypeAny> {
  formFields: FormField<z.infer<T>>[]; // Form fields array
  onSubmit: (data: z.infer<T>) => Promise<void>; // Submit handler with form data matching Zod schema
  submitBtnTxt: string; // Text for the submit button
  schema: T; // Zod schema for form validation
  defaultValues?: z.infer<T>; // Default values matching the schema
  children?: React.ReactNode; // Optional children components (e.g., buttons, etc.)
}

// Generic CustomForm component
export const CustomForm = <T extends ZodTypeAny>({
  formFields,
  onSubmit,
  submitBtnTxt,
  defaultValues,
  schema,
  children,
}: Props<T>) => {
  // Initialize the form using react-hook-form with Zod resolver
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema), // Zod schema validation
    defaultValues,
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {formFields.map((field) => (
            <FormItem key={String(field.name)}>
              <FormLabel htmlFor={String(field.name)}>{field.label}</FormLabel>
              <FormControl>
                <Input
                  id={String(field.name)}
                  type={field.type}
                  {...form.register(field.name as Path<TypeOf<T>>, {
                    valueAsNumber: field.type === "number", // Automatically handle number types
                  })}
                />
              </FormControl>
              <div className="text-red-600 text-xs min-h-4">
                <FormMessage className="text-xs">
                  {
                    form.formState.errors[field.name as keyof z.infer<T>]
                      ?.message as string
                  }
                </FormMessage>
              </div>
            </FormItem>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="submit">{submitBtnTxt}</Button>
          {children}
        </div>
      </form>
    </Form>
  );
};
