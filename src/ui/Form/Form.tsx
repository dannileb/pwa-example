import {
  Form as RACForm,
  FormProps,
  LabelProps,
  Label as RACLabel,
  FieldErrorProps,
  FieldError as RACFieldError,
  ButtonProps,
} from "react-aria-components";
import "./Form.css";
import { Button } from "../Button/Button";
import classNames from "classnames";

export function Form(props: FormProps) {
  return (
    <RACForm
      {...props}
      className={classNames("react-aria-Form", props.className)}
    />
  );
}

export function Label(props: LabelProps) {
  return <RACLabel {...props} />;
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} />;
}

export function FieldButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames("field-Button", props.className)}
    />
  );
}
