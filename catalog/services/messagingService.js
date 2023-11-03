const amqplib = require("amqplib");
const ProductService = require("../services/productService");

const productService = new ProductService();

var channel, connection;

exports.connect = async () => {
  connection = await amqplib.connect(process.env.amqpURL);
  channel = await connection.createChannel();
  console.log("MessagingService connection established successfully");
  return channel;
};

exports.declareExchange = async (exchangeName, exchangeType) => {
  await channel.assertExchange(exchangeName, exchangeType, {
    durable: true,
  });
  console.log("Exchange Router has been created successfully");
};

exports.createAndBindQueue = async (queueName, exchangeName, routingKey) => {
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchangeName, routingKey);
  console.log(`${queueName} queue asserted successfully`);
  console.log(`${queueName} queue has been bind successfully`);
};

exports.consumeMessages = async (queueName) => {
  await channel.consume(queueName, (msg) => {
    if (msg) {
      console.log(`Received: ${msg.content.toString()}`);
      // Acknowledge the message if it's processed successfully.
      channel.ack(msg);
      const message = JSON.parse(msg.content);
      productService.updateProduct(message.productId, {
        color: message.color,
        $inc: { quantity: -message.quantity },
      });
    }
  });
  console.log(`${queueName} queue consumer is listening`);
};

exports.publishMessage = async (exchangeName, routingKey, message) => {
  if (channel) {
    await channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );
  } else {
    // store the value in db table to be sent again later
  }
};
