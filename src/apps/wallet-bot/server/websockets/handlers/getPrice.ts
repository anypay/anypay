import { Request } from '../router/router';

export default async function({ session }: Request) {

    const price = { todo: 'not implemented' }

    session.sendMessage('price', { price })

}