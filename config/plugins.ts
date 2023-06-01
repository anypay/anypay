
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

import { Plugin } from '../lib/plugin'

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

var loaded = false
var loading = false

export interface Plugins {
  [name: string]: Plugin
}

export const plugins: Plugins = {}

export default async function(): Promise<Plugins> {

  if (loaded || loading) { return plugins }

  loading = true

  let pluginDirectoryPaths = getDirectories(join(__dirname, '../plugins'));

  for (let path of pluginDirectoryPaths) {

    try {

      let parts = path.split('/');

      let name = parts[parts.length - 1];

      const PluginClass = (await import(`../plugins/${name}`)).default

      if (typeof PluginClass === 'function') {

        plugins[name.toUpperCase()] = new PluginClass();

      }

    } catch(error) {

      console.error('failed to load plugin', error)

    }
  }

  loaded = true
  loading = false

  return plugins

}

