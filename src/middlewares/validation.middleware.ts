import { HttpException } from '@/exceptions/http-exception'
import { plainToInstance } from 'class-transformer'
import { type ValidationError, validateOrReject } from 'class-validator'
import type { NextFunction, Request, Response } from 'express'

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
    type: any,
    field?: 'body' | 'query' | 'params',
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToInstance(type, req[field || 'body'])
        validateOrReject(dto, {
            skipMissingProperties,
            whitelist,
            forbidNonWhitelisted,
        })
            .then(() => {
                req[field || 'body'] = dto
                next()
            })
            .catch((errors: ValidationError[]) => {
                const message = errors
                    .map((error: ValidationError) =>
                        Object.values(error.constraints),
                    )
                    .join(', ')
                next(new HttpException(400, message))
            })
    }
}
