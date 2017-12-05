/* global document,window,Element,module,console */


/*
 * modal
 * ©2017 David Miller
 * https://readmeansrun.com
 *
 * modal is licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */

(function() {
  'use strict';

  const
  // VERSION = '0.0.1',

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
   * Merge two objects into one, values in b take precedence over values in a
   *
   * @param a {Object}
   * @param b {Object}

   * @return Object

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
  };
   */
  /**
   * Create a Modal instance
   *
   * @param {Object} options - args
   */
  Modal = function(options) {
    this.options = options;
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

    this.bg = document.createElement('div');
    this.bg.classList.add('modal-bg');

    this.container = document.createElement('div');
    this.container.classList.add('modal');
    this.container.setAttribute('tabindex', -1);
    this.container.setAttribute('role', 'dialog');
    this.container.setAttribute('aria-hidden', 'true');

    if (this.options.node) {
      const node = typeof this.options.node === 'string' ? document.querySelector(this.options.node) : this.options.node;
      if (! node) {
        throw new Error('Invalid node for modal :' + node);
        return;
      }

      this.container.classList.add('modal-node');

      if (this.options.hasOwnProperty('class')) {
        this.container.classList.add(this.options.class);
      }
      this.container.innerHTML = '<section>' + node.innerHTML + '</section>';
    } else if (this.options.html) {
      this.container.classList.add('modal-node');

      if (this.options.hasOwnProperty('class')) {
        this.container.classList.add(this.options.class);
      }
      this.container.innerHTML = '<section>' + this.options.html + '</section>';
    } else if (this.options.youtube || this.options.vimeo) {
      const
      player = this.options.hasOwnProperty('youtube') ? 'https://www.youtube.com/embed/' : 'https://player.vimeo.com/video/',
      iframe = '<iframe src="' + player + (this.options.youtube ? this.options.youtube : this.options.vimeo)  + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

      this.container.classList.add('modal-video');
      this.container.innerHTML = iframe;
    } else {
      throw new Error('Invalid modal parameters: ' + JSON.stringify(this.options));
      return;
    }

    this.resizeListener = window.addEventListener('resize', function escapeLisenter() {
      // console.log('resize!!!!!!!!!!!');
    });

    this.keyListener = document.addEventListener('keydown', function escapeLisenter(event) {
      if (event.keyCode === 27) { // escape key
        self.remove();
      }
    });

    window.setTimeout(function() {
      self.container.classList.add('modal-focus');
    }, 100);

    const dismiss = function() {
      self.remove();
    };

    const button = document.createElement('button');
    button.classList.add('modal-dismiss');
    button.innerHTML = localize('close');
    button.setAttribute('title', localize('close'));
    button.addEventListener('click', dismiss);
    this.bg.addEventListener('click', dismiss);

    this.container.appendChild(button);

    document.body.appendChild(this.container);
    document.body.appendChild(this.bg);

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

    if (self.container) {
      this.container.classList.remove('modal-focus');
    }
    if (self.bg) {
      this.bg.classList.add('dismiss');
    }

    window.setTimeout(
      function() {
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
  module.exports = Modal;
})();
