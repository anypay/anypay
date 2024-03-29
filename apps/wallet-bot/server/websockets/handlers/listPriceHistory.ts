import { Request } from '../router/router';

export default async function({ session }: Request) {

    const priceHistory = { todo: 'not implemented' }

    session.sendMessage('priceHistory', { priceHistory })

}