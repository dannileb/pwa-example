import { useWebAuthnContext } from "#/hooks/useWebAuthn/WebAuthnContext";
import { Button } from "#/ui/Button/Button";
import { TextField } from "#/ui/TextField/TextField";
import { useCallback, useState } from "react";
import {
  Location,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import classes from "./LoginPage.module.css";
import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { Form } from "#/ui/Form/Form";

interface LocationState extends Location {
  state: {
    from?: Location;
  };
}

const isLocaltionState = (location: Location): location is LocationState => {
  return (location as LocationState).state?.from !== undefined;
};

interface LoginLoaderData {
  isWebAuthnAvailable: boolean;
}

const LoginPage = () => {
  const { isRegistered, login, register, continueWithourLogin } =
    useWebAuthnContext();
  const { addToast } = useMessageToastContext();
  const { isWebAuthnAvailable } = useLoaderData<LoginLoaderData>();

  const [userCredentials, setUserCredentials] = useState<{
    name: string;
    displayName: string;
  }>({
    name: "",
    displayName: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  const redirectToLocation = useCallback(() => {
    let redirectURL;
    if (isLocaltionState(location) && location.state) {
      const pathname = location.state?.from?.pathname;
      if (pathname) {
        redirectURL = pathname + location.state?.from?.search;
      }
    }
    navigate(redirectURL ?? "/", { replace: true });
  }, [location, navigate]);

  return (
    <section className={classes.pageContainer}>
      <h2>PWA Example</h2>
      {isWebAuthnAvailable &&
        (isRegistered ? (
          <Button
            onPress={() => {
              login()
                .then(() => {
                  redirectToLocation();
                })
                .catch((e) => {
                  if (!(e instanceof DOMException)) {
                    throw e;
                  }
                  if (e.name === "NotAllowedError") {
                    addToast({
                      text: "Авторизация отклоненна пользователем",
                      type: "info",
                    });
                  } else {
                    addToast({
                      text: e.message,
                      type: "error",
                    });
                  }
                });
            }}
          >
            Войти
          </Button>
        ) : (
          <Form
            style={{
              alignItems: "center",
            }}
          >
            <TextField
              onChange={(v) =>
                setUserCredentials({ ...userCredentials, name: v })
              }
              aria-label="name"
              inputProps={{ placeholder: "Логин" }}
            />
            <TextField
              onChange={(v) =>
                setUserCredentials({ ...userCredentials, displayName: v })
              }
              aria-label="displayName"
              inputProps={{ placeholder: "Имя" }}
            />
            <Button
              onPress={() => {
                if (!userCredentials.displayName || !userCredentials.name) {
                  return;
                }
                register(
                  userCredentials.name,
                  userCredentials.displayName
                ).catch((e) => {
                  if (!(e instanceof DOMException)) {
                    throw e;
                  }
                  if (e.name === "NotAllowedError") {
                    addToast({
                      text: "Регистрация отклоненна пользователем",
                      type: "info",
                    });
                  } else {
                    addToast({
                      text: e.message,
                      type: "error",
                    });
                  }
                });
              }}
            >
              Зарегистрироваться
            </Button>
          </Form>
        ))}
      <Button
        view="clear"
        onClick={() => {
          continueWithourLogin();
          redirectToLocation();
        }}
      >
        Продолжить без входа
      </Button>
    </section>
  );
};

export default LoginPage;
