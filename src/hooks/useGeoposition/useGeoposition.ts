import { getAddressByLocation } from "#/hooks/useGeoposition/helpers";
import { useEffect, useState } from "react";

export const useGeoposition = () => {
  const [position, setPosition] = useState<GeolocationPosition>();
  const [textAddress, setTextAddress] = useState<string>();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition(pos);
        getAddressByLocation(pos)
          .then((res) => {
            setTextAddress(res);
          })
          .catch((e) => {
            alert(e.message);
          });
      });
    }
  }, []);

  return {
    position,
    textAddress,
  };
};
