import { useNavBar } from "#/components/NavBar/useNavBar/useNavBar";
import { ROUTES } from "#/router/config";
import { NotificationsArticle } from "./NotificationsArticle";
import { PushNotificationsArticle } from "./PushNotificationsArticle";
import classes from "./Notifications.module.css";

function NotificationsPage() {
  useNavBar({ backLink: { url: ROUTES.START_PAGE }, title: "Уведомления" });

  return (
    <section className={classes.pageWrapper}>
      <NotificationsArticle />
      <PushNotificationsArticle />
    </section>
  );
}

export default NotificationsPage;
