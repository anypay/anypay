curl https://connect.squareup.com/v2/catalog/object \
  -X POST \
  -H 'Square-Version: 2019-12-17' \
  -H 'Authorization: Bearer EAAAEJHJdmRauI4o3--oWWZ_O1k161Pl6X7t4Vm1n0kNXN052sqFs2uVjSsES2lZ' \
  -d '{
    "idempotency_key": "af3d1afc-7212-4300",
    "object": {
      "type": "ITEM",
      "id": "#Cocoa",
      "item_data": {
        "name": "Cocoa",
        "description": "Hot chocolate",
        "abbreviation": "Ch"
      }
    }
  }' \
  -v
