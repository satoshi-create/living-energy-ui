'use client'

import { createContext, useContext } from 'react'
import type { PanelTiltContextValue } from '../types'

export const PanelTiltContext = createContext<PanelTiltContextValue>({
  tiltDeg: 30,
  isRetracted: false,
})

export function usePanelTilt() {
  return useContext(PanelTiltContext)
}
