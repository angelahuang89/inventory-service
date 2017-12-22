const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

const clientSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/clientQueue';

const sendRestock = (product) => {
  const { productId, quantity } = product;
  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: `${productId}`,
      },
      'Quantity': {
        DataType: 'Number',
        StringValue: `${quantity}`,
      },
    },
    MessageBody: 'Information for restocking product',
    QueueUrl: queueUrl,
  };

  clientSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Client queue send error', error);
    } else {
      console.log('Client queue send success', data.MessageId);
    }
  });
}

const sendPurchase = (product) => {
  const { productId, quantity } = product;
  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: `${productId}`,
      },
      'Quantity': {
        DataType: 'Number',
        StringValue: `${quantity}`,
      },
    },
    MessageBody: 'Information for decreasing product count',
    QueueUrl: queueUrl,
  };

  clientSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Client queue send error', error);
    } else {
      console.log('Client queue send success', data.MessageId);
    }
  });
}

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
      console.log('Client queue send error', error);
    } else {
      console.log('Client queue send success', data.MessageId);
    }
  });
};

const sendNewProduct = (product) => {
  const params = {
    MessageAttributes: {
      'Name': {
        DataType: 'String',
        StringValue: product.product_name,
      },
      'Id': {
        DataType: 'Number',
        StringValue: `${product.id}`,
      },
      'Description': {
        DataType: 'String',
        StringValue: product.product_description,
      },
      'Image': {
        DataType: 'String',
        StringValue: product.product_image,
      },
      'Category': {
        DataType: 'String',
        StringValue: product.category,
      },
      'Price': {
        DataType: 'Number',
        StringValue: product.price,
      },
      'Count': {
        DataType: 'Number',
        StringValue: `${product.inventory_count}`,
      },
    },
    MessageBody: 'Information for new product',
    QueueUrl: queueUrl,
  };

  clientSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Client queue send error', error);
    } else {
      console.log('Client queue send success', data.MessageId);
    }
  });
};

exports.clientSQS = clientSQS;
exports.sendRestock = sendRestock
exports.sendPurchase = sendPurchase;
exports.sendDiscontinued = sendDiscontinued;
exports.sendNewProduct = sendNewProduct;
