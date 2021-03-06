const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

const bundleSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/bundleQueue';

const sendRestock = (product) => {
  const { id, inventory_count } = product;
  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: `${id}`,
      },
      'Quantity': {
        DataType: 'Number',
        StringValue: `${inventory_count}`,
      },
    },
    MessageBody: 'Information for restocking product',
    QueueUrl: queueUrl,
  };

  bundleSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.error('Bundle queue send error', error);
    } else {
      console.log('Bundle queue send success', data.MessageId);
    }
  });
}

const sendPurchase = (product) => {
  const { id, inventory_count } = product;
  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: `${id}`,
      },
      'Quantity': {
        DataType: 'Number',
        StringValue: `${inventory_count}`,
      },
    },
    MessageBody: 'Information for decreasing product count',
    QueueUrl: queueUrl,
  };

  bundleSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.error('Bundle queue send error', error);
    } else {
      console.log('Bundle queue send success', data.MessageId);
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

  bundleSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.error('Bundle queue send error', error);
    } else {
      console.log('Bundle queue send success', data.MessageId);
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

  bundleSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.error('Bundle queue send error', error);
    } else {
      console.log('Bundle queue send success', data.MessageId);
    }
  });
};

exports.bundleSQS = bundleSQS;
exports.sendRestock = sendRestock;
exports.sendPurchase = sendPurchase;
exports.sendDiscontinued = sendDiscontinued;
exports.sendNewProduct = sendNewProduct;
