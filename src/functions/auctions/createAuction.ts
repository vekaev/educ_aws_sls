import {
    AuctionsService,
    createAuctionSchema,
    CreateAuctionBodyDto,
} from '@/modules/auctions';

import { middify } from '@/utils/middlewares';
import { getUserFrom } from '@/utils/auth.utils';
import { validatorMiddleware } from '@/utils/middlewares/validator.middleware';

import { MiddyfiedEvent } from '@/types';

export const handler = middify(
    (event: MiddyfiedEvent<CreateAuctionBodyDto>) => {
        const user = getUserFrom(event);

        return AuctionsService.createAuction(event.body.title, user.email);
    },
).use(validatorMiddleware(createAuctionSchema));
