const amqplib = require("amqplib");
const CartController = require("../controllers/cartController");

class MessagingService {
  channel;
  connection;

  constructor(
    exchangeName,
    exchangeType,
    consumerRoutingKey,
    consumerQueueName
  ) {
    this.exchangeName = exchangeName;
    this.exchangeType = exchangeType;

    this.consumerRoutingKey = consumerRoutingKey;

    this.consumerQueueName = consumerQueueName;
  }

  //initiate connection to MessagingService server
  // create channel
  async connect(amqpURL) {
    if (!this.channel) {
      this.connection = await amqplib.connect(amqpURL);
      this.channel = await this.connection.createChannel();
    } else {
      console.log("channel exists");
    }
    await this.declareExchange(this.exchangeName, this.exchangeType);
    await this.createAndBindQueue(
      this.consumerQueueName,
      this.exchangeName,
      this.consumerRoutingKey
    );
    await this.consumeMessages(this.consumerQueueName);
    console.log("MessagingService connection established successfully");
  }

  async declareExchange(exchangeName, exchangeType) {
    await this.channel.assertExchange(exchangeName, exchangeType, {
      durable: true,
    });
    console.log("Exchange Router has been created successfully");
  }

  async publishMessage(channel, exchangeName, routingKey, message) {
    if (channel) {
      await channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message))
      );
    } else {
      console.log("fuck");
    }

    console.log("error from publish service");
  }

  async createAndBindQueue(queueName, exchangeName, routingKey) {
    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, exchangeName, routingKey);
    console.log(`${this.consumerQueueName} queue asserted successfully`);
  }

  async consumeMessages(queueName) {
    await this.channel.consume(queueName, (msg) => {
      if (msg) {
        console.log(`Received: ${msg.content.toString()}`);
        // Acknowledge the message if it's processed successfully.
        this.channel.ack(msg);
      }
    });
    console.log(`${this.consumerQueueName} queue consumer is listening`);
  }
}

// exports.sendToQueue = async function (queue, message) {
//     await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
//   };

//   //must run once connection is ready
//   exports.consume = async function (queue,callback) {
//      await channel.consume(queue, (message) => {
//       if (message !== null) {
//         const content = JSON.parse(message.content.toString());
//         callback(content); // Pass the content to a callback function
//         channel.ack(message); // Acknowledge the message when processed
//         console.log("Received a message:", content);

//       }
//     });
//       console.log("consumer is listening")
//   };

// invoke function in the controller
// (async()=>{
//   try{

//     MessagingServiceCon.connect(amqpURL,'Order')
//     console.log("MessagingServiceCon connection successfully established");

//   }catch(error){
//     console.log("error")
//   }
// })()

module.exports = MessagingService;
