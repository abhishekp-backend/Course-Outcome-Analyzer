const { MongoClient } = require("mongodb");

async function initReplicaSet() {
  const client = new MongoClient(
    "mongodb://127.0.0.1:27017",
    {
      directConnection: true,
      serverSelectionTimeoutMS: 5000,
    }
  );

  try {
    await client.connect();
    console.log("Connected");

    const adminDb = client.db("admin");

    const result = await adminDb.command({
      replSetInitiate: {
        _id: "rs0",
        members: [
          {
            _id: 0,
            host: "127.0.0.1:27017",
          },
        ],
      },
    });

    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

initReplicaSet();