import { NextRequest, NextResponse } from 'next/server'

// メンテナンス情報管理API
export async function GET() {
  // 本来はDynamoDBから取得
  // ここでは環境変数またはハードコードで管理
  const maintenanceInfo = {
    isScheduled: process.env.MAINTENANCE_SCHEDULED === 'true',
    startDate: process.env.MAINTENANCE_START_DATE || '',
    endDate: process.env.MAINTENANCE_END_DATE || '',
    message: process.env.MAINTENANCE_MESSAGE || 'システムメンテナンスを実施いたします。'
  }

  return NextResponse.json(maintenanceInfo)
}

// 管理者用：メンテナンス情報設定
export async function POST(request: NextRequest) {
  try {
    const { isScheduled, startDate, endDate, message } = await request.json()

    // 本来はDynamoDBに保存
    // 今回は環境変数で管理（実際のプロダクションでは別の方法を使用）

    console.log('メンテナンス情報更新:', {
      isScheduled,
      startDate,
      endDate,
      message
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance info' }, { status: 500 })
  }
}