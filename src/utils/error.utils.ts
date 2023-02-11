export const isErrorWithMessage = (
    error: unknown,
): error is { message: string } => {
    return (
        typeof error === 'object' &&
        error != null &&
        (('message' in error && typeof error.message === 'string') ||
            ('errorMessage' in error && typeof error.errorMessage === 'string'))
    );
};

export const getErrorMessage = (
    error: unknown,
    defaultMessage = 'Something went wrong',
): string => {
    if (isErrorWithMessage(error)) {
        return error.message;
    }

    return defaultMessage;
};
