import { useGeoposition } from "#/hooks/useGeoposition/useGeoposition";

export const Geoposition = () => {
  const { position, textAddress } = useGeoposition();

  return (
    <div>
      {position ? (
        <div>
          {textAddress && <p>Адрес: {textAddress}</p>}
          <a
            href={`maps:${position.coords.latitude},${position.coords.longitude}`}
            target="_blank"
          >
            На карте
          </a>
          <p>
            Координаты: {position.coords.latitude},{position.coords.longitude}
          </p>
        </div>
      ) : (
        <p>Геопозиция не определена</p>
      )}
    </div>
  );
};
