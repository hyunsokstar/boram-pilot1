import React from "react";

type Props = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  thumbClassName?: string;
  "aria-label"?: string;
};

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const HeadlessSwitch: React.FC<Props> = ({
  checked,
  onCheckedChange,
  disabled,
  id,
  className,
  thumbClassName,
  ...aria
}) => {
  const toggle = () => !disabled && onCheckedChange(!checked);
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={cx(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        // 파스텔톤
        checked ? "bg-sky-400/80" : "bg-gray-300/90",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      {...aria}
    >
      <span
        aria-hidden
        className={cx(
          "inline-block h-4 w-4 translate-x-1 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
          thumbClassName
        )}
      />
    </button>
  );
};

export default HeadlessSwitch;