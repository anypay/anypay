import {validateAddress} from '../index';

describe("Validating addresses", () => {

  it ("should return true for valid address", async () => {

    let address = 'qzlsfelte09gf5n6z93rt2zly6k7ehrdectwpvnakg';

    let valid = validateAddress(address);

    console.log(valid);

  });



  it ("should return true for valid address", async () => {

    let address = 'bitcoincash:qpt73n6zffas9q7q6z9cc8esx9v0rkky2vvcgf9f73';

    let valid = validateAddress(address);

    console.log(valid);

  });

});
