import { cx } from "@utils/all";

export default function Container(props) {
  return (
    <div
      className={cx(
        "container p-8 mx-auto xl:px-5 max-w-screen-lg",
        props.className
      )}>
      {props.children}
    </div>
  );
}
