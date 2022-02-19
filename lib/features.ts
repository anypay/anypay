
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

const defaults = {
  'protocols.bip70': false,
  'protocols.bip270': true,
  'protocols.jsonv2': true
}

interface FeatureMap {
    [key: string]: boolean;
}


function formatFeatures(json: any): FeatureMap {

  return {}

}

function loadFeatures(json: any): FeatureMap {

  let configPath = join(__dirname, '../config/features.json')

  if (existsSync(configPath)) {

    let file = readFileSync(configPath)

    let config = JSON.parse(file.toString())[process.env.NODE_ENV]

    return Object.assign(defaults, config)

  } else {

    return defaults

  }

}

const features = loadFeatures(defaults)

export class InvalidFeature implements Error {

  constructor(name: string) {
    this.message = `feature ${name} is not valid`
  }

  name = "InvalidFeature"
  message = "feature is not valid" 
}

export function isEnabled(featureName: string): boolean {
  
  let environmentVariable = process.env[`FEATURES_${featureName.replace('.', '_').toUpperCase()}`]

  if (environmentVariable !== undefined) {

    switch(environmentVariable) {
      case "false":
          return false;
      case "true":
          return true;
      case "0":
          return false;
      case "1":
          return true;
      default:
        return !!environmentVariable
    }
  }


  try {
    
    let exists = features[featureName]

    if (typeof exists === 'undefined') {

      throw new InvalidFeature(featureName)

    }

    return !!exists;

  } catch(error) {

    throw new InvalidFeature(featureName)

  }
}

const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

