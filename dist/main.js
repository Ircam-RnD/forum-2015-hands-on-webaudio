'use strict';

var _Object$defineProperties = require('babel-runtime/core-js/object/define-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

var _wavesAudio = require('waves-audio');

var _wavesAudio2 = _interopRequireDefault(_wavesAudio);

var audioCtx = _wavesAudio2['default'].audioContext;

var synth = _Object$defineProperties({
  init: function init() {
    var master = audioCtx.createGain();
    master.connect(audioCtx.destination);
    master.gain.value = 0.3;

    var filter = audioCtx.createBiquadFilter();
    filter.connect(master);
    filter.Q.value = 12;
    filter.frequency.value = 500;

    this.filter = filter;
    this.osc = null;

    this.filterFreqMin = 20;
    this.filterFreqMax = 16000;
    this.filterFreqRatio = Math.log(this.filterFreqMax / this.filterFreqMin);
  },
  start: function start() {
    if (!this.osc) {
      var osc = audioCtx.createOscillator();
      osc.connect(this.filter);
      osc.type = 'sawtooth';
      osc.frequency.value = 200;
      osc.start(audioCtx.currentTime);

      this.osc = osc;
    }
  },
  stop: function stop() {
    if (this.osc) {
      this.osc.stop(audioCtx.currentTime);
      this.osc = null;
    }
  }
}, {
  cutoff: {
    set: function set(freq) {
      this.filter.frequency.value = freq;
    },
    configurable: true,
    enumerable: true
  },
  q: {
    set: function set(freq) {
      this.filter.Q.value = freq;
    },
    configurable: true,
    enumerable: true
  }
});

window.addEventListener('DOMContentLoaded', function () {
  synth.init();

  // buttons
  var $startButton = document.querySelector('#start-button');
  $startButton.addEventListener('click', function (e) {
    synth.start();
  });

  var $stopButton = document.querySelector('#stop-button');
  $stopButton.addEventListener('click', function (e) {
    synth.stop();
  });

  // sliders
  var $filterFreq = document.querySelector('#filter-freq');
  $filterFreq.addEventListener('input', function (e) {
    synth.cutoff = $filterFreq.value;
  }, false);

  var $filterQ = document.querySelector('#filter-q');
  $filterQ.addEventListener('input', function (e) {
    synth.q = $filterQ.value;
  }, false);

  // sensor input
  _motionInput2['default'].init('orientation').then(function (modules) {
    // es6 arrow function
    var orientation = modules[0];

    if (orientation.isValid) {
      _motionInput2['default'].addListener('orientation', function (values) {
        // es6 arrow function
        var pitch = values[1];
        var normPitch = 1 - Math.abs(pitch / 180);
        var clippedPitch = Math.min(1, Math.max(0, normPitch));
        var freq = synth.filterFreqMin * Math.exp(synth.filterFreqRatio * clippedPitch);

        synth.cutoff = freq;
        $filterFreq.value = freq; // move slider

        var roll = values[2];
        var normRoll = 0.5 + roll / 90;
        var clippedRoll = Math.min(1, Math.max(0, normRoll));
        var q = clippedRoll * 24;

        synth.q = q;
        $filterQ.value = q; // move slider
      });
    } else {
        console.log('orientation not available');
      }
  })['catch'](function (err) {
    console.error(err);
  });
});
//# sourceMappingURL=data:application/json;base64,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Qzs7QUFFbEYsYUFBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDcEIsbUJBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUV6QixZQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsWUFBTSxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDakMsWUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN2RCxZQUFNLENBQUMsR0FBRyxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUUzQixhQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztPQUNwQixDQUFDLENBQUM7S0FDSixNQUFNO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO09BQzFDO0dBQ0YsQ0FBQyxTQUNJLENBQUMsVUFBUyxHQUFHLEVBQUU7QUFDbkIsV0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNwQixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiZXM2L21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0JztcbmltcG9ydCBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5jb25zdCBhdWRpb0N0eCA9IGF1ZGlvLmF1ZGlvQ29udGV4dDtcblxuY29uc3Qgc3ludGggPSB7XG4gIGluaXQoKSB7XG4gICAgY29uc3QgbWFzdGVyID0gYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuICAgIG1hc3Rlci5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbiAgICBtYXN0ZXIuZ2Fpbi52YWx1ZSA9IDAuMztcblxuICAgIGNvbnN0IGZpbHRlciA9IGF1ZGlvQ3R4LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgIGZpbHRlci5jb25uZWN0KG1hc3Rlcik7XG4gICAgZmlsdGVyLlEudmFsdWUgPSAxMjtcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gNTAwO1xuXG4gICAgdGhpcy5maWx0ZXIgPSBmaWx0ZXI7XG4gICAgdGhpcy5vc2MgPSBudWxsO1xuXG4gICAgdGhpcy5maWx0ZXJGcmVxTWluID0gMjA7XG4gICAgdGhpcy5maWx0ZXJGcmVxTWF4ID0gMTYwMDA7XG4gICAgdGhpcy5maWx0ZXJGcmVxUmF0aW8gPSBNYXRoLmxvZyh0aGlzLmZpbHRlckZyZXFNYXggLyB0aGlzLmZpbHRlckZyZXFNaW4pO1xuICB9LFxuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMub3NjKSB7XG4gICAgICBjb25zdCBvc2MgPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICBvc2MuY29ubmVjdCh0aGlzLmZpbHRlcik7XG4gICAgICBvc2MudHlwZSA9ICdzYXd0b290aCc7XG4gICAgICBvc2MuZnJlcXVlbmN5LnZhbHVlID0gMjAwO1xuICAgICAgb3NjLnN0YXJ0KGF1ZGlvQ3R4LmN1cnJlbnRUaW1lKTtcblxuICAgICAgdGhpcy5vc2MgPSBvc2M7XG4gICAgfVxuICB9LFxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLm9zYykge1xuICAgICAgdGhpcy5vc2Muc3RvcChhdWRpb0N0eC5jdXJyZW50VGltZSk7XG4gICAgICB0aGlzLm9zYyA9IG51bGw7XG4gICAgfVxuICB9LFxuICBzZXQgY3V0b2ZmKGZyZXEpIHtcbiAgICB0aGlzLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBmcmVxO1xuICB9LFxuICBzZXQgcShmcmVxKSB7XG4gICAgdGhpcy5maWx0ZXIuUS52YWx1ZSA9IGZyZXE7XG4gIH0sXG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICBzeW50aC5pbml0KCk7XG5cbiAgLy8gYnV0dG9uc1xuICBjb25zdCAkc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQtYnV0dG9uJyk7XG4gICRzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBzeW50aC5zdGFydCgpO1xuICB9KTtcblxuICBjb25zdCAkc3RvcEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdG9wLWJ1dHRvbicpO1xuICAkc3RvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBzeW50aC5zdG9wKCk7XG4gIH0pO1xuXG4gIC8vIHNsaWRlcnNcbiAgY29uc3QgJGZpbHRlckZyZXEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmlsdGVyLWZyZXEnKTtcbiAgJGZpbHRlckZyZXEuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihlKSB7XG4gICAgc3ludGguY3V0b2ZmID0gJGZpbHRlckZyZXEudmFsdWU7XG4gIH0sIGZhbHNlKTtcblxuICBjb25zdCAkZmlsdGVyUSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmaWx0ZXItcScpO1xuICAkZmlsdGVyUS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBzeW50aC5xID0gJGZpbHRlclEudmFsdWU7XG4gIH0sIGZhbHNlKTtcblxuICAvLyBzZW5zb3IgaW5wdXRcbiAgbW90aW9uSW5wdXRcbiAgICAuaW5pdCgnb3JpZW50YXRpb24nKVxuICAgIC50aGVuKChtb2R1bGVzKSA9PiB7IC8vIGVzNiBhcnJvdyBmdW5jdGlvblxuICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSBtb2R1bGVzWzBdO1xuXG4gICAgICBpZiAob3JpZW50YXRpb24uaXNWYWxpZCkge1xuICAgICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignb3JpZW50YXRpb24nLCAodmFsdWVzKSA9PiB7IC8vIGVzNiBhcnJvdyBmdW5jdGlvblxuICAgICAgICAgIGNvbnN0IHBpdGNoID0gdmFsdWVzWzFdO1xuICAgICAgICAgIGNvbnN0IG5vcm1QaXRjaCA9IDEgLSBNYXRoLmFicyhwaXRjaCAvIDE4MCk7XG4gICAgICAgICAgY29uc3QgY2xpcHBlZFBpdGNoID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgbm9ybVBpdGNoKSk7XG4gICAgICAgICAgY29uc3QgZnJlcSA9IHN5bnRoLmZpbHRlckZyZXFNaW4gKiBNYXRoLmV4cChzeW50aC5maWx0ZXJGcmVxUmF0aW8gKiBjbGlwcGVkUGl0Y2gpO1xuXG4gICAgICAgICAgc3ludGguY3V0b2ZmID0gZnJlcTtcbiAgICAgICAgICAkZmlsdGVyRnJlcS52YWx1ZSA9IGZyZXE7IC8vIG1vdmUgc2xpZGVyXG5cbiAgICAgICAgICBjb25zdCByb2xsID0gdmFsdWVzWzJdO1xuICAgICAgICAgIGNvbnN0IG5vcm1Sb2xsID0gMC41ICsgcm9sbCAvIDkwO1xuICAgICAgICAgIGNvbnN0IGNsaXBwZWRSb2xsID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgbm9ybVJvbGwpKTtcbiAgICAgICAgICBjb25zdCBxID0gY2xpcHBlZFJvbGwgKiAyNDtcblxuICAgICAgICAgIHN5bnRoLnEgPSBxO1xuICAgICAgICAgICRmaWx0ZXJRLnZhbHVlID0gcTsgLy8gbW92ZSBzbGlkZXJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnb3JpZW50YXRpb24gbm90IGF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xufSk7XG4iXX0=