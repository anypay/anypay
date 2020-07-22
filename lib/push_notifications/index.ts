
import { models } from '../models';

var FCM = require('fcm-node');

export function sendMessage(email, title, body) {


  let account = await models.Account.findOne({ where: { email }});

  if (!account) { throw new Error('account not found') }

  let firebaseTokens = await models.FirebaseToken.findAll({ where: {

    account_id: account.id

  }});
  var serverKey = process.env.FIREBASE_SERVER_KEY; //put your server key here
  var fcm = new FCM(serverKey);

  if (firebaseTokens.length == 0) { return reject(new Error('no firebase token found')) }

  var promises = firebaseTokens.map(firebaseToken => {
    return new Promise(async (resolve, reject) => {
      var message = {
          to: firebaseToken.token,
          collapse_key: 'your_collapse_key',

          notification: {
              title,
              body
          }
      };

      fcm.send(message, function(err, response){
          if (err) {
            return reject(err);
          } else {
            resolve(response);
          }
      });
    });

  });
  return Promise.all(promises)

}
