
import * as Joi from 'joi'

import { settings } from '../../../lib';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';
import { ResponseToolkit } from '@hapi/hapi';

export async function update(request: AuthenticatedRequest, h: ResponseToolkit) {

  const {denomination: currency} = request.payload as {
    denomination: string
  }

  const accessToken: any = request.auth.credentials.accessToken;

  let accountId = accessToken.account_id;

  let denomination = await settings.setDenomination(accountId, currency.toUpperCase());

  return {
    success: true,
    denomination
  }

};

export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  const accessToken: any = request.auth.credentials.accessToken;

  let accountId = accessToken.account_id;
  
  let denomination = await settings.getDenomination(accountId);

  return {
    success: true,
    denomination
  }

};

export const DenominationUpdate = Joi.object({
  denomination: Joi.string()
}).label('DenominationUpdate');

