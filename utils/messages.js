const moment = require('moment');

function formatMassage(useName, text){
  return {
    useName,
    text,
    time: moment().format('h:mm:a')
  }
}

module.exports = formatMassage;
