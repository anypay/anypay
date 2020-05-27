import Component from '@ember/component';

export default Component.extend({

  didInsertElement() {
    this._super(...arguments);
    
    const div = document.getElementById('my-money-button')

    window.moneyButton.render(div, {
      outputs: [{
        to: 'steven@simply.cash',
        amount: 0.1,
        currency: 'BSV'
      }, {
        to: 'steven@simply.cash',
        amount: 0.0001,
        currency: 'BSV'
      }]
    });

  }
  
});
