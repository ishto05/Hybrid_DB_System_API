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
    console.log("--------------------------------------------------\n");
    console.log("✅ RabbitMQ connected & exchange asserted");
    console.log("--------------------------------------------------\n");

    return channel;
  } catch (error) {
    console.log("--------------------------------------------------\n");
    console.error("❌ RabbitMQ connection error:", error);
    console.log("--------------------------------------------------\n");
    throw error;
  }
};

export const getChannel = () => {
  console.log("--------------------------------------------------\n");
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not initialized. Call connectRabbitMQ() first."
    );
  }
  console.log("--------------------------------------------------\n");

  return channel;
};
