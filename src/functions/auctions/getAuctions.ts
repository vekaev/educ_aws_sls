import { AuctionsService, getAuctionsSchema } from '@/modules/auctions';
import { middify } from '@/utils/middlewares';
import { validatorMiddleware } from '@/utils/middlewares/validator.middleware';

import { MiddyfiedEvent } from '@/types';

export const handler = middify((event: MiddyfiedEvent) =>
    AuctionsService.getAuctions(event.queryStringParameters),
).use(validatorMiddleware(getAuctionsSchema));
