const API_URL = "https://api.dash.anypay.global";

function subscribe(invoiceId) {
  console.log("subscribe", invoiceId);
  var socket = io('http://149.56.89.142:3000');
  socket.on('invoice:paid', function (data) {
    console.log('invoice:paid', data);
    showPaid();
  });

  socket.emit('subscribe', {invoice: invoiceId});
}

function showPaid() {
  $("#qrcode").hide();
  $("#payment-form").hide();
  $("#paid").show();
}

$(function() {

  $("form").on("submit", function(event) {
    event.preventDefault();
    console.log("form submitted");

    let amount = parseFloat($("input#amount").val());
    console.log('amount', amount);

    if (amount > 0) {
      axios.post(`${API_URL}/invoices`, {
        amount: amount
      })
      .then(function(result) {
        $("#payment-form").hide();
        subscribe(result.data.uid);
        console.log(result.data);

        let link = `dash:${result.data.address}?amount=${result.data.amount}`

        $("#address").html(`<a href="${link}">${link}</a>`);

        var qrcode = new QRCode("qrcode", {
            text: `dash:${result.data.address}?amount=${result.data.amount}`,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
      });
    }
  });
});
