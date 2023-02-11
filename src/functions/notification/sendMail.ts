import { middify } from '@/utils/middlewares';

import { NotificationService } from '@/modules/notification';

export const handler = middify(NotificationService.sendEmail);
