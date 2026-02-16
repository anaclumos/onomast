import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { Resend } from 'resend'
import { db } from '@/db'
// biome-ignore lint/performance/noNamespaceImport: Drizzle adapter requires schema namespace
import * as schema from '@/db/schema'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : undefined

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      if (!resend) {
        return
      }
      await resend.emails.send({
        from: 'this@is.onomast.app',
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (!resend) {
        return
      }
      await resend.emails.send({
        from: 'this@is.onomast.app',
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
      })
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [tanstackStartCookies()], // MUST be last plugin
})
