require('dotenv').config();

import * as http from 'superagent';

let TonicPow = require('tonicpow-js')


import { models } from './models';

const URL = 'https://api.tonicpow.com/';

interface CreateCampaign {
  currency: string;
  description: string;
  image_url: string;
  target_url: string;
  title: string;
  pay_per_click_rate: number;
}

interface Campaign {
  advertiser_profile: any;
  advertiser_profile_id: number;
  balance: number;
  balance_satoshis: number;
  clicks: number;
  created_at: string;
  currency: string;
  description: string;
  funding_address: string;
  goals: any[];
  id: number;
  image_url: string;
  links_created: number;
  pay_per_click_rate: number;
  public_guid: string;
  target_url: string;
  match_domain: boolean;
  title: string;
  slug: string;
  expires_at: string;
}

export async function getCampaign(account): Promise<Campaign> {

  let response = await TonicPow.init(process.env.TONIC_POW_API_SECRET)

  let accountCampaign = await models.TonicPowCampaign.findOne({ where: {
    account_id: account.id
  }});

  let campaign: Campaign = await TonicPow.getCampaign(accountCampaign.campaign_id);

  return campaign;

}

export async function setCampaign(account, options = {}): Promise<Campaign> {

  console.log(TonicPow);
  console.log(TonicPow.init);

  let record = await models.TonicPowCampaign.findOne({ where: {
    account_id: account.id
  }});

  if (record) {
    return record;
  }

  try {

    let response = await TonicPow.init(process.env.TONIC_POW_API_SECRET)

    console.log('resp', response);

  } catch(error) {

    console.error('error', error);
  }

  console.log('set campaign');

  /*
  let accountCampaign = await models.TonicPowCampaign.findOne({ where: {
    account_id: account.id
  }});
  */

  let params: CreateCampaign = Object.assign({
    advertiser_profile_id: 232,
    currency: 'USD',
    description: account.description,
    image_url: account.image_url,
    target_url: account.website_url,
    title: account.business_name,
    pay_per_click_rate: 0.01
  }, options);

  let campaign: Campaign = await TonicPow.createCampaign(params);

  console.log('campaign', campaign);

  record = await models.TonicPowCampaign.create({
    account_id: account.id,
    campaign_id: campaign.id,
    data: campaign
  });

  return record;

}

