import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectContextType {
    value: string;
    onValueChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    placeholder?: string;
}

const SelectContext = createContext<SelectContextType | null>(null);

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    value = "",
    onValueChange = () => { },
    children,
    placeholder
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 바깥 클릭 감지: 트리거와 콘텐츠를 모두 포함한 컨테이너 기준
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, placeholder }}>
            <div ref={containerRef} className="relative w-full" data-select-root>
                {children}
            </div>
        </SelectContext.Provider>
    );
};

interface SelectTriggerProps {
    children?: ReactNode;
    className?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectTrigger must be used within Select');
    const { isOpen, setIsOpen } = context;

    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
                'flex h-10 w-full items-center justify-between rounded-md border border-input',
                'bg-white px-3 py-2 text-sm ring-offset-background',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'hover:bg-gray-50 transition-colors',
                className
            )}
        >
            {children}
            <ChevronDown
                className={cn(
                    'h-4 w-4 opacity-50 transition-transform duration-200',
                    isOpen && 'transform rotate-180'
                )}
            />
        </button>
    );
};

interface SelectValueProps {
    placeholder?: string;
    className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className }) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectValue must be used within Select');

    const { value, placeholder: contextPlaceholder } = context;
    const displayPlaceholder = placeholder || contextPlaceholder;

    return (
        <span className={cn('text-left', !value && 'text-muted-foreground', className)}>
            {value || displayPlaceholder}
        </span>
    );
};

interface SelectContentProps {
    children: ReactNode;
    className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectContent must be used within Select');

    const { isOpen } = context;
    if (!isOpen) return null;

    return (
        <div
            className={cn(
                'absolute top-full left-0 z-50 w-full mt-1',
                'min-w-[8rem] overflow-hidden rounded-md border bg-white',
                'shadow-md animate-in fade-in-0 zoom-in-95',
                className
            )}
        >
            <div className="max-h-60 overflow-y-auto p-1">
                {children}
            </div>
        </div>
    );
};

interface SelectItemProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className }) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectItem must be used within Select');

    const { value: selectedValue, onValueChange, setIsOpen } = context;
    const isSelected = selectedValue === value;

    const handleSelect = () => {
        onValueChange(value);
        setIsOpen(false);
    };

    return (
        <div
            onClick={handleSelect}
            className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2',
                'text-sm outline-none transition-colors duration-150',
                'text-gray-900',
                'hover:bg-blue-50 hover:text-blue-900',
                isSelected ? 'bg-blue-100 text-blue-900 font-medium' : '',
                'focus:bg-blue-50 focus:text-blue-900',
                className
            )}
        >
            {isSelected && (
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4 text-blue-600" />
                </span>
            )}
            {children}
        </div>
    );
};