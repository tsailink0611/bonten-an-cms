// 認証関連のヘルパー関数 (デモモード対応)
import React from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, firestore, isDemoMode } from './firebase'
import type { User } from './firebase'

// デモユーザー定義
const DEMO_USERS = {
  'demo@cms-site-studio.com': 'demo123',
  'admin@cms-site-studio.com': 'admin123'
}

// デモモード用のユーザー状態管理
let currentDemoUser: FirebaseUser | null = null

// ログイン
export const loginWithEmail = async (email: string, password: string) => {
  // 常にデモモードとして処理（Firebase設定エラーを回避）
  console.log('ログイン試行:', email)

  if (DEMO_USERS[email as keyof typeof DEMO_USERS] === password) {
    const demoUser = {
      uid: 'demo-' + Date.now(),
      email,
      displayName: email.split('@')[0]
    } as FirebaseUser

    currentDemoUser = demoUser

    // デモ用のローカルストレージに保存
    localStorage.setItem('demo-user', JSON.stringify({
      uid: demoUser.uid,
      email: demoUser.email
    }))

    console.log('デモログイン成功:', email)
    return demoUser
  } else {
    console.log('デモログイン失敗:', email, password)
    throw new Error('メールアドレスまたはパスワードが正しくありません。デモアカウント: demo@cms-site-studio.com / demo123')
  }
}

// ユーザー登録
export const registerWithEmail = async (email: string, password: string) => {
  if (isDemoMode) {
    // デモモードでは新規登録を簡易実装
    const demoUser = {
      uid: 'demo-new-' + Date.now(),
      email,
      displayName: email.split('@')[0]
    } as FirebaseUser

    currentDemoUser = demoUser

    localStorage.setItem('demo-user', JSON.stringify({
      uid: demoUser.uid,
      email: demoUser.email
    }))

    return demoUser
  }

  if (!auth) {
    throw new Error('Firebase認証が利用できません')
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await createUserDocument(result.user.uid, email)
    return result.user
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

// ログアウト
export const logout = async () => {
  if (isDemoMode) {
    currentDemoUser = null
    localStorage.removeItem('demo-user')
    return
  }

  if (!auth) {
    throw new Error('Firebase認証が利用できません')
  }

  try {
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// ユーザードキュメント作成
const createUserDocument = async (uid: string, email: string) => {
  if (isDemoMode || !firestore) {
    return // デモモードまたはFirestore無効時はスキップ
  }

  const userRef = doc(firestore, 'users', uid)
  const siteId = generateSiteId()

  const userData: User = {
    id: uid,
    email,
    siteId,
    createdAt: new Date(),
    lastLogin: new Date()
  }

  await setDoc(userRef, userData)
  await createDefaultSite(uid, siteId)
  return userData
}

// デフォルトサイト作成
const createDefaultSite = async (ownerId: string, siteId: string) => {
  if (isDemoMode || !firestore) {
    return
  }

  const siteRef = doc(firestore, 'sites', siteId)

  const siteData = {
    id: siteId,
    domain: `${siteId}.cms-site-studio.com`,
    template: 'modern',
    ownerId,
    createdAt: new Date(),
    lastUpdated: new Date()
  }

  await setDoc(siteRef, siteData)
}

// ユーザーの最終ログイン時刻更新
const updateUserLastLogin = async (uid: string) => {
  if (isDemoMode || !firestore) {
    return
  }

  const userRef = doc(firestore, 'users', uid)
  await setDoc(userRef, { lastLogin: new Date() }, { merge: true })
}

// サイトID生成
const generateSiteId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}

// ユーザー情報取得
export const getUserData = async (uid: string): Promise<User | null> => {
  if (isDemoMode) {
    // デモユーザー情報を返す
    return {
      id: uid,
      email: currentDemoUser?.email || 'demo@cms-site-studio.com',
      siteId: 'demo-site-123',
      createdAt: new Date(),
      lastLogin: new Date()
    }
  }

  if (!firestore) {
    return null
  }

  try {
    const userRef = doc(firestore, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as User
    }
    return null
  } catch (error) {
    console.error('Get user data error:', error)
    return null
  }
}

// 認証状態監視のカスタムフック
export const useAuthState = () => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // 常にデモモードとして処理
    const checkDemoUser = () => {
      console.log('ユーザー状態チェック開始')
      const storedUser = localStorage.getItem('demo-user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          const demoUser = {
            uid: userData.uid,
            email: userData.email,
            displayName: userData.email.split('@')[0]
          } as FirebaseUser
          console.log('デモユーザー復元:', userData.email)
          setUser(demoUser)
        } catch (error) {
          console.error('ユーザーデータ復元エラー:', error)
          setUser(null)
        }
      } else {
        console.log('ローカルストレージにユーザーなし')
        setUser(null)
      }
      setLoading(false)
    }

    checkDemoUser()

    // ストレージの変更を監視
    const handleStorageChange = () => {
      checkDemoUser()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return { user, loading }
}