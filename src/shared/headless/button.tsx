import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export const HeadlessButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ loading = false, disabled, className, children, ...rest }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-md",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          isDisabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...rest}
      >
        {children}
        {loading && (
          <span
            aria-hidden
            className="ml-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
      </button>
    );
  }
);
HeadlessButton.displayName = "HeadlessButton";

export default HeadlessButton;