import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { USER_RANK, USER_TYPE } from '@prisma/client';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

interface JWTPayload {
    id: string;
    role: USER_TYPE;
    rank: USER_RANK;
}

// createJWT: نقبل فقط الحقول المطلوبة في الـ payload
export function createJWT(
    { id, role, rank }: { id: string; role: USER_TYPE; rank: USER_RANK },
    expiresIn: number | StringValue = '7d'
) {
    const payload: JWTPayload = { id, role, rank };
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
}

// verifyJWT
export function verifyJWT<T = JWTPayload>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
}
