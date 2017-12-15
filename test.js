/* global describe, it */

const
  chai = require('chai'),
  clip = require(__dirname + '/src/scripts/clip'),
//  assert = chai.assert,
  expect = chai.expect;

describe('Video Clip ID', function() {

  it('clip', function extensionFor() {

    expect(clip('abc')).to.equal('abc');

    // youtube watch & continue
      expect(clip('https://www.youtube.com/watch?time_continue=3&v=ybFrhA9waJs')).to.equal('ybFrhA9waJs');
      expect(clip('http://www.youtube.com/watch?time_continue=3&v=ybFrhA9waJs')).to.equal('ybFrhA9waJs');

     // vimeo player
     expect(clip('https://player.vimeo.com/video/244264989')).to.equal('244264989');
     expect(clip('http://player.vimeo.com/video/244264989')).to.equal('244264989');

     // youtube embed
     expect(clip('https://www.youtube.com/embed/sNaR1JRNayU/?autoplay=1')).to.equal('sNaR1JRNayU');
     expect(clip('http://www.youtube.com/embed/sNaR1JRNayU?autoplay=1')).to.equal('sNaR1JRNayU');

     // vimeo staff picks
     expect(clip('https://vimeo.com/channels/staffpicks/247423335')).to.equal('247423335');
     expect(clip('http://vimeo.com/channels/staffpicks/247423335')).to.equal('247423335');

     // vimeo clip
     expect(clip('https://vimeo.com/247423335')).to.equal('247423335');
     expect(clip('http://vimeo.com/247423335')).to.equal('247423335');

     // vimeo account
     expect(clip('https://vimeo.com/davidfmiller')).to.equal(null);
     expect(clip('http://vimeo.com/davidfmiller/')).to.equal(null);

 });
});
