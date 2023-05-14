
import axios from 'axios'

export async function getTransaction(txid: string) {

  const { data } = await axios.post(`https://api.trongrid.io/wallet/gettransactioninfobyid`, {

    value: txid 

  })

  return data

}

export async function getBlock(height: number) {

  const { data } = await axios.post(`https://api.trongrid.io/wallet/getblockbynum`, {

    num: height 

  })

  return data

}

export async function getLatestBlock() {

  const { data } = await axios.post(`https://api.trongrid.io/wallet/getnowblock`)

  return data

}
