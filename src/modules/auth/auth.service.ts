import jwt, { JwtPayload } from 'jsonwebtoken';

export const AuthService = {
    // eslint-disable-next-line @typescript-eslint/require-await
    verifyToken: async (token: string) => {
        if (!token) throw new Error('No token provided');

        return jwt.verify(token, process.env.AUTH0_PUBLIC_KEY!) as JwtPayload;
    },
};
