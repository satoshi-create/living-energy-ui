'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

/** Max concurrent preview WebGL roots (avoids React 19 × R3F sync-unmount races). */
const PREVIEW_SLOT_LIMIT = 1

type SlotWaiter = {
  id: string
  grant: () => void
}

let previewSlotsInUse = 0
const previewWaitQueue: SlotWaiter[] = []

function releasePreviewSlot(holderId: string | null) {
  if (!holderId) return
  previewSlotsInUse = Math.max(0, previewSlotsInUse - 1)
  const next = previewWaitQueue.shift()
  if (next) {
    previewSlotsInUse += 1
    next.grant()
  }
}

function requestPreviewSlot(
  id: string,
  onGranted: () => void,
): { held: boolean; cancelWait: () => void } {
  if (previewSlotsInUse < PREVIEW_SLOT_LIMIT) {
    previewSlotsInUse += 1
    onGranted()
    return { held: true, cancelWait: () => {} }
  }
  const waiter: SlotWaiter = { id, grant: onGranted }
  previewWaitQueue.push(waiter)
  return {
    held: false,
    cancelWait: () => {
      const i = previewWaitQueue.findIndex((w) => w.id === id)
      if (i >= 0) previewWaitQueue.splice(i, 1)
    },
  }
}

export type WebGLMountGateProps = {
  children: ReactNode
  className?: string
  /** When true, skip the shared preview semaphore (detail / full viewers). */
  priority?: boolean
  /** Require pointer hover/focus before mounting (list cards). */
  activateOnPointer?: boolean
  placeholder?: ReactNode
}

function DefaultPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-950/70">
      <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <span className="text-[10px] text-muted-foreground">3D待機中</span>
    </div>
  )
}

/**
 * Defers R3F &lt;Canvas&gt; mount until after layout, optionally until pointer
 * / intersection, and caps concurrent preview roots at 1.
 */
export function WebGLMountGate({
  children,
  className,
  priority = false,
  activateOnPointer = false,
  placeholder,
}: WebGLMountGateProps) {
  const reactId = useId()
  const hostRef = useRef<HTMLDivElement>(null)
  const holderIdRef = useRef<string | null>(null)
  const [inView, setInView] = useState(priority)
  const [pointerHot, setPointerHot] = useState(!activateOnPointer)
  const [slotReady, setSlotReady] = useState(priority)
  const [paintReady, setPaintReady] = useState(false)

  const wantsMount = (priority || inView) && pointerHot

  useEffect(() => {
    if (priority) return
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '48px', threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [priority])

  useEffect(() => {
    if (priority) {
      setSlotReady(true)
      return
    }
    if (!wantsMount) {
      const t = window.setTimeout(() => {
        releasePreviewSlot(holderIdRef.current)
        holderIdRef.current = null
        setSlotReady(false)
      }, 80)
      return () => clearTimeout(t)
    }

    let cancelled = false
    const { held, cancelWait } = requestPreviewSlot(reactId, () => {
      if (cancelled) {
        releasePreviewSlot(reactId)
        return
      }
      holderIdRef.current = reactId
      setSlotReady(true)
    })
    if (held) holderIdRef.current = reactId

    return () => {
      cancelled = true
      cancelWait()
      // Defer release so we never sync-unmount an R3F root mid-parent-render.
      window.setTimeout(() => {
        if (holderIdRef.current === reactId) {
          releasePreviewSlot(reactId)
          holderIdRef.current = null
        }
      }, 0)
    }
  }, [wantsMount, priority, reactId])

  useEffect(() => {
    if (!slotReady || !wantsMount) {
      setPaintReady(false)
      return
    }
    const id = requestAnimationFrame(() => setPaintReady(true))
    return () => cancelAnimationFrame(id)
  }, [slotReady, wantsMount])

  const showCanvas = wantsMount && slotReady && paintReady
  const leaveTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current != null) {
        window.clearTimeout(leaveTimerRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className={cn('relative h-full w-full', className)}
      onPointerEnter={
        activateOnPointer
          ? () => {
              if (leaveTimerRef.current != null) {
                window.clearTimeout(leaveTimerRef.current)
                leaveTimerRef.current = null
              }
              setPointerHot(true)
            }
          : undefined
      }
      onPointerLeave={
        activateOnPointer
          ? () => {
              leaveTimerRef.current = window.setTimeout(() => {
                leaveTimerRef.current = null
                setPointerHot(false)
              }, 60)
            }
          : undefined
      }
    >
      {showCanvas ? children : (placeholder ?? <DefaultPlaceholder />)}
    </div>
  )
}
