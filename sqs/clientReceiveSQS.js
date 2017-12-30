const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const clientSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/clientQueue';

const receiveProductInfo = () => {
  const params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: queueUrl,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0,
  };

  clientSQS.receiveMessage(params, (error, data) => {
    if (error) {
      console.log('Client queue receive error', error);
    } else if (data.Messages) {
      data.Messages.forEach(message => {
        product = message.MessageAttributes;
        // delete product from client database using productId
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };
        clientSQS.deleteMessage(deleteParams, (error, data) => {
          if (error) {
            console.log('Client queue delete error', error);
          } else {
            console.log('Client queue message deleted', data);
          }
        });
      });
    }
  });
};
