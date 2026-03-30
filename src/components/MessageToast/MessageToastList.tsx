import classes from "./MessageToast.module.css";
import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { MessageToast } from "./MessageToast";

export const MessageToastList = () => {
  const { toasts } = useMessageToastContext();
  return (
    <div
      className={classes.container}
      role="alert"
      aria-labelledby="toast-message"
    >
      <ul className={classes.toastsWrapper}>
        {toasts.map((t) => {
          return (
            <li key={t.id}>
              <MessageToast toast={t} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
