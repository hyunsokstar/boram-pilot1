'use client';

import { Popover as HeadlessPopover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '@/shared/lib/utils';

interface PopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    panelClassName?: string;
    placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right';
}

export function Popover({
    trigger,
    children,
    className = '',
    panelClassName = '',
    placement = 'bottom'
}: PopoverProps) {
    const getPlacementClasses = () => {
        switch (placement) {
            case 'bottom':
                return 'top-full mt-2 left-0';
            case 'bottom-left':
                return 'top-full mt-2 left-0';
            case 'bottom-right':
                return 'top-full mt-2 right-0';
            case 'top':
                return 'bottom-full mb-2 left-0';
            case 'left':
                return 'right-full mr-2 top-0';
            case 'right':
                return 'left-full ml-2 top-0';
            default:
                return 'top-full mt-2 left-0';
        }
    };

    return (
        <HeadlessPopover className={cn('relative', className)}>
            <HeadlessPopover.Button as="div">
                {trigger}
            </HeadlessPopover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <HeadlessPopover.Panel
                    className={cn(
                        'absolute z-50 min-w-max rounded-md bg-white border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                        getPlacementClasses(),
                        panelClassName
                    )}
                >
                    {children}
                </HeadlessPopover.Panel>
            </Transition>
        </HeadlessPopover>
    );
}
