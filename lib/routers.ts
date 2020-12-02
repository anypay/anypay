import { join } from 'path';

var routers: any = require('require-all')({
  dirname: join(__dirname, '../routers'),
  filter      :  /(.+)\.ts$/,
  map: function(name, path) {
    return name;
  }
});

export { routers }
