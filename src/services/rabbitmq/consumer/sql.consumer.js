import record from "../../../models/sql/sql.record.js";

export const consumeSqlQueue = (channel, queue) => {
  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());

      const { userId, data } = payload;
      if (!userId || !data) throw new Error("Invalid payload");

      // Save to SQL
      await record.create({ ...data, userId });

      console.log("✅ SQL record saved:", data.title);
      channel.ack(msg);
    } catch (err) {
      console.error("❌ SQL Consumer Error:", err);
      channel.nack(msg, false, false); // discards message
    }
  });
};
