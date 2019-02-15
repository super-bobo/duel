const storage = {
  getItem(key) {
    return window.localStorage.getItem(key);
  },
  setItem(key, value) {
    return window.localStorage.setItem(key, value);
  },
  removeItem(key) {
    if (typeof key == 'object') {
      key.map((value, index) => {
        window.localStorage.removeItem(value);
      });
    } else {
      window.localStorage.removeItem(key);
    }
  }
};

function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var search;
  try {
    search = this.props.location.search;
  } catch (e) {
    search = window.location.search;
  }
  var r = search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function numFixed(number) {
  return function(fixed) {
    fixed = parseFloat(fixed) + 1;
    number = parseFloat(number).toFixed(fixed);
    return number.substring(0, number.lastIndexOf('.') + fixed);
  };
}

function formatDate(date, s, d) {
  const pad = n => (n < 10 ? `0${n}` : n);
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}${s ? `:${pad(date.getSeconds())}` : ''}`;
  return d ? dateStr : `${dateStr} ${timeStr}`;
}

function fixedTo2(value) {
  return numFixed(value)(2);
}

function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

export {
  storage,
  getUrlParam,
  numFixed,
  formatDate,
  fixedTo2,
  deepCopy
};
