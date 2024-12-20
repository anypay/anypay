
import { sign, verify } from 'jsonwebtoken';

export const JWT_SECRET = String(process.env.PRICES_JWT_SECRET)

export type Role = 'admin' | 'producer' | 'consumer' ;

export type Token = string;

interface AuthTokenData {
    roles: Role[];
}

export interface AdminAuthTokenData extends AuthTokenData {
    roles: ['admin'];
}

/* Producers are authorized to produce prices for one source */
export interface ProducerAuthTokenData extends AuthTokenData {
    roles: ['producer'];
    sources: string[];
}

export interface ConsumerAuthTokenData extends AuthTokenData {
    roles: ['consumer'];
}

export type AuthTokenDataTypes = AdminAuthTokenData | ProducerAuthTokenData | ConsumerAuthTokenData;

export async function issueToken<T>(payload: AuthTokenDataTypes): Promise<Token> {

    return sign(payload, JWT_SECRET)

}

export async function issueProducerToken(sources: string[]): Promise<Token> {
    return issueToken({
        roles: ['producer'],
        sources
    });
}

export async function issueConsumerToken(): Promise<Token> {
    return issueToken({
        roles: ['consumer']
    });
}

export async function issueAdminToken(): Promise<Token> {
    return issueToken({
        roles: ['admin']
    });
}

export async function verifyToken(token: Token): Promise<any> {
    const data = verify(token, JWT_SECRET) as unknown as any;

    if (data.roles.includes('admin')) {
        return verifyAdminToken(token);
    }
    if (data.roles.includes('producer')) {
        return verifyProducerToken(token);
    }
    if (data.roles.includes('consumer')) {
        return verifyConsumerToken(token);
    }
    throw new Error('Invalid token');
}

export async function verifyAdminToken(token: Token): Promise<AdminAuthTokenData> {
    const decoded: AdminAuthTokenData = await  verify(token, JWT_SECRET) as AdminAuthTokenData;
    
    if (decoded.roles.includes('admin')) {
        return decoded as AdminAuthTokenData;
    } else {
        throw new Error('Invalid admin token');
    }
}

export async function verifyProducerToken(token: Token): Promise<ProducerAuthTokenData> {
    const decoded: ProducerAuthTokenData = await verify(token, JWT_SECRET) as ProducerAuthTokenData;
    
    if (decoded.roles.includes('producer')) {
        return decoded as ProducerAuthTokenData;
    } else {
        throw new Error('Invalid producer token');
    }
}

export async function verifyConsumerToken(token: Token): Promise<ConsumerAuthTokenData> {
    const decoded: ConsumerAuthTokenData = await verify(token, JWT_SECRET) as ConsumerAuthTokenData;
    
    if (decoded.roles.includes('consumer')) {
        return decoded as ConsumerAuthTokenData;
    } else {
        throw new Error('Invalid consumer token');
    }
}