import * as assert from 'assert';

import { emitter } from '../../lib/events';

describe("emitting an event", () => {

  it("emit should bind to all events", done => {

    emitter.on('*', function(msg) {

      assert.strictEqual(this.event, 'hello');
      assert.strictEqual(msg.data, 'world');

      setTimeout(function() {

        done();

      }, 1000);

    });

    setTimeout(function() {

      emitter.emit("hello", {data: 'world'});

    }, 2000);

  });


});

