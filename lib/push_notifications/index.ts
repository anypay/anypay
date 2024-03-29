
import { config } from '../config';
import prisma from '../prisma';

var FCM = require('fcm-node');

interface FirebaseOptions {
  path?: string;
}

export async function sendMessage(email: string, title: string, body: string, options: FirebaseOptions = {}) {

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      email
    }
  })

  const firebaseTokens = await prisma.firebase_tokens.findMany({
    where: {
      account_id: account.id
    }
  })

  var serverKey = config.get('FIREBASE_SERVER_KEY'); //put your server key here
  var fcm = new FCM(serverKey);

  if (firebaseTokens.length == 0) { throw new Error('no firebase token found') }

  var promises: any[] = firebaseTokens.map(firebaseToken => {
    return new Promise(async (resolve, reject) => {

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

      fcm.send(message, function(err: Error | undefined, response: any){
          if (err) {
            //return reject(err);
            resolve(null);
          } else {
            resolve(response);
          }
      });
    });

  });
  return Promise.all(promises)

}
