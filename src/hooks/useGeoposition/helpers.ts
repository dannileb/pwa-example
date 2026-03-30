export const getAddressByLocation = async (locatoin: GeolocationPosition) => {
  const resultJson = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${locatoin.coords.latitude}&lon=${locatoin.coords.longitude}&format=jsonv2&addressdetails=1`
  );
  const result = await resultJson.json();
  return result.display_name;
};
