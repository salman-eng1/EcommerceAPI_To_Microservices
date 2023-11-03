const amqplib = require("amqplib");

class RabbitMQHandler {
  channel;
  constructor(amqpURL, exchangeName) {
    this.amqpURL = amqpURL;
    this.exchangeName = exchangeName;
  }

  //initiate connection to rabbitMQ server
  // create channel
  async setup() {
    this.connection = await amqplib.connect(this.amqpURL);
    this.channel = await this.connection.createChannel();
  }
  
  //assert queue 
async assertQueue(queueName){
  if (!this.channel) 
    this.createChannel();{
  await this.channel.assertQueue(queueName);
    }

}
  //publish message to exchange
  //the condition force using the existing channel instead of creating channel for each message
  async publishMessage(routingKey, message) {
    if (!this.channel) {
      this.createChannel();
    }

    //initiate exchange
    await this.channel.assertExchange(this.exchangeName, "direct");

    //publish message to specific exchange
    //routingKey will be used to route the message to specific queue
    const messageData = {
      logType: routingKey,
      message: message,
      dateTime: Date.now(),
    };
    await this.channel.publish(
      this.exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(messageData))
    );

    console.log(
      `the message ${message} is sent to exchange ${this.exchangeName}`
    );
  }



  async sendToQueue(queue,message) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
  
}
module.exports = RabbitMQHandler;

// await this.channel.assertQueue(this.queue);
// this.channel.consume(this.queue, (msg) => {
//   if (msg !== null) {
//     console.log('Received:', msg.content.toString());
//     this.channel.ack(msg);
//   } else {
//     console.log('Consumer cancelled by server');
//   }
// });
//}

