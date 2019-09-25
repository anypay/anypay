// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create createTemplate params
var params = {
    "Template": {
        "TemplateName": "Anypay_paid",
        "SubjectPart": "You got paid! (No action required) Receipt : {{uid}}",
        "TextPart": "You made a customer happy. Here are the details of their payment: \n{{amount_paid}} {{currency}}\n{{denomination_amount_paid}} {{denomination}}\n{{paidAt}}",
        "HtmlPart": "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><title>Anypay Invoice Payment</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/><link rel=\"stylesheet\" type=\"text/css\"  href=\"//fonts.googleapis.com/css?family=Ubuntu\" /></head><body style=\"margin: 0; padding: 0;\"><table style=\"border: 1px solid #cccccc;\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\"><tr><td color=\"#ffffff\" align=\"center\" border-width=\"thin\" style=\"padding: 40px 0 30px 0;\">Anypay Payment Receipt</td></tr><tr><td bgcolor=\"#ffffff\" style=\"padding: 40px 30px 40px 30px;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td><br> You made a customer happy! Here are the details of their payment:<br><br></td></tr><tr></tr><tr><td><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td width=\"260\" valign=\"top\"> {{amount_paid}} {{currency}}</td><td style=\"font-size: 0; line-height: 0;\" width=\"20\"> &nbsp;</td></tr><tr><td width=\"260\" valign=\"top\"> {{denomination_amount_paid}} {{denomination}}</td></tr><tr><td width=\"260\" valign=\"top\"> {{paidAt}}</td></tr><tr> <a href=\"https://anypayapp.com/invoices/{{uid}}\">https://anypayapp.com/invoices/{{uid}}</a><tr></table></td></tr></table></td></tr><tr><td style=\"padding: 30px 30px 30px 30px;\"> Put this payment in context. Monitor how your business is doing with its bitcoin with charts, spreadsheets, and other tools at <a href=\"https://anypayapp.com/admin\">https://anypayapp.com/admin</a> <br><br> Sincerely, <br><br> Your friends at Anypay</td></tr></table></body></html>"
    }
} 
// Create the promise and SES service object
var templatePromise = new AWS.SES({apiVersion: '2010-12-01'}).createTemplate(params).promise();

// Handle promise's fulfilled/rejected states
templatePromise.then(
  function(data) {
    console.log(data);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
