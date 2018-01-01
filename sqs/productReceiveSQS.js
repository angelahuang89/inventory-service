const axios = require('axios');
const Promise = require('bluebird');
const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');

AWS.config.update({region: 'us-west-1'});

// const productSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/productQueue';

// check queue on schedule

const app = Consumer.create({
  queueUrl: queueUrl,
  messageAttributeNames: ['Name', 'Description', 'Image', 'Category', 'Price', 'Count', 'ProductId', 'Quantity'],
  waitTimeSeconds: 10,
  handleMessage: (message, done) => {
    const product = {};
    product.product_name = message.MessageAttributes.Name.StringValue;
    if (message.Body === 'Information for new product') {
      product.product_description = message.MessageAttributes.Description.StringValue;
      product.product_image = message.MessageAttributes.Image.StringValue;
      product.category = message.MessageAttributes.Category.StringValue;
      product.price = parseInt(message.MessageAttributes.Price.StringValue, 10);
      product.inventory_count = parseInt(message.MessageAttributes.Count.StringValue);
      axios.post('http://localhost:1337/products/new', product)
        .then(() => done())
        .catch(error => console.log(error));
    } else if (message.Body === 'Information for restocking product') {
      product.id = message.MessageAttributes.ProductId;
      product.quantity = message.MessageAttributes.Quantity;
      axios.patch('http://localhost:1337/products/restock', product)
        .then(() => done())
        .catch(error => console.log(error));
    } else if (message.Body === 'Information for discontinuing product') {
      product.id = message.MessageAttributes.ProductId;
      axios.delete('http://localhost:1337/products/discontinued', product)
        .then(() => done())
        .catch(error => console.log(error));
    }
  }
});

app.on('error', error => {
  console.log(error.message);
});

app.start();

// const checkProducts = () => {
//   const params = {
//     AttributeNames: [
//       'SentTimestamp'
//     ],
//     MaxNumberOfMessages: 1,
//     MessageAttributeNames: [
//       'All'
//     ],
//     QueueUrl: queueUrl,
//     VisibilityTimeout: 0,
//     WaitTimeSeconds: 0,
//   };
//
//   productSQS.receiveMessage(params, (error, data) => {
//     if (error) {
//       console.log('Product queue receive error', error);
//     } else if (data.Messages) {
//       // data.Messages.forEach(message => {
//         // const product = message.MessageAttributes;
//         const obj = data.Messages[data.Messages.length - 1];
//         const product = {};
//         product.product_name = obj.MessageAttributes.Name.StringValue;
//         product.product_description = obj.MessageAttributes.Description.StringValue;
//         product.product_image = obj.MessageAttributes.Image.StringValue;
//         product.category = obj.MessageAttributes.Category.StringValue;
//         product.price = parseInt(obj.MessageAttributes.Price.StringValue, 10);
//         product.inventory_count = parseInt(obj.MessageAttributes.Count.StringValue);
//         if (obj.Body === 'Information for new product') {
//           axios.post('http://localhost:1337/products/new', product)
//             .then(response => {
//               const deleteParams = {
//                 QueueUrl: queueUrl,
//                 ReceiptHandle: obj.ReceiptHandle,
//                 // ReceiptHandle: message.ReceiptHandle,
//               };
//               productSQS.deleteMessage(deleteParams, (error, data) => {
//                 if (error) {
//                   console.log('Product queue delete error', error);
//                 } else {
//                   console.log('Product queue message deleted', data);
//                 }
//               });
//             })
//             .catch(error => {
//               console.log(error);
//             });
//         } else if (obj.Body === 'Information for restocking product') {
//           axios.patch('http://localhost:1337/products/restock', product)
//             .then(response => {
//               const deleteParams = {
//                 QueueUrl: queueUrl,
//                 ReceiptHandle: obj.ReceiptHandle,
//                 // ReceiptHandle: message.ReceiptHandle,
//               };
//               productSQS.deleteMessage(deleteParams, (error, data) => {
//                 if (error) {
//                   console.log('Product queue delete error', error);
//                 } else {
//                   console.log('Product queue message deleted', data);
//                 }
//               });
//             })
//             .catch(error => {
//               console.log(error);
//             });
//         } else if (obj.Body === 'Information for discontinuing product') {
//           axios.delete('http://localhost:1337/products/discontinued', product)
//             .then(response => {
//               const deleteParams = {
//                 QueueUrl: queueUrl,
//                 ReceiptHandle: obj.ReceiptHandle,
//                 // ReceiptHandle: message.ReceiptHandle,
//               };
//               productSQS.deleteMessage(deleteParams, (error, data) => {
//                 if (error) {
//                   console.log('Product queue delete error', error);
//                 } else {
//                   console.log('Product queue message deleted', data);
//                 }
//               });
//             })
//             .catch(error => {
//               console.log(error);
//             });
//         }
//       // });
//     }
//   });
// };
//
// exports.checkProducts = checkProducts;
