import { NextRequest, NextResponse } from 'next/server'

// EmailJSまたはSendGridなど、実際のメールサービスと統合可能
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    // ここで実際のメール送信処理を行う
    // 例: SendGrid, AWS SES, EmailJS など

    // デモ用: コンソールに出力
    console.log('お問い合わせ受信:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    })

    // 実際の実装例（SendGridの場合）:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: 'info@bonten-an.com',
      from: 'noreply@bonten-an.com',
      subject: `【お問い合わせ】${subject || '件名なし'}`,
      html: `
        <h2>お問い合わせを受信しました</h2>
        <p><strong>お名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>電話番号:</strong> ${phone || 'なし'}</p>
        <p><strong>件名:</strong> ${subject || 'なし'}</p>
        <p><strong>メッセージ:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }

    await sgMail.send(msg)
    */

    return NextResponse.json({
      success: true,
      message: 'お問い合わせを送信しました。折り返しご連絡させていただきます。'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}