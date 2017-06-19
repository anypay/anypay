import Ember from 'ember';

function subscribe(invoice) {

  console.log("subscribe", invoice.uid);
  var socket = io('http://149.56.89.142:3000');
  socket.on('invoice:paid', function (data) {
    console.log('invoice:paid', data);
    window.location = `/paid/${invoice.amount}`
  });
  socket.emit('subscribe', {invoice: invoice.uid});
}

function showQR(address, amount) {

  var qrcode = new QRCode("qrcode", {                                      
      text: `dash:${address}?amount=${parseFloat(amount).toFixed(5)}`,    
      width: 256,                                                          
      height: 256,                                                         
      colorDark : "#000000",                                               
      colorLight : "#ffffff",                                              
      correctLevel : QRCode.CorrectLevel.H                                 
  }); 
}

export default Ember.Route.extend({

  setupController: function(p) {
    subscribe(this.currentModel, this);
    Ember.run.scheduleOnce('afterRender', this, function() {
      showQR(this.currentModel.address, this.currentModel.amount);
    });
    this.set('address', this.currentModel.address);
    this.set('amount', this.currentModel.amount);
  }
});

