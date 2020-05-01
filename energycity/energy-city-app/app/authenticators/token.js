import Base from 'ember-simple-auth/authenticators/base';
import Ember from 'ember';

export default Base.extend({
  restore(data) {
    return Ember.RSVP.Promise.resolve(data);
  },
  async authenticate(code, state) {
    //get signed webtoken using moneybutton oauth code and state
    Ember.Logger.log('authenticate', code);

    let resp = await $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/auth/moneybutton',
      data: { code, state }
    })

    console.log("RESP", resp);

    return Ember.RSVP.Promise.resolve({ token: resp.token });
  },
  invalidate() {
    return Ember.RSVP.Promise.resolve();
  }
});
