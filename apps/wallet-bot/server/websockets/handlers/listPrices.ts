import { Request } from '../router/router';

export default async function({ session }: Request) {

    const prices = { todo: 'not implemented' }

    session.sendMessage('pricesList', { prices })

}