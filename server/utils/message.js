var moment = require('moment');

// Creating utility function generateMessage
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

//Creating utility fucntion generateLocationMessage
var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
};
//exporting our functions
module.exports = {generateMessage, generateLocationMessage};
