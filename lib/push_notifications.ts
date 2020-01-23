
import { models } from './models';

var FCM = require('fcm-node');

export function sendMessage(email, title, body) {

  return new Promise(async (resolve, reject) => {

    let account = await models.Account.findOne({ where: { email }});

    if (!account) { throw new Error('account not found') }

    let firebaseToken = await models.FirebaseToken.findOne({ where: {

      account_id: account.id

    }});
    var serverKey = process.env.FIREBASE_SERVER_KEY; //put your server key here
    var fcm = new FCM(serverKey);

    if (!firebaseToken) { return reject(new Error('no firebase token found')) }

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
          reject(err);
        } else {
          resolve(response);
        }
    });

  });

}
