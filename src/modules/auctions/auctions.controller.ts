import { middify, verifyParamIdMiddleware, validatorMiddleware } from '@/utils';

import {
    placeBidDto,
    createAuctionDto,
    updateAuctionDto,
} from './auctions.dto';
import { AuctionsService } from './auctions.service';

export const AuctionsController = {
    getAuctions: middify(() => AuctionsService.getAuctions()),

    getAuction: middify((event) =>
        AuctionsService.getAuction(event.pathParameters.id),
    ).use(verifyParamIdMiddleware()),

    createAuction: middify((event) =>
        AuctionsService.createAuction(event.body.title),
    ).use(validatorMiddleware(createAuctionDto)),

    updateAuction: middify((event) =>
        AuctionsService.updateAuction(event.pathParameters.id, event.body),
    )
        .use(verifyParamIdMiddleware())
        .use(validatorMiddleware(updateAuctionDto)),

    deleteAuction: middify((event) =>
        AuctionsService.deleteAuction(event.pathParameters.id),
    ).use(verifyParamIdMiddleware()),

    placeBid: middify((event) =>
        AuctionsService.placeBid(event.pathParameters.id, event.body.amount),
    )
        .use(verifyParamIdMiddleware())
        .use(validatorMiddleware(placeBidDto)),

    processAuctions: middify(() => AuctionsService.processAuctions()),
};
