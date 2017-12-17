/* global document,window,Element,module,console */


/*
 * modal
 * ©2017 David Miller
 * https://readmeansrun.com
 *
 * modal is licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(() => {

  'use strict';

  const
  // VERSION = '0.0.1',

  getClipID = require('./clip'),

  MOBILE = typeof window.orientation !== 'undefined',

  PREFIX = 'rmr-modal-',
  LANG = {
    'close': 'Close'
  },

  localize = function(key, lookup) {
    if (! lookup) {
      lookup = LANG;
    }

    if (LANG.hasOwnProperty(key)) {
      return LANG[key];
    }

    console.warn('No localization for ' + key);
    return key;
  },

  /*
   * Convert an array-like thing (ex: NodeList or arguments object) into a proper array
   *
   * @param list (array-like thing)
   * @return Array
  arr = function(list) {
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
   */

  /*
   * Retrieve an object containing { top : xx, left : xx, bottom: xx, right: xx, width: xx, height: xx }
   *
   * @param node (DOMNode)

  getRect = function(node) {
    const
    rect = node.getBoundingClientRect(),
    ret = { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right }; // create a new object that is not read-only

    ret.top += window.pageYOffset;
    ret.left += window.pageXOffset;

    ret.bottom += window.pageYOffset;
    ret.right += window.pageYOffset;

    ret.width = rect.right - rect.left;
    ret.height = rect.bottom - rect.top;

    return ret;
  },
   */

  /*
   * Create an element with a set of attributes/values
   *
   * @param type (String)
   * @param attrs {Object}
   *
   * @return HTMLElement
   */
  makeElement = function(type, attrs) {
     const n = document.createElement(type);

     for (const i in attrs) {
       if (attrs.hasOwnProperty(i)) {
         n.setAttribute(i, attrs[i]);
       }
     }
     return n;
  },

  /*
   * Merge two objects into one, values in b take precedence over values in a
   *
   * @param a {Object}
   * @param b {Object}

   * @return Object
   */
  merge = function(a, b) {
    const o = {};
    let i;
    for (i in a) {
      if (a.hasOwnProperty(i)) {
        o[i] = a[i];
      }
    }
    if (! b) {
      return o;
    }
    for (i in b) {
      if (b.hasOwnProperty(i)) {
        o[i] = b[i];
      }
    }
    return o;
  },

  /**
   * Create a Modal instance
   *
   * @param {Object} options - args
   */
  Modal = function(options) {

    const defaults = {
      autoplay: 1,
      z: 1,
      attrs : {}
    };

    if (options.hasOwnProperty('aspect') && options.hasOwnProperty('size')) {
      throw new Error('Invalid arguments: aspect and size provided. Specify one or the other.');
    }

    this.options = merge(defaults, options);
    this.bg = null;
    this.container = null;
  };

  /**
   * Presents the modal
   *
   * @return {Object} - instance for chaining
   * @chainable
   */
  Modal.prototype.show = function() {
    const self = this;

    const
    dismiss = function() {
      self.remove();
    },
    init = function() {
      self.bg = document.createElement('div');
      self.bg.classList.add(PREFIX + 'bg');
      self.bg.style.zIndex = parseInt(self.options.z, 10);

      document.body.classList.add(PREFIX + 'open');

      self.container = document.createElement('div');
      self.container.classList.add(PREFIX + 'dialog');
      self.container.setAttribute('tabindex', -1);
      self.container.setAttribute('role', 'dialog');
      self.container.setAttribute('aria-hidden', 'true');
      self.container.style.zIndex = parseInt(self.options.z + 1, 10);

      document.body.insertBefore(self.bg, document.body.childNodes[0]);
      document.body.insertBefore(self.container, document.body.childNodes[0]);

      self.keyListener = document.addEventListener('keydown', function escapeLisenter(event) {
        if (event.keyCode === 27) { // escape key
          self.remove();
        }
      });
    },
    post = function() {
      if (! self.options) {
        return;
      }
      const but = document.createElement('button');
      but.classList.add(PREFIX + 'dismiss');
      but.innerHTML = localize('close');
      but.setAttribute('title', localize('close'));
      self.container.appendChild(but);
      but.addEventListener('click', dismiss);

      if (self.options.hasOwnProperty('class')) {
        self.container.classList.add(self.options.class);
      }

      const resizer = function() {

        if (! self || ! self.options) {
          return;
        }

        const
        aspect = self.options.hasOwnProperty('aspect') ? self.options.aspect : self.options.size.width / self.options.size.height,
        buffer = MOBILE ? 0 : 0.20, // portion of window that should be padding around modal
        size = self.options.size,
        modalSize = { width: 0, height: 0},
        windowSize = { width: window.innerWidth, height: window.innerHeight },
        verticalLimiter = (window.innerWidth / window.innerHeight) > aspect ? true : false;

        // set size via aspect ratio that fits in browser window
        if (self.options.hasOwnProperty('aspect')) {
          if (verticalLimiter) {
            modalSize.height = (windowSize.height - windowSize.height * buffer);
            modalSize.width = modalSize.height * aspect;
          } else {
            modalSize.width = (windowSize.width - windowSize.width * buffer);
            modalSize.height = modalSize.width / aspect;
          }
        }
        // set size via options parameters
        else if (self.options.hasOwnProperty('size')) {
          modalSize.width = self.options.size.width;
          modalSize.height = self.options.size.height;
        }
        // undefined sizing behaviour 

        self.container.style.right = '';
        self.container.style.width = modalSize.width + 'px';
        self.container.style.height = modalSize.height + 'px';
        self.container.style.left = (windowSize.width - modalSize.width) / 2 + 'px';
        self.container.style.top = (windowSize.height - modalSize.height) / 2 + 'px';
      };

      if (self.options.hasOwnProperty('size') || self.options.hasOwnProperty('aspect')) {
        resizer();
        self.resizeListener = window.addEventListener('resize', resizer);
      }

      document.body.classList.add(PREFIX + 'open');
      if (self.options.hasOwnProperty('class')) {
        self.container.classList.add(self.options.class);
      }

      self.bg.addEventListener('click', dismiss);
      window.setTimeout(function timeout() {
        if (! self) {
          return;
        }
        if (self.container) {
          self.container.classList.add(PREFIX + 'focus');
          if (MOBILE) {
            self.container.classList.add(PREFIX + 'mobile');
          }
        }
        if (self.bg) {
          self.bg.classList.add(PREFIX + 'focus');
        }

        if (self.options && self.options.hasOwnProperty('on') && self.options.on.hasOwnProperty('show')) {
          self.options.on.show(self.container, self.options);
        }
      }, 100);
    };

    if (this.options.url) {

      init();

      self.container.classList.add(PREFIX + 'loading');

      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {

        if (this.readyState === 4) {
          if (this.status === 200) {
            if (self.container) {
              self.container.classList.add(PREFIX + 'node');
              self.container.classList.remove(PREFIX + 'loading');
              self.container.innerHTML = '<section>' + this.responseText + '</section>';
              post();
            }
          } else {
// TODO
          }
        }
      };

//      window.setTimeout(function () {
        if (self.options) {
          xhttp.open(self.options.hasOwnProperty('method') ? self.options.method : 'get', self.options.url, true);
          xhttp.send();
        }
//      }, 0);

    } else if (this.options.video) {

      init();

      self.container.classList.add(PREFIX + 'loading');

      const video = makeElement('video', this.options.attrs);
      for (const i in this.options.video) {
        if (this.options.video.hasOwnProperty(i)) {
          const source = makeElement('source', { type: i, src: this.options.video[i] });
          video.appendChild(source);
        }
      }

      video.addEventListener('loadeddata', () => {
        self.container.classList.remove(PREFIX + 'loading');
      });

      this.container.appendChild(video);
      post();

    } else if (this.options.node) {

      init();
      const node = typeof this.options.node === 'string' ? document.querySelector(this.options.node) : this.options.node;

      if (! node) {
        throw new Error('Invalid node for modal :' + node);
        return;
      }

      self.container.classList.add(PREFIX + 'node');

      this.container.innerHTML = '<section>' + node.innerHTML + '</section>';
      post();

    } else if (this.options.html) {

      init();
      this.container.classList.add(PREFIX + 'node');
      this.container.innerHTML = '<section>' + this.options.html + '</section>';
      post();

    } else if (this.options.youtube || this.options.vimeo) {

      const clip = getClipID(this.options.youtube ? this.options.youtube : this.options.vimeo);

      init();
      const
      player = this.options.hasOwnProperty('youtube') ? 'https://www.youtube.com/embed/' : 'https://player.vimeo.com/video/',
      iframe = '<iframe src="' + player + (clip ? clip : '')  + (this.options.autoplay ? '?autoplay=1' : '') + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

      this.container.classList.add(PREFIX + 'video');
      this.container.innerHTML = iframe;
      post();

    } else {
      throw new Error('Invalid modal parameters: ' + JSON.stringify(this.options));
      return;
    }

    return this;
  };

  /**
   * Remove the modal
   *
   * @return {Object} - instance for chaining
   * @chainable
   */
  Modal.prototype.remove = function() {
    const self = this;

    document.body.classList.remove(PREFIX + 'open');

    if (self.container) {
      this.container.classList.remove(PREFIX + 'focus');
    }
    if (self.bg) {
      this.bg.classList.add(PREFIX + 'dismiss');
    }

    document.body.classList.remove(PREFIX + 'open');

    if (self.options && self.options.hasOwnProperty('on') && self.options.on.hasOwnProperty('remove')) {
      self.options.on.remove(self.container, self.options);
    }

    window.setTimeout(
      function timeout() {
        if (! self) {
          return;
        }

        if (self.bg) {
          document.body.removeChild(self.bg);
        }
        if (self.container) {
          document.body.removeChild(self.container);
        }
        self.resizeListener = self.keyListener = self.options = self.bg = self.container = null;
      }, 200
    );

    window.removeEventListener('resize', self.resizeListener);
    document.removeEventListener('keydown', self.keyListener);

    return this;
  };

  module.exports = {
    Modal: Modal,
    clip: getClipID
  };

})();
