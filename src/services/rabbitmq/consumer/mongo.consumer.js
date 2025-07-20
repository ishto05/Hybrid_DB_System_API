import BlobSchema from "../../../models/mongo/mongo.record.js";

export const consumeMongoQueue = (channel, queue) => {
  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());

      const { userId, data } = payload;
      if (!userId || !data) throw new Error("Invalid payload");

      // Save to MongoDB
      await BlobSchema.create({ payload: data, userId });

      console.log("✅ Mongo blob saved");
      channel.ack(msg);
    } catch (err) {
      console.error("❌ Mongo Consumer Error:", err);
      channel.nack(msg, false, false); // discard
    }
  });
};
