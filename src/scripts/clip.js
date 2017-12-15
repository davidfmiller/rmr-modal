/* */

(() => {

  'use strict';

  const URL = typeof window !== 'undefined' ? window.URL :  require('url').URL;

  /**
   * Parse a YouTube or Vimeo video ID from its URL
   *
   * @param {String} url the URL to be parsed
   * @return {String} the clip id
   */
  const getClipID = function(url) {

    // ensure it's a string
    url = '' + url;

    if (url.substring(0, '5') !== 'http:' && url.substring(0, '8') !== 'https://' && url.substring(0, 2) !== '//') {
      return url;
    }

    const
    o = new URL(url),
    params = o.searchParams;

    if (o.hostname.indexOf('youtube.com') !== -1) {
      if (params.get('v')) {
        return params.get('v');
      }
    } else if (o.hostname.indexOf('player.vimeo.com') !== -1) {
      return o.pathname.split('/').pop();
    }

    return url;
  };

  module.exports = getClipID;

})();
