import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

import { ValidatorOptions } from '@/types';

export const validatorMiddleware = (
    eventSchema: object,
    options: ValidatorOptions = {},
) =>
    validator({
        eventSchema: transpileSchema(eventSchema) as typeof Function,
        ...options,
    });
