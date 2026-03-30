import { useNavBarContext } from "#/components/NavBar/useNavBar/NavBarContext";
import { getPWADisplayMode } from "#/utils/pwaUtils";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import classes from "./NavBar.module.css";
import { Button } from "#/ui/Button/Button";

export const NavBar = () => {
  const { backLink, forwardLink, title } = useNavBarContext();
  const navigate = useNavigate();

  const isStandalone = getPWADisplayMode() === "standalone";

  return (
    <nav className={classes.navBar}>
      {backLink && isStandalone && (
        <Button
          view="clear"
          className={classes.navBarLink_back}
          icon={<LeftOutlined />}
          iconPosition="left"
          onClick={() => navigate(backLink.url)}
        >
          {backLink.text ?? "Назад"}
        </Button>
      )}
      <div className={classes.navBarTitle}>
        {typeof title === "string" ? <h2>{title}</h2> : title}
      </div>
      {forwardLink && isStandalone && (
        <Button
          view="clear"
          className={classes.navBarLink_forward}
          icon={<RightOutlined />}
          onClick={() => navigate(forwardLink.url)}
        >
          {forwardLink.text ?? "Далее"}
        </Button>
      )}
    </nav>
  );
};
