import 'server-only'
import { cookies } from 'next/headers'
import { decrypt, encrypt } from '@/app/lib/session/utils'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { fetchUserData } from '../data/api'

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    const session = await encrypt({ userId, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}


export async function updateSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: false,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}


export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}


export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        return null
    }

    return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    try {
        const user = await fetchUserData(session.userId as number);
        // console.log("[getUser]: ",user)
        return user
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})

