
import { models } from '../models';

var FCM = require('fcm-node');

interface FirebaseOptions {
  path?: string;
}

export async function sendMessage(email, title, body, options: FirebaseOptions = {}) {

  let account = await models.Account.findOne({ where: { email }});

  if (!account) { throw new Error('account not found') }

  let firebaseTokens = await models.FirebaseToken.findAll({ where: {

    account_id: account.id

  }});
  var serverKey = process.env.FIREBASE_SERVER_KEY; //put your server key here
  var fcm = new FCM(serverKey);

  if (firebaseTokens.length == 0) { throw new Error('no firebase token found') }

  var promises = firebaseTokens.map(firebaseToken => {
    return new Promise(async (resolve, reject) => {

      console.log('token', firebaseToken.toJSON());

      var message = {
          to: firebaseToken.token,
          collapse_key: 'your_collapse_key',

          data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            path: options.path,
          },

          notification: {
              title,
              body
          }
      };

      fcm.send(message, function(err, response){
          if (err) {
            console.error(err);
            //return reject(err);
            resolve();
          } else {
            resolve(response);
          }
      });
    });

  });
  return Promise.all(promises)

}
