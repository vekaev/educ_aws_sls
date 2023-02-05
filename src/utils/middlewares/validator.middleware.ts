import { ValidatorOptions } from '@/types';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

export const validatorMiddleware = (
    eventSchema: object,
    options: ValidatorOptions = {},
) => validator({ eventSchema: transpileSchema(eventSchema), ...options });
