import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { Toast } from "#/components/MessageToast/useMessageToast/types";
import { useSwipe } from "#/hooks/useSwipe/useSwipe";
import { Button } from "#/ui/Button/Button";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import classes from "./MessageToast.module.css";
import classNames from "classnames";

interface MessageToastProps {
  toast: Toast;
}

export const MessageToast = ({ toast }: MessageToastProps) => {
  const { removeToastById } = useMessageToastContext();

  const handleSwipe = useCallback(() => {
    removeToastById(toast.id);
  }, [removeToastById, toast.id]);

  const swipeProps = useSwipe<HTMLDivElement>(handleSwipe);
  return (
    <div
      className={classNames(classes.toast, {
        [classes.toast_error]: toast.type === "error",
      })}
      {...swipeProps}
    >
      <div className={classes.title}>
        <Button
          view="clear"
          status={toast.type === "error" ? "alert" : "default"}
          icon={<CloseCircleOutlined />}
          onClick={() => {
            removeToastById(toast.id);
          }}
        />
        <p>{toast.text}</p>
      </div>
      {toast.footer}
    </div>
  );
};
