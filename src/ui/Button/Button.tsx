import {
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import classes from "./Button.module.css";
import classNames from "classnames";
import { ReactNode } from "react";

interface ButtonProps extends RACButtonProps {
  view?: "primary" | "clear";
  status?: "default" | "alert";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  selectable?: boolean;
}

export function Button({
  view = "primary",
  status = "default",
  icon,
  iconPosition = "right",
  children,
  selectable,
  className,
  ...props
}: ButtonProps) {
  return (
    <RACButton
      className={classNames(
        classes.button,
        classes[`button_${view}`],
        {
          [classes.button_selectable]: selectable,
          [classes.button_alert]: status === "alert",
        },
        className
      )}
      {...props}
    >
      {iconPosition === "left" && icon}
      {typeof children !== "function" && children}
      {iconPosition === "right" && icon}
    </RACButton>
  );
}
