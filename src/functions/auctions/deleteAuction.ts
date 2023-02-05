import { AuctionsService } from '@/modules/auctions';
import { middify, verifyParamIdMiddleware } from '@/utils/middlewares';

import { MiddyfiedEvent } from '@/types';

export const handler = middify((event: MiddyfiedEvent) =>
    AuctionsService.deleteAuction(event.pathParameters.id!),
).use(verifyParamIdMiddleware());
