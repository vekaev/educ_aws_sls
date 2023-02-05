import { StatusCodes } from 'http-status-codes';

import { PolicyEffect } from '@/types';

export const responseFactory = (body: object, statusCode = StatusCodes.OK) => ({
    body,
    statusCode,
});

export const getTokenFrom = (event: {
    authorizationToken: string;
    headers?: {
        Authorization: string;
    };
}): string => {
    const token = event.authorizationToken || event.headers?.Authorization;

    if (!token || !token.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    return token.split(' ')[1] || '';
};

// By default, API Gateway authorizations are cached (TTL) for 300 seconds.
// This policy will authorize all requests to the same API Gateway instance where the
// request is coming from, thus being efficient and optimising costs.
export const generatePolicy = (
    methodArn: string,
    principalId: string,
    effect: PolicyEffect = PolicyEffect.ALLOW,
) => {
    const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: apiGatewayWildcard,
                },
            ],
        },
    };
};
