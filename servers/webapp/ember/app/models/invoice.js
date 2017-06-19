import DS from 'ember-data';

export default DS.Model.extend({
  uid: DS.attr('string'),
  amount: DS.attr('number'),
  address: DS.attr('string')
});
