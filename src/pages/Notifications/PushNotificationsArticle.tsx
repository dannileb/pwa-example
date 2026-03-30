import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { Button } from "#/ui/Button/Button";
import { TextField } from "#/ui/TextField/TextField";
import { SERVICE_WORKER_PATH } from "#/utils/pwaUtils";
import { useState } from "react";
import classes from "./Notifications.module.css";
import { Form } from "#/ui/Form/Form";

export const PushNotificationsArticle = () => {
  const { addToast } = useMessageToastContext();
  const [bashCommand, setBashCommand] = useState<string>("");
  const [vapidKeys, setVapidKeys] = useState<{
    public: string;
    private: string;
  }>({ public: "", private: "" });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateCommand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      addToast({
        text: "Push-уведомления не поддерживаются в этом браузере.",
        type: "info",
      });
      return;
    }

    setIsLoading(true);
    setBashCommand("");
    try {
      let permission = await Notification.requestPermission();
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

      if (permission !== "granted") {
        addToast({ text: "Вы не разрешили показ уведомлений.", type: "error" });
        setIsLoading(false);
        return;
      }

      let registration = await navigator.serviceWorker.getRegistration(
        SERVICE_WORKER_PATH
      );
      if (!registration) {
        registration = await navigator.serviceWorker.register(
          SERVICE_WORKER_PATH
        );
      }

      if (!vapidKeys.public) {
        addToast({ text: "Введите публичный VAPID ключ", type: "error" });
        return;
      }
      if (!vapidKeys.private) {
        addToast({ text: "Введите приватный VAPID ключ", type: "error" });
        return;
      }
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeys.public,
      });
      const subscriptionData = newSubscription.toJSON();

      const command = `
web-push send-notification \\
  --endpoint="${subscriptionData.endpoint}" \\
  --key="${subscriptionData.keys?.p256dh}" \\
  --auth="${subscriptionData.keys?.auth}" \\
  --payload='{"title":"Тест из терминала!", "body":"Это push-уведомление было отправлено с помощью команды."}' \\
  --vapid-subject="mailto:example@example.com" \\
  --vapid-pubkey="${vapidKeys.public}" \\
  --vapid-pvtkey="${vapidKeys.private}"
      `.trim();

      setBashCommand(command);
    } catch (err) {
      console.error(err);
      addToast({
        text: "Произошла ошибка при получении команды.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <article>
      <h3 className={classes.articleHeading}>
        Push - уведомления (при запуске через локальный сервер)
      </h3>
      <div className={classes.commandsWrapper}>
        <p>Установка инструмента отправки пуш-уведомлений</p>
        <code className={classes.codeBlock}>npm install web-push -g</code>
      </div>
      <div className={classes.commandsWrapper}>
        <p>Генерация VAPID ключей для подписки</p>
        <code className={classes.codeBlock}>
          web-push generate-vapid-keys [--json]
        </code>
      </div>
      <Form onSubmit={handleGenerateCommand} className={classes.form}>
        <TextField
          inputMode="text"
          value={vapidKeys.public}
          onChange={(value) => {
            setVapidKeys((prev) => ({ ...prev, public: value }));
          }}
          inputProps={{ placeholder: "Публичный VAPID ключ" }}
        />
        <TextField
          inputMode="text"
          value={vapidKeys.private}
          onChange={(value) => {
            setVapidKeys((prev) => ({ ...prev, private: value }));
          }}
          inputProps={{ placeholder: "Приватный VAPID ключ" }}
        />
        <Button type="submit" isDisabled={isLoading}>
          {isLoading ? "Генерация..." : "Сгенерировать команду"}
        </Button>
      </Form>
      {bashCommand && (
        <div style={{ marginTop: "20px" }}>
          <p>Скопируйте команду и выполните в терминале.</p>
          <textarea
            readOnly
            rows={10}
            style={{
              width: "100%",
              fontFamily: "monospace",
              whiteSpace: "pre",
            }}
            value={bashCommand}
          />
        </div>
      )}
    </article>
  );
};
