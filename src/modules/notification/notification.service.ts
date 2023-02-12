import createError from 'http-errors';

import { ses } from '@/libs/ses';

import { getErrorMessage } from '@/utils/error.utils';
import { responseFactory } from '@/utils/common.helpers';

import { SendSimpleEmailDto } from './notification.dto';

export const NotificationService = {
    sendSimpleEmail: async ({
        subject,
        body,
        recipient,
        from = process.env.SES_FROM_EMAIL!,
    }: SendSimpleEmailDto) => {
        try {
            const result = await ses.sendSimpleEmail({
                subject,
                text: body,
                to: [recipient],
                from,
            });

            return responseFactory(result);
        } catch (error) {
            throw new createError.BadRequest(
                getErrorMessage(error, 'Error sending email'),
            );
        }
    },
};
