import React, { useRef, useState } from "react";

export type TokenInputProps = {
  value: string[];
  onChange: (tokens: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  allowDuplicates?: boolean;
  className?: string;
  chipClassName?: string;       // 선택 칩 스타일 커스텀
  inputClassName?: string;
  onAddToken?: (t: string) => void;
  onRemoveToken?: (t: string) => void;
  validateToken?: (t: string) => boolean;
};

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  placeholder,
  suggestions,
  allowDuplicates = false,
  className,
  chipClassName,
  inputClassName,
  onAddToken,
  onRemoveToken,
  validateToken,
}) => {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const token = raw.trim();
    if (!token) return;
    if (validateToken && !validateToken(token)) return;
    if (!allowDuplicates && value.includes(token)) {
      setText("");
      return;
    }
    const next = [...value, token];
    onChange(next);
    onAddToken?.(token);
    setText("");
  };

  const removeAt = (i: number) => {
    const token = value[i];
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
    onRemoveToken?.(token);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      commit(text);
    } else if (e.key === "Backspace" && text === "" && value.length) {
      e.preventDefault();
      removeAt(value.length - 1);
    }
  };

  const filtered =
    (suggestions || []).filter(
      (s) =>
        s.toLowerCase().includes(text.toLowerCase()) &&
        (!allowDuplicates ? !value.includes(s) : true)
    ) ?? [];

  return (
    <div className={cx("relative", className)} onClick={() => inputRef.current?.focus()}>
      <div
        className={cx(
          "min-h-[2.25rem] w-full rounded-md border",
          "px-2 py-1 flex flex-wrap items-center gap-1",
          focused ? "ring-2 ring-blue-400/70 border-blue-400/70" : "border-input"
        )}
      >
        {value.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className={cx(
              // 기본을 약간 더 선명한 톤으로
              "inline-flex items-center gap-1 rounded border px-2 text-xs h-6",
              "bg-blue-100 text-blue-800 border-blue-200",
              chipClassName
            )}
          >
            {t}
            <button
              type="button"
              aria-label="remove"
              className="text-blue-700/70 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                removeAt(i);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={value.length ? undefined : placeholder}
          className={cx(
            "flex-1 min-w-[120px] outline-none bg-transparent text-sm h-6",
            inputClassName
          )}
        />
      </div>

      {focused && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md border bg-white p-1 shadow">
          <div className="flex flex-wrap gap-1">
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenInput;