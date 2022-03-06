const socket = require("socket.io-client")(
  "http://blockcypher.anypayinc.com:3000"
);
const uuid = require("uuid");

socket.on("connect", () => {
  socket.emit("subscribe", { invoice: uuid.v4() });

  socket.on("invoice:paid", data => {
    console.log("invoice:paid", data);
  });
});
