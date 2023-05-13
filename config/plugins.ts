
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

export default function() {

  let pluginDirectorPaths = getDirectories(join(__dirname, '../plugins'));

  return pluginDirectorPaths.reduce((map, path) => {

    let parts = path.split('/');

    let currency = parts[parts.length - 1];

    let plugin = require(`../plugins/${currency}`);

    map[currency.toUpperCase()] = plugin.default;

    return map;

  }, {});

}

