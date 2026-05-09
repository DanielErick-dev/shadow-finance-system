"use client"

import { cn } from '@base/lib/utils'

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn('animate-pulse rounded-md bg-slate-700/50', className)} />
    )
}
