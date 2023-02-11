import { JwtPayload } from 'jsonwebtoken';

export interface IUser extends JwtPayload {
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
}
