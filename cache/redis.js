const redis = require('redis');
const Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const cache = redis.createClient();

cache.on('error', error => console.log('Error', error));

const saveSearch = (query, products) => {
  return cache.setAsync(query, JSON.stringify(products), 'EX', 1800)
    .catch(error => console.error('Error adding search results to cache', error));
}

const retrieveSearch = (query) => {
  return cache.getAsync(query)
    .then(results => {
      return results;
    })
    .catch(error => console.error('Error retrieving saved search from cache', error));
}

// const addProduct = (product) => {
//   return cache.setAsync(product.id, JSON.stringify(product))
//     .catch(error => console.error('Error adding product to cache', error));
// };
//
// const removeProduct = (productId) => {
//   return cache.delAsync(productId)
//     .catch(error => console.error('Error removing product from cache', error));
// };
//
// const retrieveProduct = (productId) => {
//   return cache.getAsync(productId)
//     .then(results => {
//       return results
//     })
//     .catch(error => console.error('Error retrieving product from cache', error));
// };
//
// const updateProduct = (product) => {
//   cache.retrieveProduct(product.id)
//     .then(results => {
//       if (results !== null) {
//         cache.setAsync(product.id, JSON.stringify(product))
//           .catch(error => console.error('Error updating product in cache'), error);
//       }
//     })
// };

// const addToCache = (product, productId) => {
//   const keywords = product.toLowerCase().split(' ');
//
//   keywords.forEach(keyword => {
//     cache.saddAsync(keyword, productId)
//       .catch(error => console.error('Error adding to cache', error));
//   });
// };
//
// const removeFromCache = (product, productId) => {
//   const keywords = product.toLowerCase().split(' ');
//
//   keywords.forEach(keyword => {
//     cache.sremAsync(keyword, productId)
//       .catch(error => console.error('Error removing from cache', error));
//   });
// };
//
// const retrieveIds = (query) => {
//   return cache.smembersAsync(query)
//     .then(results => {
//       return results.map(result => {
//         return parseInt(result, 10);
//       });
//     })
//     .catch(error => console.error('Error retrieving from cache', error));
// };

exports.cache = cache;
exports.saveSearch = saveSearch;
exports.retrieveSearch = retrieveSearch;
// exports.addProduct = addProduct;
// exports.removeProduct = removeProduct;
// exports.retrieveProduct = retrieveProduct;
// exports.updateProduct = updateProduct;
// exports.addProductToCache = addToCache;
// exports.removeFromCache = removeFromCache;
// exports.retrieveIds = retrieveIds;
