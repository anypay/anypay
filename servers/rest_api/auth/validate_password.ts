import { models } from '../../../lib';

const AccountLogin = require("../../../lib/account_login");

export async function validatePassword(request, username, password, h) {
  if (!username || !password) {
    return {
      isValid: false
    };
  }

  var accessToken = await AccountLogin.withEmailPassword(username, password);


  if (accessToken) {

    return {
      isValid: true,
      credentials: { accessToken }
    };

  } else {
    var account = await models.Account.findOne({
      where: {
        email: username
      }
    });

    if (!account) {

      return {
        isValid: false
      }
    }

    var accessToken = await models.AccessToken.findOne({
      where: {
        account_id: account.id,
        uid: password
      }
    })

    if (accessToken) {

      return {
        isValid: true,
        credentials: { accessToken }
      };

    } else {

      return {
        isValid: false
      }

    }

  }
};

