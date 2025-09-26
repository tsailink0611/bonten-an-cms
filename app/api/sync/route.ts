// 同期API - AWS DynamoDB ベース
import { NextRequest, NextResponse } from 'next/server'
import { SiteContent } from '@/lib/content-manager-enhanced'
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

// AWS DynamoDB クライアント
const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

const TABLE_NAME = 'cms-content-storage'
const SITE_ID = 'bonten-an'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')

  console.log('📡 Sync API GET - action:', action);

  try {
    if (action === 'status') {
      // DynamoDBからデータ取得して状態確認
      const getCommand = new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ siteId: SITE_ID })
      })

      const response = await dynamoClient.send(getCommand)
      const hasContent = !!response.Item
      const lastUpdated = hasContent ? unmarshall(response.Item!).lastUpdated : null

      const status = {
        lastUpdated,
        needsSync: hasContent,
        hasContent
      };
      console.log('📋 Sync API Status:', status);
      return NextResponse.json(status)
    }

    if (action === 'get') {
      // DynamoDBからコンテンツ取得
      const getCommand = new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ siteId: SITE_ID })
      })

      const response = await dynamoClient.send(getCommand)
      const data = response.Item ? unmarshall(response.Item) : null

      const result = {
        content: data?.content || null,
        lastUpdated: data?.lastUpdated || null
      };
      console.log('📎 Sync API GET - returning content:', {
        hasContent: result.content !== null,
        productCount: result.content?.products?.length || 0
      });
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('❌ Sync GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Sync API POST - receiving data');
    const body = await request.json()
    const { content } = body as { content: SiteContent }

    if (!content) {
      console.error('❌ Sync API POST - No content provided');
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    console.log('📎 Sync API POST - content received:', {
      products: content.products?.length || 0,
      productTitles: content.products?.map(p => p.title) || []
    });

    // DynamoDBに保存
    const lastUpdated = new Date().toISOString()
    const putCommand = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall({
        siteId: SITE_ID,
        content: content,
        lastUpdated: lastUpdated
      })
    })

    await dynamoClient.send(putCommand)

    console.log('✅ Content synced to DynamoDB:', {
      products: content.products?.length || 0,
      lastUpdated: lastUpdated
    })

    return NextResponse.json({
      success: true,
      lastUpdated: lastUpdated,
      productCount: content.products?.length || 0
    })
  } catch (error) {
    console.error('❌ Sync POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}