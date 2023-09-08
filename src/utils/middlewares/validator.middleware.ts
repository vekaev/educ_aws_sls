import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

export const validatorMiddleware = (
    eventSchema: object,
    options: Parameters<typeof validator>[0] = {},
) =>
    validator({
        eventSchema: transpileSchema(eventSchema),
        ...options,
    });
