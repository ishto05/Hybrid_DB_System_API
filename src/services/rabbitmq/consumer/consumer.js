import { RABBITMQ_EXCHANGE } from "../../../config/env.js";
import { ROUTING_KEYS } from "../../../config/rabbitmq_keys/rabbitmq.keys.js";
import { connectRabbitMq } from "../rabbitmq.config.js";
import { consumeMongoQueue } from "./mongo.consumer.js";
import { consumeSqlQueue } from "./sql.consumer.js";

export const initConsumers = async () => {
  try {
    const channel = await connectRabbitMq();

    const keyBindings = [
      { key: ROUTING_KEYS.SQL_SAVE, consumer: consumeSqlQueue },
      { key: ROUTING_KEYS.MONGO_SAVE, consumer: consumeMongoQueue },
    ];

    for (const { key, consumer } of keyBindings) {
      await channel.assertQueue(key, { durable: true });

      channel.bindQueue(key, RABBITMQ_EXCHANGE, key);

      consumer(channel, key);
      console.log(`🔁 Consumer bound to ${key}`);
    }
  } catch (error) {
    console.error("❌ Consumer Init Error:", error);
  }
};
