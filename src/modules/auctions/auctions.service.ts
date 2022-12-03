import { v4 as uuid } from 'uuid';
import { StatusCodes } from 'http-status-codes';

import { now, responseFactory } from '~utils';

import { Auction, StatusEnum } from './auctions.types';
import { AuctionsRepository } from './auctions.repository';

export const AuctionsService = {
    getAuctions: AuctionsRepository.getAll,

    getAuction: (id: string) => AuctionsRepository.getById(id),

    createAuction: async (title: string) => {
        const createdAt = now();
        const auction: Auction = {
            id: uuid(),
            title,
            status: StatusEnum.OPEN,
            createdAt,
            updatedAt: createdAt,
            highestBid: {
                amount: 0,
            },
        };

        await AuctionsRepository.create(auction);

        return responseFactory(auction, StatusCodes.CREATED);
    },

    updateAuction: (id: string, data: Partial<Auction>) => {
        const updatedAt = now();

        return AuctionsRepository.update(id, { updatedAt, ...data });
    },

    deleteAuction: async (id: string) => {
        await AuctionsRepository.delete(id);

        return responseFactory({}, StatusCodes.ACCEPTED);
    },
};
