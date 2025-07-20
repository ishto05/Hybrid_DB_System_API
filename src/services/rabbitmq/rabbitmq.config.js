import amqplib from "amqplib";
import {
  RABBITMQ_URL,
  RABBITMQ_EXCHANGE,
  RABBITMQ_EXCHANGE_TYPE,
} from "../../config/env.js";

let channel;

export const connectRabbitMq = async () => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // creating Direct Exchange
    await channel.assertExchange(RABBITMQ_EXCHANGE, RABBITMQ_EXCHANGE_TYPE, {
      durable: true,
    });

    console.log("✅ RabbitMQ connected & exchange asserted");

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
    throw error;
  }
};

export const getRabbitMqChannel = () => {
  if (!channel) throw new Error("Channel not initialized");
  return channel;
};
