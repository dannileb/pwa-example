import classNames from "classnames";
import classes from "./SectionCard.module.css";
import { SectionCardType } from "./types";
import { mergeProps, usePress } from "react-aria";
import { useHover } from "react-aria";
import { useLongPress } from "react-aria";

export const SectionCard = ({
  title,
  description,
  onClick,
  onLongPress,
  icon,
}: SectionCardType) => {
  const { pressProps, isPressed } = usePress({});
  const { hoverProps, isHovered } = useHover({});
  const { longPressProps } = useLongPress({
    onLongPressStart: () => {},
    onLongPress: () => {
      onLongPress?.();
    },
  });

  return (
    <article
      className={classNames(classes.card, {
        [classes.card_pressed]: isPressed,
        [classes.card_hover]: isHovered,
      })}
      {...mergeProps(pressProps, longPressProps, hoverProps)}
      onClick={onClick}
    >
      <div className={classes.cardTitle}>
        {icon}
        <h3>{title}</h3>
      </div>
      <p>{description}</p>
    </article>
  );
};
