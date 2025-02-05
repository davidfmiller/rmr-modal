/*
 * JS initialization for the index page
 */
document.addEventListener('DOMContentLoaded', function(event) {

//  window.Man({ pre: true } );

  var

  //
  modal = null,

  // common init function, used by all
  init = function(args) {
    if (modal) { modal.remove(true); }
    modal = new Modal(arguments[0]);
    modal.show();
  },

  youtube = function() {
    init({
      youtube: 'sNaR1JRNayU',
      blur: true,
      size: { width: 400, height: 225 }
    });
  },

  vimeo = function() {
    init({
      vimeo: 'https://vimeo.com/175289264',
      aspect: 966 / 405,
      autoplay: 0
    });
  },

  videoScale = function() {
    init({
      video: {
        'video/mp4': 'assets/video.mp4',
        'video/ogg': 'assets/video.ogv',
        'video/webm': 'video/webm'
      },
      attrs: { muted: 'muted', autoplay: 'autoplay', loop: 'loop', controls: 'true' },
      on: {
        show: function() { console.log('video playing'); },
        remove: function() { console.log('video removed'); }
      },
      aspect: 560 / 320
    });
  },

  videoFixed = function() {
    init({
      video: {
        'video/mp4': 'assets/video.mp4',
        'video/ogg': 'assets/video.ogv',
        'video/webm': 'video/webm'
      },
      blur: true,
      attrs: { muted: 'muted', autoplay: 'autoplay', loop: 'loop', controls: 'true' },
      size: { width: 560, height: 320 }
    });
  },

  reference = function() {
    init({
      node: document.querySelector('#node-reference')
    });
  },

  selector = function() {
    init({
      node: '#node-selector',
      aspect: 3 / 2,
      z: 3,
      on : {
        show : function(container) {
        console.log(arguments);
          container.querySelector('footer button').addEventListener('click', function(e) {
            modal.remove();
          });
        }
      }
    });
  },

  html = function() {
    init({
      html: '<h1>Markup Modal</h1><p>This modal is generated by a string containing markup.</p>',
      class: 'random-class'
    });
  },

  htmlLink = function() {
    init({
      link: 'https://dfmllc.ca',
      title: 'LLC',
      html: '<h1>Markup Modal</h1><p>This modal is generated by a string containing markup.</p>',
      class: 'random-class'
    });
  },


  iframe = function() {
    init({
      iframe: 'https://photos.dfmllc.ca',
      aspect: 16 / 9,
      blur: true
//      size: { width: 560, height: 320 }

//      html: '<h1>Markup Modal</h1><p>This modal is generated by a string containing markup.</p>',
//      class: 'random-class'
    });
  },

  image = function() {
    init({
      image: 'assets/image.jpg',
      aspect : 3 / 2
    });
  },

  imageLink = function() {
    init({
      image: 'assets/image.jpg',
      link: 'https://dfmllc.ca',
      aspect : 3 / 2,
      title: 'LLC'
    });
  },


  xhr = function() {
    init ({
      url: 'xhr.html',
      class: 'xhr-class',
      on: {
        show: function(options) { console.log('show', options); },
        remove: function(options) { console.log('remove', options); }
      }
    });
  };

  var xhrbut = document.querySelector('.xhr');
  if (document.location.protocol == 'file:') {
//    xhrbut.setAttribute('disabled', 1);
  }

  // attach event listeners for example buttons
  document.querySelector('.youtube').addEventListener('click', youtube);
  document.querySelector('.vimeo').addEventListener('click', vimeo);
  document.querySelector('.reference').addEventListener('click', reference);
  document.querySelector('.selector').addEventListener('click', selector);
  document.querySelector('.html').addEventListener('click', html);
  document.querySelector('.html-link').addEventListener('click', htmlLink);
  document.querySelector('button.video-scale').addEventListener('click', videoScale);
  document.querySelector('button.video-fixed').addEventListener('click', videoFixed);
  document.querySelector('button.image').addEventListener('click', image);
  document.querySelector('button.image-link').addEventListener('click', imageLink);
  document.querySelector('button.iframe').addEventListener('click', iframe);
  xhrbut.addEventListener('click', xhr);

  // attach key listener for keyboard shortcuts
  document.addEventListener('keydown', function escapeLisenter(event) {

//    console.log(event.keyCode);

    switch (event.keyCode) {
      case 49: // 1
        youtube();
        break;
      case 50: // 2
        vimeo();
        break;
      case 51: // 3
        reference();
        break;
      case 52: // 4
        selector();
        break;
      case 53: // 5
        html();
        break;
      case 54: // 6
        xhr();
        break;
      case 55: // 7
        videoScale();
        break;
      case 56: // 8
        videoFixed();
        break;
      case 57: // 9
        image();
        break;

      default:
        //
    }
  });
});
