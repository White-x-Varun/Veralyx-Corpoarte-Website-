<<<<<<< HEAD
import ApiError from '../utils/ApiError.js';

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }
    req[source] = result.data;
    return next();
  };
}

export default validate;
=======
import ApiError from '../utils/ApiError.js';

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }
    req[source] = result.data;
    return next();
  };
}

export default validate;
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
