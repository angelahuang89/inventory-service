const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

const bundleSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/bundleQueue';

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

  bundleSQS.receiveMessage(params, (error, data) => {
    if (error) {
      console.log('Bundle queue receive error', error);
    } else if (data.Messages) {
      data.Messages.forEach(message => {
        productId = parseInt(message.MessageAttributes.ProductId.StringValue, 10);
        // delete product from bundle database using productId
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };
        clientSQS.deleteMessage(deleteParams, (error, data) => {
          if (error) {
            console.log('Bundle queue delete error', error);
          } else {
            console.log('Bundle queue message deleted', data);
          }
        });
      });
    }
  });
};
