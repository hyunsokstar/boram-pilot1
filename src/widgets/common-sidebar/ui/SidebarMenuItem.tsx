import React from 'react';

interface SidebarMenuItemProps {
  menuNm: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  hasSubMenu?: boolean;
  isExpanded?: boolean;
  paddingLeft: number | string;
  isTop?: boolean;
  highlightTopNo?: string | null;
  menuNo: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function SidebarMenuItem({
  menuNm,
  onClick,
  disabled = false,
  isActive = false,
  hasSubMenu = false,
  isExpanded = false,
  paddingLeft,
  isTop = false,
  highlightTopNo,
  menuNo,
  className = "",
  icon,
  children
}: SidebarMenuItemProps) {
  const baseClasses = "w-full p-2 text-left rounded text-sm transition-all duration-200 active:scale-95";
  const hoverClasses = disabled ? "" : "hover:bg-slate-700";
  const activeClasses = disabled ? "cursor-default opacity-50" : "cursor-pointer";
  const highlightClasses = highlightTopNo === menuNo ? "ring-2 ring-indigo-400/60" : "";
  
  let specificClasses = "";
  let bgClasses = "";
  
  if (isTop && hasSubMenu) {
    specificClasses = "flex items-center justify-between";
    bgClasses = isActive 
      ? "bg-slate-700/80 text-white font-semibold border-l-2 border-indigo-400" 
      : "";
  } else if (isTop && !hasSubMenu) {
    specificClasses = "flex items-center";
    bgClasses = isActive
      ? "bg-slate-700/80 text-white font-semibold border-l-3 border-indigo-400 shadow-md"
      : "text-white hover:bg-slate-700/40 active:bg-slate-600";
  } else if (!isTop && hasSubMenu) {
    specificClasses = "flex items-center justify-between";
    bgClasses = "active:bg-slate-600";
  } else {
    specificClasses = "block";
    bgClasses = isActive
      ? "bg-slate-700 text-white font-medium border-l-2 border-indigo-400"
      : "text-gray-300 hover:text-white hover:bg-slate-700 active:bg-slate-600";
  }

  const finalClassName = `${baseClasses} ${specificClasses} ${hoverClasses} ${bgClasses} ${activeClasses} ${highlightClasses} ${className}`.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
      style={{ paddingLeft: typeof paddingLeft === 'number' ? `${paddingLeft}px` : paddingLeft }}
      aria-expanded={hasSubMenu ? isExpanded : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      {children || (
        <div className="flex items-center gap-2">
          {icon || (
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${
              isActive ? "bg-indigo-400" : "bg-gray-400"
            }`} />
          )}
          <span className={isTop && isActive ? "text-white" : ""}>{menuNm}</span>
        </div>
      )}
      
      {hasSubMenu && (
        <svg
          className={`w-4 h-4 transition-transform ${
            isExpanded ? "rotate-90 text-gray-100" : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
    </button>
  );
}
