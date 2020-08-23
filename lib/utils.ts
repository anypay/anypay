
export function toKeyValueString(json: any) {

  let entries = Object.entries(json)

  return entries.reduce((str, entry) => {

    return `${str}${entry[0]}=${entry[1]} `

  }, '')

}


