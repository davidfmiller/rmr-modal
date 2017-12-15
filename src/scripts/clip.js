/* */

(() => {

  'use strict';

  const URL = typeof window !== 'undefined' ? window.URL : require('url').URL;

  /**
   * Parse a YouTube or Vimeo URL and retrieve the video/clip ID 
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

    // unsupported
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
      let i = paths.length - 1;
      // [ '', 'embed', 'sNaR1JRNayU', '' ]
      while (i >= 0) {
        if (paths[i]) {
          return paths[i];
        }
        i--;
      }

    } else if (o.hostname.indexOf('vimeo.com') !== -1) {

      if (o.hostname.indexOf('player.vimeo.com') !== -1) {
        return o.pathname.split('/').pop();
      }

      return o.pathname.split('/').pop();
    }

    return url;
  };

  module.exports = getClipID;

})();
