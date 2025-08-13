import React, { useId } from "react";

export type RadioOption = {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
};

export type RadioGroupProps = {
    value: string;
    onChange: (val: string) => void;
    options: RadioOption[];
    name?: string;
    className?: string;
    itemClassName?: string;
    ariaLabel?: string;
};

const cx = (...c: Array<string | false | null | undefined>) =>
    c.filter(Boolean).join(" ");

const HeadlessRadioGroup: React.FC<RadioGroupProps> = ({
    value,
    onChange,
    options,
    name,
    className,
    itemClassName,
    ariaLabel,
}) => {
    const groupId = useId();

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const idx = options.findIndex((o) => o.value === value);
        if (idx < 0) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            const next = options[(idx + 1) % options.length];
            if (!next.disabled) onChange(next.value);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            const prev = options[(idx - 1 + options.length) % options.length];
            if (!prev.disabled) onChange(prev.value);
        }
    };

    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className={cx("flex flex-wrap gap-2", className)}
            onKeyDown={onKeyDown}
        >
            {options.map((opt, i) => {
                const checked = value === opt.value;
                const id = `${groupId}-${i}`;
                return (
                    <label
                        key={opt.value}
                        htmlFor={id}
                        className={cx(
                            "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 cursor-pointer select-none text-sm",
                            checked ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50" : "border-input hover:bg-gray-50",
                            opt.disabled && "opacity-50 cursor-not-allowed",
                            itemClassName
                        )}
                    >
                        <input
                            id={id}
                            name={name ?? groupId}
                            type="radio"
                            className="peer sr-only"
                            disabled={opt.disabled}
                            checked={checked}
                            onChange={() => onChange(opt.value)}
                        />
                        <span
                            role="radio"
                            aria-checked={checked}
                            aria-disabled={opt.disabled}
                            className={cx(
                                "inline-flex items-center justify-center h-4 w-4 rounded-full border",
                                checked ? "border-blue-600" : "border-gray-400"
                            )}
                        >
                            <span className={cx("h-2.5 w-2.5 rounded-full", checked ? "bg-blue-600" : "bg-transparent")} />
                        </span>
                        <span className="flex flex-col">
                            <span>{opt.label}</span>
                            {opt.description ? <span className="text-xs text-gray-500">{opt.description}</span> : null}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

export default HeadlessRadioGroup;