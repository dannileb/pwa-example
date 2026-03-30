import { SectionCard, SectionCardType } from "#/components/SectionCard";
import {
  CameraOutlined,
  CompassOutlined,
  FormOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import classes from "./StartPage.module.css";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "#/router/config";
import { useNavBar } from "#/components/NavBar/useNavBar/useNavBar";

function StartPage() {
  useNavBar({ title: "Разделы" });
  const navigate = useNavigate();

  const sections = useMemo((): SectionCardType[] => {
    return [
      {
        title: "Заметки",
        description: "Создание заметок и сохранение в indexedDB",
        icon: <FormOutlined className={classes.sectionIcon} />,
        onClick() {
          navigate(ROUTES.NOTES_LIST);
        },
      },
      {
        title: "Уведомления",
        description: "Проверка работы push-уведомлений",
        icon: <NotificationOutlined className={classes.sectionIcon} />,
        onClick() {
          navigate(ROUTES.NOTIFICATIONS);
        },
      },
      {
        title: "Камера",
        description: "Доступ к камере, считывание штрих-кодов",
        icon: <CameraOutlined className={classes.sectionIcon} />,
        onClick() {
          navigate(ROUTES.CAMERA);
        },
      },
      {
        title: "Датчики",
        description: "Работа с датчиками устройства",
        icon: <CompassOutlined className={classes.sectionIcon} />,
        onClick() {
          navigate(ROUTES.SENSORS);
        },
      },
    ];
  }, [navigate]);

  return (
    <section>
      <ul className={classes.sections}>
        {sections.map((s, index) => {
          return (
            <li key={index}>
              <SectionCard {...s} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default StartPage;
