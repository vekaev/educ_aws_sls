import { SQSEvent } from 'aws-lambda';

import {
    SendSimpleEmailDto,
    NotificationService,
} from '@/modules/notification';

export const handler = (event: SQSEvent) => {
    const email = JSON.parse(event.Records[0].body) as SendSimpleEmailDto;

    if (!email) throw new Error('Email is not provided!');

    return NotificationService.sendSimpleEmail(email);
};
