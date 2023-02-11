import { fromIni } from '@aws-sdk/credential-providers';

export const DEFAULT_AMAZON_CLIENT_CONFIG = {
    region: process.env.AWS_DB_REGION,
    credentials: fromIni({
        profile: process.env.AWS_DB_PROFILE,
    }),
};
