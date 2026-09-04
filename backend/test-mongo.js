const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://muhammadhammadjatoi65_db_user:Muhammad_523@cluster0.yuv13ts.mongodb.net/email-sender?appName=Cluster0';
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
