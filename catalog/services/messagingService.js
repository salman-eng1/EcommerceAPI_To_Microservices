const amqplib = require("amqplib");
const ProductService = require("./productService");
var channel, connection;

const productService = new ProductService();

exports.connect = async () => {                
  connection = await amqplib.connect(`amqp://${process.env.RabbitMQ_USER}:${process.env.RabbitMQ_PASSWORD}@${process.env.RabbitMQ_HOST}:${process.env.RabbitMQ_PORT}`);
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

      if (message.soldQty) {
        const products = message.productId;
        const sold = message.soldQty;
        products.forEach((item, index) => {
          const product = productService.updateProduct(item, {
            $inc: { sold: +sold[index] },
          });
        });
      } else if (message.ratingsAverage) {
        const { productId, ratingsAverage, ratingsQuantity } = message;
        productService.updateProduct(productId, {
          ratingsAverage: ratingsAverage,
          ratingsQuantity: ratingsQuantity,
        });
      } else {
        const product = productService.updateProduct(
          message.productId,
          {
            color: message.color,
            $inc: { quantity: -message.quantity },
          },
          { new: true }
        );
      }
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
//
