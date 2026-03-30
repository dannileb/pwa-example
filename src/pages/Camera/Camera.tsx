import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { useNavBar } from "#/components/NavBar/useNavBar/useNavBar";
import { ROUTES } from "#/router/config";
import { haptic } from "#/utils/pwaUtils";
import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import classes from "./Camera.module.css";
import { Button } from "#/ui/Button/Button";
import { Heading, Pressable } from "react-aria-components";
import { Dialog, DialogTrigger } from "#/ui/Dialog/Dialog";
import { Modal } from "#/ui/Modal/Modal";
import { getProductTextByBarcode } from "./helpers";

export const Camera = () => {
  useNavBar({ backLink: { url: ROUTES.START_PAGE }, title: "Камера" });
  const { addToast } = useMessageToastContext();
  const [productText, setProductText] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [isCameraPermission, setIsCameraPermission] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    const reader = new BrowserMultiFormatReader(
      new Map([
        [
          DecodeHintType.POSSIBLE_FORMATS,
          [
            BarcodeFormat.QR_CODE,
            BarcodeFormat.DATA_MATRIX,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
          ],
        ],
      ])
    );
    const imageSrc = webcamRef?.current?.getScreenshot();

    if (imageSrc) {
      reader
        .decodeFromImage(undefined, imageSrc)
        .then((result) => {
          haptic();
          setScanning(false);

          const codeText = result.getText();
          if (result.getBarcodeFormat() === BarcodeFormat.EAN_13) {
            getProductTextByBarcode(result.getText())
              .then((text) => {
                setProductText(text ?? `Продукт ${codeText}`);
              })
              .catch((e) => {
                console.debug(e);
                addToast({
                  text: `Ошибка поиска продукта ${codeText}`,
                  type: "error",
                });
              });
          } else {
            addToast({
              text: `Штрихкод формата ${
                BarcodeFormat[result.getBarcodeFormat()]
              }: ${codeText}`,
              type: "info",
            });
          }
        })
        .catch((err) => {
          if (!(err instanceof NotFoundException)) {
            addToast({
              text: "Ошибка чтения штрих-кода",
              type: "error",
            });
          }
        });
    }
  }, [addToast, setProductText]);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => handleCapture(), 50);
      return () => {
        clearInterval(interval);
      };
    }
  }, [handleCapture, scanning]);

  return (
    <section className={classes.pageContainer}>
      <p>
        Наведите камеру на код для получения информации. Код EAN_13/8 покажет
        информацию о калорийности продукта питания
      </p>
      <DialogTrigger>
        <Pressable>
          <span role="button">Примеры кодов</span>
        </Pressable>
        <Modal isDismissable>
          <Dialog
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Heading slot="title">Примеры</Heading>
            <div className={classes.codesExamples}>
              <img src="/codesExamples/dmtx.png" alt="data matrix code" />
              <img src="/codesExamples/qr.png" alt="qr code" />
              <img src="/codesExamples/code128.png" alt="barcode 128" />
            </div>
            <Button
              slot="close"
              style={{
                alignSelf: "flex-end",
              }}
              onClick={() => {
                setProductText("");
              }}
            >
              Закрыть
            </Button>
          </Dialog>
        </Modal>
      </DialogTrigger>
      {!isCameraPermission && <p>Предоставьте разрешение для работы камеры</p>}
      <Webcam
        width="100%"
        className={classes.camVideo}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        audio={false}
        videoConstraints={{
          facingMode: "environment",
        }}
        onUserMedia={() => {
          setIsCameraPermission(true);
        }}
        onUserMediaError={(error) => {
          setIsCameraPermission(false);
          console.debug(error);
        }}
      />
      {isCameraPermission && (
        <div className={classes.bottomToolbar}>
          <Button
            onClick={() => setScanning((prev) => !prev)}
            className={classes.scanButton}
          >
            {scanning ? "Остановить сканирование" : "Сканировать"}
          </Button>
        </div>
      )}
      <DialogTrigger isOpen={!!productText.length}>
        <Modal isDismissable>
          <Dialog
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Heading slot="title">Найденный продукт</Heading>
            <p className={classes.productText}>{productText}</p>
            <Button
              slot="close"
              style={{
                alignSelf: "flex-end",
              }}
              onClick={() => {
                setProductText("");
              }}
            >
              Закрыть
            </Button>
          </Dialog>
        </Modal>
      </DialogTrigger>
    </section>
  );
};
