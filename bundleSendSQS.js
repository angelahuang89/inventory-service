const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

const bundleSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/bundleQueue';

const sendDiscontinued = (productId) => {
  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: productId,
      },
    },
    MessageBody: 'Id information about discontinued product',
    QueueUrl: queueUrl,
  };

  bundleSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Error', error);
    } else {
      console.log('Success', data.MessageId);
      return;
    }
  });
}

exports.bundleSQS = bundleSQS;
exports.sendDiscontinued = sendDiscontinued;
