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

  RMR = require('rmr-util'),

  getClipID = require('./rmr-modal-clip'),

  MOBILE = RMR.Browser.isTouch(),

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
   *
   */
  addCurtains = function(parent) {

    const curtains = RMR.Node.create('div', { class: PREFIX + 'curtains' });
    curtains.innerHTML = RMR.Node.loader();
    parent.appendChild(curtains);

    const rect = RMR.Node.getRect(parent),
    svg = parent.querySelector('svg');

    svg.style.left = (rect.width - 40) / 2  + 'px';
    svg.style.top = (rect.height - 40) / 2  + 'px';
  },

  /**
   * Create a Modal instance
   *
   * @param {Object} options - args
   */
  Modal = function(options) {

    const defaults = {
      autoplay: 1,
      blur: false,
      z: 1,
      attrs: {}
    };

    if (options.hasOwnProperty('aspect') && options.hasOwnProperty('size')) {
      throw new Error('Invalid arguments: aspect and size provided. Specify one or the other.');
    }

    this.options = RMR.Object.merge(defaults, options);
    this.bg = null;
    this.container = null;
    this.elements = {
      bg: null,
      container: null,
      blur: null
    };
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

    // logic to run before context-specific initialization
    init = function() {
      self.elements.bg = RMR.Node.create('div', { class: PREFIX + 'bg' });
//      self.elements.bg.classList.add(PREFIX + 'bg');
      self.elements.bg.style.zIndex = parseInt(self.options.z, 10);

      document.body.classList.add(PREFIX + 'open');

      self.elements.container = RMR.Node.create('div', { tabindex: -1, role: 'dialog', 'aria-hidden': true });
      self.elements.container.classList.add(PREFIX + 'dialog');
      self.elements.container.style.zIndex = parseInt(self.options.z + 1, 10);

      if (self.options.size) {
        self.elements.container.style.width = self.options.size.width + 'px';
        self.elements.container.style.height = self.options.size.height + 'px';
      }

      if (self.options.blur) {
        self.elements.blur = RMR.Node.create('div', { class: PREFIX + 'blur' });
        while (document.body.childNodes.length > 0) {
          const n = document.body.firstChild;
          RMR.Node.remove(n);
          self.elements.blur.appendChild(n);
        }
      }
      document.body.appendChild(self.elements.bg);

      window.setTimeout(function() {
        self.elements.bg.classList.add(PREFIX + 'focus');
      }, 0);
      document.body.insertBefore(self.elements.container, document.body.childNodes[0]);
 
      if (self.options.blur) {
        document.body.appendChild(self.elements.blur);
      }

      self.keyListener = document.addEventListener('keydown', (e) => {

//        console.log(e.keyCode);

        if (e.keyCode === 27) { // escape key
          self.remove();
        } else if (e.keyCode === 32 && self.options && self.options.video) { // spacebar

          e.preventDefault();

          const video = self.elements.container.querySelector('video');
          if (video) {
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }
        }
      });
    },

    // logic to run after context-specific initialization
    post = function() {

      if (! self.options) {
        return;
      }

      if (self.options.hasOwnProperty('class')) {
        self.elements.container.classList.add(self.options.class);
      }

      const curtains = self.elements.container.querySelector('.' + PREFIX + 'curtains');
      window.setTimeout(function() {
        if (curtains && curtains.parentNode) {
          curtains.parentNode.removeChild(curtains);
        }
      }, 200);


      const but = RMR.Node.create('button', { class: PREFIX + 'dismiss', title: localize('close')} );
      but.innerHTML = localize('close');
      self.elements.container.appendChild(but);
      but.addEventListener('click', dismiss);
      but.focus();

      const resizer = function() {

        if (! self || ! self.options) {
          return;
        }

        let resize = false;

        const
        aspect = self.options.hasOwnProperty('aspect') ? self.options.aspect : self.options.hasOwnProperty('size') ? self.options.size.width / self.options.size.height : 0,
        buffer = MOBILE ? 0 : 0.20, // portion of window that should be padding around modal
        modalSize = { width: 0, height: 0},
        windowSize = { width: window.innerWidth, height: window.innerHeight },
        verticalLimiter = (window.innerWidth / window.innerHeight) > aspect ? true : false;

        // set size via aspect ratio that fits in browser window
        if (self.options.hasOwnProperty('aspect')) {
          resize = true;
          if (verticalLimiter) {
            modalSize.height = (windowSize.height - windowSize.height * buffer);
            modalSize.width = modalSize.height * aspect;
          } else {
            modalSize.width = (windowSize.width - windowSize.width * buffer);
            modalSize.height = modalSize.width / aspect;
          }

        // set size via options parameters
        } else if (self.options.hasOwnProperty('size')) {

          resize = true;
          modalSize.width = self.options.size.width;
          modalSize.height = self.options.size.height;

        } else {
          const section = self.elements.container.querySelector('section.' + PREFIX + 'section');
          if (section) {
            section.style.maxHeight = parseInt(window.getComputedStyle(self.elements.container).height, 10)  + 'px';
          }

        }
        // undefined sizing behaviour

        if (resize) {
          self.elements.container.style.right = '';
          self.elements.container.style.width = modalSize.width + 'px';
          self.elements.container.style.height = modalSize.height + 'px';
          self.elements.container.style.left = (windowSize.width - modalSize.width) / 2 + 'px';
          self.elements.container.style.top = (windowSize.height - modalSize.height) / 2 + 'px';

          // position svg loader
          const svg = self.elements.container.querySelector('svg.rmr-loader');
          if (svg) {
            svg.style.left = (modalSize.width - 40) / 2  + 'px';
            svg.style.top = (modalSize.height - 40) / 2  + 'px';
          }
        }
      };

      resizer();
      self.resizeListener = window.addEventListener('resize', resizer);

      document.body.classList.add(PREFIX + 'open');
      if (self.options.hasOwnProperty('class')) {
        self.elements.container.classList.add(self.options.class);
      }

      self.elements.bg.addEventListener('click', dismiss);
      window.setTimeout(() => {
        if (! self) {
          return;
        }
        if (self.elements.container) {
          self.elements.container.classList.add(PREFIX + 'focus');
          if (MOBILE) {
            self.elements.container.classList.add(PREFIX + 'mobile');
          }
        }

        if (self.options && self.options.hasOwnProperty('on') && self.options.on.hasOwnProperty('show')) {
          self.options.on.show(self.elements.container, self.options);
        }
      }, 100);

      self.elements.container.appendChild(document.createComment('Created by modal - https://github.com/davidfmiller/modal '));
    };

    if (this.options.iframe) {

      init();

      const
      iframe = '<iframe src="' + this.options.iframe  + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

      self.elements.container.classList.add(PREFIX + 'iframe');
      self.elements.container.innerHTML = iframe;

      post();

    } else if (this.options.url) {

      init();

      self.elements.container.classList.add(PREFIX + 'loading');

      addCurtains(self.elements.container);

      self.elements.container.querySelector('svg').addEventListener('click', () => {
        self.remove();
      });

      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {

        if (this.readyState === 4) {
          if (this.status === 200) {
            if (self.elements.container) {
              self.elements.container.classList.add(PREFIX + 'node');
              self.elements.container.classList.remove(PREFIX + 'loading');
              self.elements.container.innerHTML = '<section class="' + PREFIX + 'section">' + this.responseText + '</section>';
              post();
            }
          } else {
// TODO
          }
        }
      };

      window.setTimeout(function () {
        if (self.options) {
          xhttp.open(self.options.hasOwnProperty('method') ? self.options.method : 'get', self.options.url, true);
          xhttp.send();
        }
      }, 200);

    } else if (this.options.image) {

      init();

      self.elements.container.classList.add(PREFIX + 'loading');

      const image = RMR.Node.create('img', this.options.attrs);

      addCurtains(self.elements.container);

      image.onload = () => {
        self.elements.container.classList.remove(PREFIX + 'loading');
        post();
      };

      window.setTimeout(function() {
        image.srcset = RMR.Node.isa(self.options.image) ? (self.options.image.srcset ? self.options.image.srcset : self.options.image.src) : self.options.image;
      }, 200);

      self.elements.container.appendChild(image);

      if (this.options.title) {
        image.setAttribute('title', this.options.title);
      }

      if (this.options.link) {
        image.setAttribute('data-rmr-link', this.options.link.url);
        image.addEventListener('click', e => {
          e.preventDefault();
          window.open(this.options.link);
        });
      }

    } else if (this.options.video) {

      init();

      self.elements.container.classList.add(PREFIX + 'loading');

      const video = RMR.Node.create('video', this.options.attrs);
      video.setAttribute('tabindex', -1);
      for (const i in this.options.video) {
        if (this.options.video.hasOwnProperty(i)) {
          const source = RMR.Node.create('source', { type: i, src: this.options.video[i] });
          video.appendChild(source);
        }
      }

      addCurtains(self.elements.container);

      video.addEventListener('loadeddata', () => {
        window.setTimeout(function() {
          self.elements.container.classList.remove(PREFIX + 'loading');
        }, 400);
      });

      self.elements.container.appendChild(video);
      post();

    } else if (this.options.node) {

      init();

      const node = RMR.Node.get(this.options.node);

      if (! node) {
        throw new Error('Invalid node for modal :' + node);
        return;
      }

      self.elements.container.classList.add(PREFIX + 'node');

      self.elements.container.innerHTML = '<section class="' + PREFIX + 'section">' + node.innerHTML + '</section>';
      post();

    } else if (this.options.html) {

      init();

      const container = self.elements.container;

      container.classList.add(PREFIX + 'node');
      container.innerHTML = '<section class="' + PREFIX + 'section">' + this.options.html + '</section>';

      const section = container.querySelector('section');
      if (this.options.title) {
        section.setAttribute('title', this.options.title);
      }

      if (this.options.link) {
        
        section.setAttribute('data-rmr-link', this.options.link);
        section.addEventListener('click', e => {
          e.preventDefault();
          window.open(this.options.link);
        });
      }

      post();

    } else if (this.options.youtube || this.options.vimeo) {

      const clip = getClipID(this.options.youtube ? this.options.youtube : this.options.vimeo);

      init();

      const
      player = this.options.hasOwnProperty('youtube') ? 'https://www.youtube.com/embed/' : 'https://player.vimeo.com/video/',
      iframe = '<iframe src="' + player + (clip ? clip : '')  + (this.options.autoplay ? '?autoplay=1' : '') + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

      self.elements.container.classList.add(PREFIX + 'video');
      self.elements.container.innerHTML = iframe;
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

    if (self.elements.blur && self.elements.blur.childNodes) {
      while (self.elements.blur.childNodes.length > 0) {
        const n = self.elements.blur.firstChild;
        RMR.Node.remove(n);
        document.body.appendChild(n);
      }
      document.body.removeChild(self.elements.blur);
    }


    if (self.elements.container) {
      self.elements.container.classList.remove(PREFIX + 'focus');
    }
    if (self.elements.bg) {
      self.elements.bg.classList.add(PREFIX + 'dismiss');
    }

    document.body.classList.remove(PREFIX + 'open');

    // fire `remove` event, if provided
    if (self.options && self.options.hasOwnProperty('on') && self.options.on.hasOwnProperty('remove')) {
      self.options.on.remove(self.elements.container, self.options);
    }

    // remove event listeners
    window.removeEventListener('resize', self.resizeListener);
    document.removeEventListener('keydown', self.keyListener);

    window.setTimeout(
      function timeout() {
        if (! self) {
          return;
        }

        if (self.elements.bg) {
          document.body.removeChild(self.elements.bg);
        }
        if (self.elements.container) {
          document.body.removeChild(self.elements.container);
        }
        self.resizeListener = self.keyListener = self.options = null;
        self.elements = { container: null, bg: null };
      }, 200
    );

    return this;
  };

  module.exports = {
    Modal: Modal,
    clip: getClipID
  };

})();
