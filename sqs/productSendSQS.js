const faker = require('faker');
const axios = require('axios');
const Promise = require('bluebird');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-1'});

const productSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/productQueue';

const addNewProduct = () => {
  const product = {};
  product.name = faker.commerce.productName();
  product.description = faker.lorem.sentence();
  product.image = faker.image.imageUrl();
  product.category = faker.commerce.department();
  product.price = faker.commerce.price();
  product.count = Math.floor(Math.random() * 10000);

  const params = {
    MessageAttributes: {
      'Name': {
        DataType: 'String',
        StringValue: product.name,
      },
      'Description': {
        DataType: 'String',
        StringValue: product.description,
      },
      'Image': {
        DataType: 'String',
        StringValue: product.image,
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
        StringValue: `${product.count}`,
      },
    },
    MessageBody: 'Information for new product',
    QueueUrl: queueUrl,
  };

  productSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Product queue send error', error);
    } else {
      console.log('Product queue send success', data.MessageId);
    }
  });
}

const restockProduct = (product) => {
  // const product = {};
  // product.id = Math.floor(Math.random() * 2000000);
  // product.quantity = Math.floor(Math.random() * 10000);

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
    MessageBody: 'Information for restocking product',
    QueueUrl: queueUrl,
  };

  productSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Product queue send error', error);
    } else {
      console.log('Product queue send success', data.MessageId);
      return;
    }
  });
};

const discontinueProduct = () => {
  id = Math.floor(Math.random() * 100000);

  const params = {
    MessageAttributes: {
      'ProductId': {
        DataType: 'Number',
        StringValue: `${id}`,
      },
    },
    MessageBody: 'Information for discontinuing product',
    QueueUrl: queueUrl,
  };

  productSQS.sendMessage(params, (error, data) => {
    if (error) {
      console.log('Product queue send error', error);
    } else {
      console.log('Product queue send success', data.MessageId);
      return;
    }
  });
};

exports.addNewProduct = addNewProduct;
exports.restockProduct = restockProduct;
exports.discontinueProduct = discontinueProduct;
