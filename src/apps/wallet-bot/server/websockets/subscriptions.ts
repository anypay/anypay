
import { registerSchema, topics } from "../../amqp"

export { topics }

import { z } from 'zod'

registerSchema('wallet-bot.connected', z.object({
    session_uid: z.string(),
    walletbot_id: z.number(),
    account_id: z.number(),
    timestamp: z.date(),
}))

registerSchema('wallet-bot.disconnected', z.object({
    session_uid: z.string(),
    walletbot_id: z.number(),
    account_id: z.number(),
    timestamp: z.date(),
}))

registerSchema('wallet-bot.invoice.created', z.object({
    uid: z.string(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string()
}))

registerSchema('wallet-bot.invoice.cancelled', z.object({
    uid: z.string(),
    status: z.string(),
    updated_at: z.string()
}))

registerSchema('wallet-bot.invoice.paid', z.object({
    uid: z.string(),
    status: z.string(),
    updated_at: z.string()
}))

registerSchema('wallet-bot.invoice.updated', z.object({
    uid: z.string(),
    status: z.string(),
    updated_at: z.string()
}))

registerSchema('wallet-bot.address.updated', z.object({
    chain: z.string(),
    currency: z.string(),
    address: z.string(),
    timestamp: z.date()
}))

registerSchema('wallet-bot.address.removed', z.object({
    chain: z.string(),
    currency: z.string(),
    address: z.string(),
    timestamp: z.date()
}))

registerSchema('wallet-bot.address.balance.updated', z.object({
    chain: z.string(),
    currency: z.string(),
    address: z.string(),
    value: z.string(),
    timestamp: z.date()
}))
