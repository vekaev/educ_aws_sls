import { v4 as uuid } from 'uuid';
import createError from 'http-errors';
import addHours from 'date-fns/addHours';
import { StatusCodes } from 'http-status-codes';

import { s3 } from '@/libs/s3';
import { sqs } from '@/libs/sqs';

import { responseFactory } from '@/utils/common.helpers';

import { Auction, StatusEnum } from './auctions.types';
import { AuctionsRepository } from './auctions.repository';
import { GetAuctionsQueryDto, UpdateAuctionBodyDto } from './auctions.dto';

export const AuctionsService = {
    getAuctions: (query: GetAuctionsQueryDto = {}) => {
        if (query.status)
            return AuctionsRepository.getAuctionsByStatus(query.status);

        return AuctionsRepository.getAll();
    },

    getAuction: (id: string) => AuctionsRepository.getById(id),

    createAuction: async (title: string, seller: string) => {
        const now = new Date();
        const createdAt = now.toISOString();
        const endingAt = addHours(now, 1).toISOString();
        const auction: Auction = {
            id: uuid(),
            title,
            seller,
            endingAt,
            createdAt,
            updatedAt: createdAt,
            status: StatusEnum.OPEN,
            highestBid: { amount: 0 },
        };

        await AuctionsRepository.create(auction);

        return responseFactory(auction, StatusCodes.CREATED);
    },

    updateAuction: async (
        id: string,
        { picture, ...updateAuctionDto }: UpdateAuctionBodyDto,
    ) => {
        let auction: Auction | undefined;
        const newData: Partial<Auction> = {
            ...updateAuctionDto,
            updatedAt: new Date().toISOString(),
        };

        if (picture) {
            auction = await AuctionsService.getAuction(id);
            newData.pictureUrl = await s3.uploadImage(uuid(), picture);
        }

        try {
            const result = await AuctionsRepository.update(id, newData);

            if (picture && auction?.pictureUrl) {
                await s3.deleteImage(auction.pictureUrl).catch((error) => {
                    console.error('Could not delete picture', error);
                    console.info('Old picture URL', auction?.pictureUrl);
                });
            }

            return result;
        } catch (error) {
            console.info(error);

            if (picture && newData.pictureUrl)
                await s3.deleteImage(newData.pictureUrl).catch((error) => {
                    console.error('Could not delete picture', error);
                    console.info('New picture URL', newData.pictureUrl);
                });

            throw createError.InternalServerError('Could not update auction');
        }
    },

    deleteAuction: async (id: string) => {
        await AuctionsService.getAuction(id);
        await AuctionsRepository.delete(id);

        return responseFactory({}, StatusCodes.ACCEPTED);
    },

    closeAuction: async (auction: Auction) => {
        if (auction.status === StatusEnum.CLOSED)
            throw new createError.Forbidden('Auction is already closed!');

        await AuctionsService.updateAuction(auction.id, {
            status: StatusEnum.CLOSED,
        });

        if (auction.highestBid.amount === 0 || !auction.highestBid.bidder) {
            return sqs
                .sendSesMessage({
                    subject: 'Your item has not been sold',
                    recipient: auction.seller,
                    body: `Oh no! Your item "${auction.title}" did not get any bids.`,
                })
                .catch(console.error);
        }

        const notifySeller = sqs
            .sendSesMessage({
                subject: 'Your item has been bid on!',
                recipient: auction.seller,
                body: `Woohoo! Your item "${auction.title}" has been bid on!`,
            })
            .catch(console.error);

        const notifyBidder = sqs
            .sendSesMessage({
                subject: 'You won an auction!',
                recipient: auction.highestBid.bidder,
                body: `What a great deal! You got yourself a "${auction.title}"`,
            })
            .catch(console.error);

        return Promise.all([notifySeller, notifyBidder]);
    },

    processAuctions: async () => {
        const auctionsToClose = await AuctionsRepository.getEndedAuctions();
        const closePromises = auctionsToClose.map(AuctionsService.closeAuction);

        await Promise.all(closePromises);

        return { closed: closePromises.length };
    },

    placeBid: async (id: string, bidAmount: number, bidder: string) => {
        const auction = await AuctionsService.getAuction(id);

        if (auction.status === StatusEnum.CLOSED)
            throw new createError.Forbidden('Auction is already closed!');

        if (auction.seller === bidder)
            throw new createError.Forbidden(
                'You cannot bid on your own auctions!',
            );

        if (auction.highestBid.bidder === bidder)
            throw new createError.Forbidden(
                'You are already the highest bidder',
            );

        if (auction.highestBid.amount >= bidAmount)
            throw new createError.Forbidden(
                `Your bid must be higher than ${auction.highestBid.amount}!`,
            );

        return AuctionsService.updateAuction(id, {
            highestBid: {
                bidder,
                amount: bidAmount,
            },
        });
    },
};
