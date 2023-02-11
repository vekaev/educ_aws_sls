// Imported by this way to reduce bundle size
// TODO: should be removed after @types/jsonwebtoken is updated
// @ts-ignore
import jwt_verify from 'jsonwebtoken/verify';
import type { verify } from 'jsonwebtoken';

import { Auth0JwtPayload } from '@/types';

export const AuthService = {
    verifyToken: async (token: string): Promise<Auth0JwtPayload> => {
        if (!token) throw new Error('No token provided');

        return (jwt_verify as typeof verify)(
            token,
            process.env.AUTH0_PUBLIC_KEY!,
        ) as Promise<Auth0JwtPayload>;
    },
};
