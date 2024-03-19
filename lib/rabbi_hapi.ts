
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function requireHandlersDirectory(dirname: string) {

  var handlers: any = require('require-all')({
    dirname,
    filter      :  /(.+)\.ts$/,
    map: function(name: string, path: any) {

      return name.split('_').map((p: any) => {

        return capitalizeFirstLetter(p);

      })
      .join('');
    }
  });

  return handlers;
}

