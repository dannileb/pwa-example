import { ROUTES } from "#/router/config";
import { useNavBar } from "#/components/NavBar/useNavBar/useNavBar";
import { Button } from "#/ui/Button/Button";
import classes from "./SensorsPage.module.css";
import { MazeGame } from "#/pages/Sensors/MazeGame/MazeGame";
import { useSensors } from "#/hooks/useSensors/useSensors";
import { Compass } from "#/pages/Sensors/Compass/Compass";
import { Geoposition } from "#/pages/Sensors/Geoposition/Geoposition";

function SensorsPage() {
  useNavBar({ title: "Датчики", backLink: { url: ROUTES.START_PAGE } });

  const { isIOS, permissionState, avaialbleSensors, requestPermission } =
    useSensors({});

  return (
    <section className={classes.flexWrapper}>
      <article className={classes.flexWrapper}>
        <h2>Геопозиция</h2>
        <Geoposition />
      </article>
      <article className={classes.flexWrapper}>
        <h2>Ориентация и движение</h2>
        {!isIOS || permissionState === "granted" ? (
          <>
            <div className={classes.flexWrapper}>
              <h3>Ориентация</h3>
              {avaialbleSensors.orientation ? (
                <Compass />
              ) : (
                <p>Датчик недоступен</p>
              )}
            </div>

            <div className={classes.flexWrapper}>
              <h3>Движение устройства</h3>
              <MazeGame />
            </div>
          </>
        ) : (
          <>
            <p>
              Для использования датчиков необходимо предоставить разрешение
              {permissionState === "denied" ? " в настройках Safari" : ""}
            </p>
            {!permissionState && (
              <Button
                onClick={() => {
                  requestPermission();
                }}
              >
                Предоставить разрешение
              </Button>
            )}
          </>
        )}
      </article>
    </section>
  );
}

export default SensorsPage;
