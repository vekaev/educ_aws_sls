import { SQSEvent } from 'aws-lambda';

import { NotificationService, SendEmailDto } from '@/modules/notification';

export const handler = (event: SQSEvent) => {
    const email = JSON.parse(event.Records[0].body) as SendEmailDto;

    return NotificationService.sendEmail(email);
};
