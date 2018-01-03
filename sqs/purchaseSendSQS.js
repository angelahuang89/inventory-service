const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

const purchaseSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/purchaseQueue';

const sendPurchase = () => {
  const product = {};
  product.id = Math.floor(Math.random() * 2000000);
  product.quantity = Math.floor(Math.random() * 10000);

  const { id, quantity } = product;

  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: `${id}`,
      },
      'Quantity': {
        DataType: 'Number',
        StringValue: `${quantity}`,
      },
    },
    MessageBody: 'Information for decreasing product count',
    QueueUrl: queueUrl,
  };

  purchaseSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.error('Purchase queue send error', error);
    } else {
      console.log('Purchase queue send success', data.MessageId);
      return;
    }
  });
}

exports.purchaseSQS = purchaseSQS;
exports.sendPurchase = sendPurchase;
