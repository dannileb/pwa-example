"use client";
import {
  ValidationResult,
  Label,
  FieldError,
  Text,
  TextArea as AriaTextAreaField,
  TextAreaProps,
} from "react-aria-components";

import "./TextArea.css";

export interface TextFieldProps extends TextAreaProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  inputProps?: TextAreaProps & React.RefAttributes<HTMLTextAreaElement>;
}

export function TextArea({
  label,
  description,
  errorMessage,
  inputProps,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextAreaField {...props}>
      <Label>{label}</Label>
      <TextArea {...inputProps} />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextAreaField>
  );
}
