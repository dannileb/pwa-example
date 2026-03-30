import classes from "./InstallBadge.module.css";
import { useInstallPrompt } from "#/hooks/useInstallPrompt";
import { useState } from "react";
import { Button } from "#/ui/Button/Button";

//TODO: replace to message toast
export const InstallBadge = () => {
  const { isRejected, invokePrompt, canInstall } = useInstallPrompt();
  const [showBadge, setShowBadge] = useState<boolean>(true);
  return (
    <div
      className={classes.container}
      role="alert"
      aria-labelledby="toast-message"
    >
      {canInstall && showBadge && (
        <div className={classes.toast}>
          <div className={classes.toastMessage}>
            <span id="toast-message">
              {isRejected
                ? "Для того, чтобы заново вызвать окно установки, обновите старницу"
                : "Установите приложение на смартфон — быстро, удобно и всегда подрукой!"}
            </span>
          </div>
          <div className={classes.toastButtons}>
            {isRejected ? (
              <Button onPress={() => location.reload()}>Перезагрузить</Button>
            ) : (
              <Button onPress={invokePrompt}>Установить</Button>
            )}
            <Button onPress={() => setShowBadge(false)}>Закрыть</Button>
          </div>
        </div>
      )}
    </div>
  );
};
