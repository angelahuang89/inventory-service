const axios = require('axios');
const Promise = require('bluebird');
const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');

AWS.config.update({region: 'us-west-1'});

// const purchaseSQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/379538513358/purchaseQueue';

// check queue on a schedule

const app = Consumer.create({
  queueUrl: queueUrl,
  messageAttributeNames: ['ProductId, Quantity'],
  waitTimeSeconds: 10,
  handleMessage: (message, done) => {
    const product = message.MessageAttributes;
    axios.patch('http://localhost:1337/purchases', product)
      .then(() => done())
      .catch(error => console.log(error));
    done();
  }
});

app.on('error', error => {
  console.log(error.message);
});

app.start();

// const receivePurchaseInfo = () => {
//   const params = {
//     AttributeNames: [
//       'SentTimestamp'
//     ],
//     MaxNumberOfMessages: 10,
//     MessageAttributeNames: [
//       'All'
//     ],
//     QueueUrl: queueUrl,
//     VisibilityTimeout: 0,
//     WaitTimeSeconds: 0,
//   };
//
//   purchaseSQS.receiveMessage(params, (error, data) => {
//     if (error) {
//       console.log('Client queue receive error', error);
//     } else if (data.Messages) {
//       data.Messages.forEach(message => {
//         product = message.MessageAttributes;
//         axios.patch('http://localhost:1337/purchases', product)
//           .then(response => {
//             const deleteParams = {
//               QueueUrl: queueUrl,
//               ReceiptHandle: message.ReceiptHandle,
//             };
//             purchaseSQS.deleteMessage(deleteParams, (error, data) => {
//               if (error) {
//                 console.log('Client queue delete error', error);
//               } else {
//                 console.log('Client queue message deleted', data);
//               }
//             });
//       });
//     }
//   });
// };
//
// exports.receivePurchaseInfo = receivePurchaseInfo;
