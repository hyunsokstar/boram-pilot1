"use client";

import type { ComponentType } from 'react';
import { views } from './index';

// "/dashboard/..." 경로를 받아 key("..." 부분)로 변환하는 유틸
const keyFromHref = (href: string): string | null => {
    if (!href) return null;
    const i = href.toLowerCase().indexOf('/dashboard/');
    if (i === -1) return null;
    let key = href.slice(i + '/dashboard/'.length);
    key = key.replace(/^\/+|\/+$/g, ''); // 앞뒤 슬래시 제거
    return key || null;
};

export function resolveViewByHref(href?: string): ComponentType | null {
    if (!href) return null;
    const key = keyFromHref(href);
    if (!key) return null;
    // 완전 일치 먼저
    if (views[key]) return views[key];
    // 접두 일치(동적 세그먼트 대비)
    const found = Object.entries(views).find(([k]) => key.startsWith(k));
    return found ? found[1] : null;
}
