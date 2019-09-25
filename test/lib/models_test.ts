
import * as assert from 'assert';

import { models } from '../../lib';

describe("Models directory", () => {

  it('should load all models from the directory', () => {

    Object.values(models).forEach((model: any) => {

      assert(typeof model.create === 'function');

    });

  });

});
