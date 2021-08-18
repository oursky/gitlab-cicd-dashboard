module.exports = function withCache(callback, options) {
  return (...args) => {
    var cacheKey = JSON.stringify(args);
    var neededCache = options.cacheStorage.get(`${cacheKey}`);
    if (neededCache != null) {
      return new Promise((resolve) => resolve(neededCache));
    }
    return callback(...args).then((data) => {
      options.cacheStorage.set(`${cacheKey}`, data, options.ttl);
      return data;
    });
  };
};
