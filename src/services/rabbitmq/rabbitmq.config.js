import amqplib from "amqplib";
import { RABBITMQ_URL, RABBITMQ_EXCHANGE } from "../../config/env.js";

let channel;

export const connectRabbitMq = async () => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // creating Direct exchange
    await channel.assertExchange(RABBITMQ_EXCHANGE, "direct", {
      durable: true,
    });
    console.log("✅ RabbitMQ connected & exchange asserted");

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
    throw error;
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not initialized. Call connectRabbitMQ() first."
    );
  }

  return channel;
};
