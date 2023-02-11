import { fromIni } from '@aws-sdk/credential-providers';

import { IS_LOCAL } from './env.constants';

export const DEFAULT_AMAZON_CLIENT_CONFIG = IS_LOCAL
    ? {
          region: process.env.AWS_DB_REGION,
          credentials: fromIni({
              profile: process.env.AWS_DB_PROFILE,
          }),
      }
    : {};
