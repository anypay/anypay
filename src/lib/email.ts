import { Invoice } from "@/lib/invoices";

interface EmailResult {
    MessageId: string
}

export async function firstInvoicePaidEmail(invoice: Invoice): Promise<EmailResult> {
    return {
        MessageId: "123"
    }
}

export async function invoicePaidEmail(invoice: Invoice): Promise<EmailResult> {
    return {
        MessageId: "123"
    }
}