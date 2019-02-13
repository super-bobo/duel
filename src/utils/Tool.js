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

function num2or6(value) {
  let fixed = value == 0 ? 2 : 6;
  return numFixed(value)(fixed);
}

export {
  storage,
  getUrlParam,
  numFixed,
  formatDate,
  num2or6
};
