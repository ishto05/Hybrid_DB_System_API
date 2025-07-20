import { RABBITMQ_EXCHANGE } from "../../../config/env.js";
import { getRabbitMqChannel } from "../rabbitmq.config.js";

export const publishToQueue = async (routingKey, payload) => {
  try {

    const channel = getRabbitMqChannel();
    if (!channel) throw new Error("RabbitMQ channel not initialized");

    const bufferData = Buffer.from(JSON.stringify(payload));

    const isPublished = channel.publish(
      RABBITMQ_EXCHANGE,
      routingKey,
      bufferData,
      {
        persistant: true,
      }
    );

    if (isPublished) {
      console.log(`✅ Published to [${routingKey}] with payload:`, payload);
    } else {
      console.warn(`⚠️ Failed to publish message to [${routingKey}]`);
    }
  } catch (error) {
    console.error("❌ Failed to publish message:", error);
  }
};
