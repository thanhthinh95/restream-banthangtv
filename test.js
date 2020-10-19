var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://jdy.jinchuan556.com/live/zbstreamhd23082.m3u8?txSecret=4d3c1e766628d03d7324d71b36d4158b&txTime=5eeba223',
  rejectUnauthorized: false,
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
