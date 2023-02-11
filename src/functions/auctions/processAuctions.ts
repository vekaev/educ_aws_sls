import { AuctionsService } from '@/modules/auctions';

export const handler = () => AuctionsService.processAuctions();
