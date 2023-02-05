import {
    APIGatewayAuthorizerResult,
    APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';

import { AuthService } from '@/modules/auth';
import { generatePolicy, getTokenFrom } from '@/utils/common.helpers';

import { PolicyEffect } from '@/types';

export const handler = async (
    event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
    try {
        const token = getTokenFrom(event);
        const claims = await AuthService.verifyToken(token);

        return {
            context: claims,
            ...generatePolicy(event.methodArn, claims.sub!),
        };
    } catch (error) {
        return generatePolicy(event.methodArn, 'user', PolicyEffect.DENY);
    }
};
