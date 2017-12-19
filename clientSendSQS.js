const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

const clientSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/clientQueue';

const sendDiscontinued = (productId) => {
  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: `${productId}`,
      },
    },
    MessageBody: 'Id information about discontinued product',
    QueueUrl: queueUrl,
  };

  clientSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Error', error);
    } else {
      console.log('Success', data.MessageId);
      return;
    }
  });
}

sendDiscontinued(123456)

exports.clientSQS = clientSQS;
exports.sendDiscontinued = sendDiscontinued;
