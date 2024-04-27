"use client";
import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { Label } from "./label";
import { cn } from "~/lib/utils";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

const FormControl = Form.Control;
const FormValidiyState = Form.ValidityState;

const FormMessage = React.forwardRef<
  React.ElementRef<typeof Form.Message>,
  React.ComponentPropsWithoutRef<typeof Form.Message>
>(({ className, ...props }, ref) => {
  return (
    <Form.Message
      ref={ref}
      className={cn(
        "text-sm font-medium text-red-500 dark:text-red-900",
        className,
      )}
      {...props}
    />
  );
});
FormMessage.displayName = "FormMessage";

type FormContextValue = { errors: Record<string, string[] | undefined> };
const FormContext = React.createContext<FormContextValue>({ errors: {} });

type FormRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof Form.Root>,
  "action"
> & {
  action: (
    state: FormContextValue,
    formData: FormData,
  ) => Promise<FormContextValue>;
};
const FormRoot = React.forwardRef<HTMLFormElement, FormRootProps>(
  ({ action, ...props }, ref) => {
    const [state, formAction] = useFormState(action, { errors: {} });
    return (
      <FormContext.Provider value={state}>
        <Form.Root {...props} action={formAction} ref={ref} />
      </FormContext.Provider>
    );
  },
);
FormRoot.displayName = "FormRoot";

const FormField = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Form.Field>
>(({ className, children, ...props }, ref) => {
  const state = React.useContext(FormContext);
  return (
    <Form.Field
      {...props}
      ref={ref}
      className={cn("space-y-2", className)}
      serverInvalid={Boolean(state.errors[props.name])}
    >
      {children}
      {state.errors[props.name]?.map((error) => (
        <FormMessage key={error}>{error}</FormMessage>
      ))}
    </Form.Field>
  );
});
FormField.displayName = "FormField";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Form.Label asChild>
      <Label
        {...props}
        ref={ref}
        className={cn("data-[invalid]:text-destructive", className)}
      />
    </Form.Label>
  );
});
FormLabel.displayName = "FormLabel";

const FormSubmit = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => {
  const status = useFormStatus();

  return (
    <Form.Submit asChild>
      <Button {...props} ref={ref} className={cn("mt-4", className)}>
        {status.pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    </Form.Submit>
  );
});
FormSubmit.displayName = "FormSubmit";

export {
  FormControl,
  FormValidiyState,
  FormMessage,
  FormContext,
  FormRoot,
  FormField,
  FormLabel,
  FormSubmit,
};
