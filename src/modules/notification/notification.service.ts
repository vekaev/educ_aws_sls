import createError from 'http-errors';

import { ses } from '@/libs/ses';
import { getErrorMessage } from '@/utils/error.utils';

import { SendEmailDto } from './notification.dto';
import { responseFactory } from '@/utils/common.helpers';

export const NotificationService = {
    sendEmail: async ({ subject, body, recipient }: SendEmailDto) => {
        try {
            const result = await ses.sendEmail({
                subject,
                text: body,
                to: [recipient],
                from: 'vekaevdev@gmail.com',
            });

            return responseFactory(result);
        } catch (error) {
            throw new createError.BadRequest(
                getErrorMessage(
                    (error as { Error: Error }).Error,
                    'Error sending email',
                ),
            );
        }
    },
};
