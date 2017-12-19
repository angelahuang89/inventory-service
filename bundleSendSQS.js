const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const bundleSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-2.amazonaws.com/379538513358/bundleQueue.fifo';

const sendProductUpdate = (productId) => {
  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: productId,
      },
    },
    MessageBody: 'Id information about discontinued product',
    MessageGroupId: 'Bundle',
    QueueUrl: queueUrl,
  };

  sqs.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Error', error);
    } else {
      console.log('Success', data.MessageId);
    }
  });
}

exports.bundleSQS = bundleSQS;
exports.sendProductUpdate = sendProductUpdate;
