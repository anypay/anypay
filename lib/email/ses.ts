
const aws = require('aws-sdk');

const ses = new aws.SES({ region: 'us-east-1' });

export { ses }

