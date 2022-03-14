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