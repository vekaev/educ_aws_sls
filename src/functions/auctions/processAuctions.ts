import { AuctionsService } from '@/modules/auctions';
import { middify } from '@/utils/middlewares';

export const handler = middify(() => AuctionsService.processAuctions());
