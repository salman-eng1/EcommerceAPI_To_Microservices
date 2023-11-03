// const { Connection, Consumer } = require("rabbitmq-client");

class RabbitConnections {
  constructor(amqpURL) {
    this.amqpURL = amqpURL;
    this.RabbitConnection = null; // Initialize to null
    this.publisher = this.setupPublisher;
    this.subscribe = this.setupConsumer;
    this.initializeRabbitConnection();
  }

  async initializeRabbitConnection() {
    this.RabbitConnection = new Connection(this.amqpURL);

    this.RabbitConnection.on("error", (err) => {
      console.log("RabbitMQ connection error", err);
    });

    this.RabbitConnection.on("connection", () => {
      console.log("Connection successfully (re)established");
    });


    await this.RabbitConnection.queueDeclare({
      queue: "test",
      // exclusive: true,
    });

    await this.RabbitConnection.exchangeDeclare({
      queue: "test",
      exchange: "createCategory",
      type: "direct",
    });

    await this.RabbitConnection.queueBind({
      queue: "test",
      exchange: "createCategory",
    });

 
  }

   setupConsumer(queueName, eventName, type, routingKey) {
    
    const subscribe =  this.RabbitConnection.createConsumer(
      {
        
        queue: `${queueName}`,
        queueOptions: { durable: false },
        qos: { prefetchCount: 2 },
        exchanges: [{ exchange: `${eventName}`, type: `${type}` }],
        queueBindings: [
          { exchange: `${eventName}`, routingKey: `${routingKey}` },
        ],
      },
      async (msg) => {
        console.log(`received message (${eventName})`, msg);
        // Handle the message
        
      }
    );

    subscribe.on("error", (err) => {
      console.log(`consumer error (${eventName})`, err);
    });
    return subscribe;
  }

  async setupPublisher(eventName, type) {
    const publisher =  this.RabbitConnection.createPublisher({
      confirm: true,
      maxAttempts: 2,
      exchanges: [{ exchange: `${eventName}`, type: `${type}` }],
    });

    return publisher;
  }

  publishToCustomExchange(eventName, routingKey, data) {
    this.publisher.send(
      { exchange: `${eventName}`, routingKey: `${routingKey}` },
      data,
      (err, confirm) => {
        if (err) {
          console.error("Error sending message:", err);
        } else {
          if (confirm.ack) {
            console.log("Message sent successfully");
          } else {
            console.error("Message not sent");
          }
        }
      }
    );
  }

  publishToQueue(eventName, data) {
    this.publisher.send(eventName, data);
  }
}

module.exports = RabbitConnections;




