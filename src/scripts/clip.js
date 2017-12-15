/* */

(() => {

  'use strict';

  const URL = typeof window !== 'undefined' ? window.URL : require('url').URL,

  /*
   * Convert an array-like thing (ex: NodeList or arguments object) into a proper array
   *
   * @param list (array-like thing)
   * @return Array
   */
  arr = function(list) {

    if (list instanceof Array) {
      return list;
    }

    const ret = [];
    let i = 0;

    if (! list.length) {
      return ret;
    }

    for (i = 0; i < list.length; i++) {
      ret.push(list[i]);
    }

    return ret;
  },

  /**
   * Retrieve the last non-empty element of an array
   *
   * @param {array} list - array to be iterated through
   * @param {function} func (optional) function used to evaluate items in the array
   * @return {mixed} the last non-empty value in the array (or `null` if no such value exists)
   */
  lastValue = function(list, func) {

    list = arr(list);

    let i = list.length - 1;
    // [ '', 'embed', 'sNaR1JRNayU', '' ]
    while (i >= 0) {
      if (func ? func(list[i]) : list[i]) {
        return list[i];
      }
      i--;
    }

    return null;
  },

  /**
   * Parse a YouTube or Vimeo URL and retrieve the video/clip ID 
   *
   * @param {String} url the URL to be parsed
   * @return {String} the clip id
   */
  getClipID = function(url) {

    // ensure it's a string
    url = '' + url;

    if (url.substring(0, '5') !== 'http:' && url.substring(0, '8') !== 'https://' && url.substring(0, 2) !== '//') {
      return url;
    }

    // unsupported (older versions of internet explorer)
    if (typeof URL === 'undefined') {
      return null;
    }

    const
    o = new URL(url),
    params = o.searchParams;

    if (o.hostname.indexOf('youtube.com') !== -1) {
      if (params.get('v')) {
        return params.get('v');
      }

      const paths = o.pathname.split('/');
      return lastValue(paths);

    } else if (o.hostname.indexOf('vimeo.com') !== -1) {

      if (o.hostname.indexOf('player.vimeo.com') !== -1) {
        return lastValue(o.pathname.split('/'))
      }

      const id = lastValue(o.pathname.split('/'));
      if (parseInt(id, 10)) {
        return id;
      }

      return null;
    }

    return url;
  };

  module.exports = getClipID;

})();
