var admin = require("firebase-admin");

var serviceAccount = require("./");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://music-9ae9f-default-rtdb.asia-southeast1.firebasedatabase.app"
});
