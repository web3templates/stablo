import { cx } from "@/utils/all";

export default function Label(props) {
  const color = {
    green: "text-emerald-700",
    blue: "text-blue-600",
    orange: "text-orange-700",
    purple: "text-purple-600",
    pink: "text-pink-600"
  };
  const bgcolor = {
    green: "bg-emerald-50",
    blue: "bg-blue-50",
    orange: "bg-orange-50",
    purple: "bg-purple-50",
    pink: "bg-pink-50"
  };
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div
        className={
          "inline-flex items-center justify-center font-bold px-2 h-6 text-sm bg-blue-50 text-blue-500 rounded-full shrink-0 dark:bg-gray-800 dark:text-gray-300"
        }>
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-block text-xs font-medium tracking-wider uppercase ",
        !margin && " mt-5",
        color[props.color] || color[pink]
      )}>
      {props.children}
    </span>
  );
}
