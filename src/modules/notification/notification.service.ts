import { ses } from '@/libs/ses';

export const NotificationService = {
    sendEmail: async () => {
        await ses.sendEmail({
            subject: 'Test',
            text: 'Hello world!',
            to: ['vekaevdev@gmail.com'],
            from: 'vekaevdev@gmail.com',
        });
    },
};
