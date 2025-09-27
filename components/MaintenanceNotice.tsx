'use client'

import { useState, useEffect } from 'react'

interface MaintenanceInfo {
  isScheduled: boolean
  startDate: string
  endDate: string
  message: string
}

export default function MaintenanceNotice() {
  const [maintenance, setMaintenance] = useState<MaintenanceInfo | null>(null)

  useEffect(() => {
    // メンテナンス情報を取得
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/maintenance')
        if (response.ok) {
          const data = await response.json()
          setMaintenance(data)
        }
      } catch (error) {
        console.error('メンテナンス情報取得エラー:', error)
      }
    }

    checkMaintenance()
    // 1時間ごとにチェック
    const interval = setInterval(checkMaintenance, 3600000)
    return () => clearInterval(interval)
  }, [])

  if (!maintenance?.isScheduled) return null

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center text-sm">
          <svg
            className="w-5 h-5 text-yellow-600 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-yellow-800">
            <strong>メンテナンスのお知らせ：</strong>
            {maintenance.startDate} 〜 {maintenance.endDate}の間、
            {maintenance.message}
          </p>
        </div>
      </div>
    </div>
  )
}