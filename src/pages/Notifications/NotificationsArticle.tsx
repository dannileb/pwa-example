import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { Button } from "#/ui/Button/Button";
import classes from "./Notifications.module.css";

export const NotificationsArticle = () => {
  const { addToast } = useMessageToastContext();

  const showNotification = async () => {
    let permission = Notification.permission;

    switch (permission) {
      case "default":
        permission = await Notification.requestPermission();
        break;
      case "denied":
        addToast({
          text: "Для получения уведомления необходимо предоставить доступ",
          type: "info",
        });
        break;
      default:
        break;
    }
    if (permission === "granted") {
      new Notification("Тестовое уведомление", {
        body: "Уведомление от PWA Example",
      });
    }
  };
  return (
    <article>
      <h3 className={classes.articleHeading}>
        Notifications (только при открытом приложении)
      </h3>
      <Button onClick={showNotification}>Показать уведомление</Button>
    </article>
  );
};
