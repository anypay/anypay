
import listBalances from './handlers/inventory_balances'

export { listBalances }


export function load(dirname) {

    var handlers: any = {}

    var tsHandlers: any = require('require-all')({
        dirname,
        filter      :  /(.+)\.ts$/,
        map: function(name, path) {

        return name.split('.').join('.');
        }
    });

    var jsHandlers: any = require('require-all')({
        dirname,
        map: function(name, path) {

        return name.split('.').join('.');

        }
    });

    handlers = Object.assign(handlers, jsHandlers);

    handlers = Object.assign(handlers, tsHandlers);

    return handlers;
}
