const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

module.exports = {
  admin: admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://walnut-1500128476052.firebaseio.com'
  })
};
