const redis = require('redis');
const Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const cache = redis.createClient();

cache.on('error', error => console.log('Error', error));

const addToCache = (product, productId) => {
  const keywords = product.toLowerCase().split(' ');

  keywords.forEach(keyword => {
    cache.saddAsync(keyword, productId)
      .catch(error => console.log('Error adding to cache', error));
  });
};

const removeFromCache = (product, productId) => {
  const keywords = product.toLowerCase().split(' ');

  keywords.forEach(keyword => {
    cache.sremAsync(keyword, productId)
      .catch(error => console.log('Error removing from cache', error));
  });
};

const retrieveIds = (query) => {
  return cache.smembersAsync(query)
    .then(results => {
      return results.map(result => {
        return parseInt(result, 10);
      });
    })
    .catch(error => console.log('Error retrieving from cache', error));
};

exports.cache = cache;
exports.addProductToCache = addToCache;
exports.removeFromCache = removeFromCache;
exports.retrieveIds = retrieveIds;
