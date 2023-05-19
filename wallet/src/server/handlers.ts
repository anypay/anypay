
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function load(dirname) {

  var handlers: any = {}

  var tsHandlers: any = require('require-all')({
    dirname,
    filter      :  /(.+)\.ts$/,
    map: function(name, path) {

      return name.split('_').map(p => {

        return capitalizeFirstLetter(p);

      })
      .join('');
    }
  });

  var jsHandlers: any = require('require-all')({
    dirname,
    map: function(name, path) {

      return name.split('_').map(p => {

        return capitalizeFirstLetter(p);

      })
      .join('');
    }
  });

  handlers = Object.assign(handlers, jsHandlers);

  handlers = Object.assign(handlers, tsHandlers);

  return handlers;
}

