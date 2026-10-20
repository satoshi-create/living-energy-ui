'use client'

import { useMemo } from 'react'
import { CanvasTexture } from 'three'

/**
 * 3D空間に配置する2行ラベル（部位名＋役割）。
 * Canvas 2Dで描画したテクスチャを sprite として貼る。
 */
export function LabelSprite({
  text,
  subText,
  badge,
  accentColor = '#10b981',
  position,
  scale = [0.75, 0.26, 1],
}: {
  text: string
  subText?: string
  badge?: string
  accentColor?: string
  position: [number, number, number]
  scale?: [number, number, number]
}) {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 420
    canvas.height = 130
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // 前面描画の重複を防ぐためキャンバス全面をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 背景角丸ピル
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(10, 10, 400, 110, 24)
    ctx.fill()
    ctx.stroke()

    // 番号・記号バッジ
    let textStartX = 36
    if (badge) {
      ctx.fillStyle = accentColor
      ctx.beginPath()
      ctx.arc(65, 65, 28, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = 'bold 32px sans-serif'
      ctx.fillStyle = '#0f172a'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(badge, 65, 66)
      textStartX = 114
    }

    if (subText) {
      // 1行目: 部位名
      ctx.font = 'bold 32px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif'
      ctx.fillStyle = '#f8fafc'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, textStartX, 46)

      // 2行目: 役割（エメラルド / シアン強調）
      ctx.font = '500 24px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif'
      ctx.fillStyle = accentColor
      ctx.fillText(subText, textStartX, 84)
    } else {
      ctx.font = 'bold 36px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif'
      ctx.fillStyle = '#f8fafc'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, textStartX, 65)
    }

    const tex = new CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [text, subText, badge, accentColor])

  if (!texture) return null

  return (
    <sprite position={position} scale={scale}>
      <spriteMaterial map={texture} depthTest={false} transparent />
    </sprite>
  )
}
