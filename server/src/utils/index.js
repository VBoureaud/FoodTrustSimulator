exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getToday = () => new Date().toJSON().slice(0,10);

exports.dateDays = (dateStr, addDay) => {
  const myDate = new Date(dateStr);
  myDate.setDate(myDate.getDate() + addDay);
  return myDate.getFullYear() 
    + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2)
    + '-' + ('0' + myDate.getDate()).slice(-2)
};

exports.diacriticSensitiveRegex = (string = '') =>
  string.replace(/a/g, '[a,â,á,à,ä]')
        .replace(/e/g, '[e,é,è,ê,ë]')
        .replace(/i/g, '[i,í,ï]')
        .replace(/o/g, '[o,ó,ö,ò]')
        .replace(/u/g, '[u,ü,ú,ù]')
        .replace(/n/g, '[n,ñ]');

exports.byteCount = (s) => {
    return encodeURI(s).split(/%..|./).length - 1;
}

exports.hashURI = (address, type) => {
  const date = new Date().getTime();
  return address + date + type;
}

exports.decodeHashURI = (s) => {
  const dateSize = 13;
  const typeSize = 6;
  const addressSize = s.length - (dateSize + typeSize);
  const address = s.slice(0, addressSize);
  const date = new Date(parseInt(s.slice(addressSize, addressSize + dateSize)));
  const type = s.slice(addressSize + dateSize, s.length);
  return {
    address,
    date,
    type
  };
};

exports.unPad = (str) => {
  if (!str) return str;
  let i = 0;
  while (i < str.length && str[i] == '0')
    i++;
  return str.slice(i, str.length);
}

exports.doPad = (str, size) => {
  if (!str) return str;
  return str.padStart(size).replaceAll(' ', 0)
}

exports.addslashes = (str) => {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

exports.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Generate string of random value for css image transform
// param: action 'cold' or 'heat' or null
// ret: "c:80;g:67"
exports.generateImageSpecs = (action) => {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const options = {
    'sepia': { min: 0, max: 60, scale: '%', code: 'se', proba: 0.1 },
    'contrast': { min: 80, max: 250, scale: '%', code: 'c', proba: 0.8 },
    'grayscale': { min: 0, max: 20, scale: '%', code: 'g', proba: 0.3 },
    'hue-rotate': { min: 0, max: 360, scale: 'deg', code: 'h', proba: 0.1 },
    'invert': { min: 90, max: 100, scale: '%', code: 'i', proba: 0.1 },
    'saturate': { min: 80, max: 130, scale: '', code: 's', proba: 0.5 },
  };
  const actionCold = {
    'sepia': { min: 90, max: 100, scale: '%', code: 'se', proba: 1 },
    'hue-rotate': { min: 180, max: 195, scale: 'deg', code: 'h', proba: 1 },
    'saturate': { min: 3, max: 6, scale: '', code: 's', proba: 1 },
  };
  const actionHeat = {
    'sepia': { min: 90, max: 100, scale: '%', code: 'se', proba: 1 },
    'hue-rotate': { min: 310, max: 330, scale: 'deg', code: 'h', proba: 1 },
    'saturate': { min: 3, max: 6, scale: '', code: 's', proba: 1 },
    'grayscale': { min: 10, max: 50, scale: '%', code: 'g', proba: 1 },
  };

  const currentOptions = action ? (action === 'ice' ? actionCold : actionHeat) : options;
  const keys = Object.keys(currentOptions);
  let generated = '';
  for (let i = 0; i < keys.length; i++) {
    const proba = randomInt(0, 100) / 100;
    if (proba <= currentOptions[keys[i]].proba) {
      const filter = `${currentOptions[keys[i]].code}:${randomInt(currentOptions[keys[i]].min, currentOptions[keys[i]].max)}`;
      generated = generated 
        ? generated + ';' + filter
        : filter;
    }
  }
  return generated;
}

exports.displayDate = (dateStr, withHours=false, dateObj=null) => {
  if (!dateStr && !dateObj)
    return '';
  const monthNamesFull = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const myDate = !dateObj ? new Date(dateStr) : dateObj;
  
  const fullDate = monthNames[myDate.getMonth()] + ' '
    + ('0' + myDate.getDate()).slice(-2) + ', ' + 
    + myDate.getFullYear();

  /*const fullDate = ('0' + (myDate.getMonth() + 1)).slice(-2) + '/'
    + ('0' + myDate.getDate()).slice(-2) + '/' + 
    + myDate.getFullYear();*/
  const fullHours = ('0' + myDate.getHours()).slice(-2) 
    + ':' + ('0' + myDate.getMinutes()).slice(-2)
    + ':' + ('0' + myDate.getSeconds()).slice(-2);
  return fullDate + (withHours ? ' ' + fullHours : '');
}

exports.getObjInArray = (arr, field, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value)
      return arr[i];
  }
}
exports.getIndexInArray = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value)
      return i;
  }
  return -1;
}

// Get params value from url
exports.getQueryVariable = (url, variable) => {
  var vars = url.split('?')[1].split('&');
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  return null;
}

exports.howManyDayBetweenTwoDate = (d1, d2=null) => {
  const date1 = new Date(parseInt(d1 + ''));
  const date2 = d2 ? new Date(parseInt(d2 + '')) : new Date();
  const diff = date1 - date2;
  return Math.abs(diff) / (24 * 60 * 60 * 1000);
}