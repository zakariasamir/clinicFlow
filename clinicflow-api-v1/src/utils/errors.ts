export const notFound = (message = "Resource not found") => {
  const err = new Error(message) as any;
  err.status = 404;
  return err;
};

export const incorrectCredentials = (
  message = "The provided auth credentials are incorrect."
) => {
  const err = new Error(message) as any;
  err.status = 400;
  return err;
};

export const unAuthenticatedUser = (
  message = "You need to be authenticated to perform this request."
) => {
  const err = new Error(message) as any;
  err.status = 401;
  return err;
};

export const invalidAuthTokenProvided = (
  message = "An invalid token was provided in the request header."
) => {
  const err = new Error(message) as any;
  err.status = 401;
  return err;
};

export const noAccountAssociatedWithAuthToken = (
  message = "No valid account was found with the request token."
) => {
  const err = new Error(message) as any;
  err.status = 401;
  return err;
};

export const forbidden = (
  message = "You do not have permission to perform this action."
) => {
  const err = new Error(message) as any;
  err.status = 403;
  return err;
};

export const conflict = (message = "Resource conflict detected.") => {
  const err = new Error(message) as any;
  err.status = 409;
  return err;
};

export const badRequest = (message = "Bad request", details?: any) => {
  const err = new Error(message) as any;
  err.status = 400;
  if (details) err.details = details;
  return err;
};

export const entityDoesntExist = (entityName = "Entity") => {
  const err = new Error(`${entityName} doesn't exist`) as any;
  err.status = 404;
  return err;
};

export const uniqueEntity = (fields: string[] | string) => {
  const f = Array.isArray(fields) ? fields.join(", ") : fields;
  const err = new Error(`A record with this ${f} already exists.`) as any;
  err.status = 409;
  return err;
};

export const emailExist = (email: string) => {
  const err = new Error(`The email '${email}' is already in use.`) as any;
  err.status = 409;
  return err;
};

export default {
  notFound,
  incorrectCredentials,
  unAuthenticatedUser,
  invalidAuthTokenProvided,
  noAccountAssociatedWithAuthToken,
  forbidden,
  conflict,
  badRequest,
  entityDoesntExist,
  uniqueEntity,
  emailExist,
};
