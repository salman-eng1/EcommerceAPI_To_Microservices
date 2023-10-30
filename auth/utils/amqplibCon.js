const amqplib = require("amqplib");

var channel, connection;
//initiate connection to rabbitMQ server
// create channel
exports.connect = async function (amqpURL, queueName) {
  connection = await amqplib.connect(amqpURL);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName);
  console.log("RabbitMQ connection established successfully")
};

exports.sendToQueue = async function (queue, message) {
  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

//must run once connection is ready
exports.consume = async function (queue,callback) {
   await channel.consume(queue, (message) => {
    if (message !== null) {
      const content = JSON.parse(message.content.toString());
      callback(content); // Pass the content to a callback function
      channel.ack(message); // Acknowledge the message when processed
      console.log("Received a message:", content);

    }
  });
    console.log("consumer is listening")
};

// invoke function in the controller
// (async()=>{
//   try{

//     RabbitMQCon.connect(amqpURL,'Order')
//     console.log("RabbitMQCon connection successfully established");

//   }catch(error){
//     console.log("error")
//   }
// })()
