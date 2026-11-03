/**
 * Transactional email adapter (LEAD-17, LEAD-18, INTEGRATIONS.md).
 * EMAIL_ADAPTER = smtp | log | fail | none (default: smtp when SMTP_HOST is set, otherwise none).
 * "none" never pretends to succeed: notifications stay queued until a provider is configured.
 */
export interface OutgoingEmail {
  to: string
  subject: string
  text: string
  replyTo?: string
}
export interface EmailAdapter {
  name: string
  configured: boolean
  send(msg: OutgoingEmail): Promise<{ id?: string }>
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('Email provider not configured (set SMTP_HOST or EMAIL_ADAPTER). Notification kept in queue.')
  }
}

let cached: EmailAdapter | null = null
export function resetEmailAdapter() {
  cached = null
}

export async function getEmailAdapter(): Promise<EmailAdapter> {
  if (cached) return cached
  const kind = process.env.EMAIL_ADAPTER || (process.env.SMTP_HOST ? 'smtp' : 'none')
  if (kind === 'log') {
    cached = {
      name: 'log',
      configured: true,
      async send(msg) {
        console.info(`[email:log] to=${msg.to} subject="${msg.subject}"`)
        return { id: `log-${Date.now()}` }
      },
    }
  } else if (kind === 'fail') {
    cached = {
      name: 'fail',
      configured: true,
      async send() {
        throw new Error('Simulated email provider failure (EMAIL_ADAPTER=fail)')
      },
    }
  } else if (kind === 'smtp') {
    const nodemailer = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    })
    cached = {
      name: 'smtp',
      configured: true,
      async send(msg) {
        const info = await transport.sendMail({ from: process.env.EMAIL_FROM || 'no-reply@localhost', ...msg })
        return { id: info.messageId }
      },
    }
  } else {
    cached = {
      name: 'none',
      configured: false,
      async send() {
        throw new EmailNotConfiguredError()
      },
    }
  }
  return cached
}
