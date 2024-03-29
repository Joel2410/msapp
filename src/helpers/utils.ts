import { ErrorInterface } from 'src/interfaces';
import { Request } from 'express';

export const getError = (error: any, customMessages: ErrorInterface[] = []) => {
  let customMessage = customMessages.find((cm) => cm.error == error.number);
  if (!customMessage) {
    customMessage = customMessages.find((cm) => cm.error == -999);
  }

  if (!customMessage) {
    customMessage = {
      error: error?.number,
      message: error?.originalError?.message,
    };
  }

  return customMessage;
};

export const getTenantId = (request: Request): string => {
  const { headers } = request;
  return headers?.host.split('.')[0];
};
