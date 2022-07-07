curl -X POST -u monero-rpc:55b808ae3a0ce09d93621f87f0215087 \
  https://xmr.nodes.anypayx.com/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"check_tx_key","params":{"txid":"a67c74db171c42ef9b3beb0ce7f2455fcf88711bd895a61f7066a5773ea04921","tx_key":"ea2994f9a9e83b4dc2fa98d5258b8aa1a3216a750578d4f2870df5940f12a80b","address":"463jsVqBMm36nf4EM8QEZnPBSFVAoNP1ydfJGbkePR5q53CU3UDjGBGfHDDT2dNowZh1PeqYZbFvjMr1hac2kpaoKGcF2fk"}}'
