
export const list: string[][] = [
  ['bitcoin', 'BTC'],
  ['dash', 'DASH'],
  ['bitcoincash', 'BCH'],
  ['bitcoinsv','BSV']
]

const names = list.reduce((map: {
  [key: string]: string

}, pair: string[]) => {

  map[pair[0]] = pair[1]

  return map
},{})

const codes = list.reduce((map: {
  [key: string]: string
}, pair: string[]) => {
  map[pair[1]] = pair[2]

  return map
},{})

export function codeFromName(name: string) {
  return names[name]
}

export function nameFromCode(code: string) {
  return codes[code]
}

