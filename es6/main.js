import motionInput from 'motion-input';
import audio from 'waves-audio';
const audioCtx = audio.audioContext;

const synth = {
  init() {
    const master = audioCtx.createGain();
    master.connect(audioCtx.destination);
    master.gain.value = 0.3;

    const filter = audioCtx.createBiquadFilter();
    filter.connect(master);
    filter.Q.value = 12;
    filter.frequency.value = 500;

    this.filter = filter;
    this.osc = null;

    this.filterFreqMin = 20;
    this.filterFreqMax = 16000;
    this.filterFreqRatio = Math.log(this.filterFreqMax / this.filterFreqMin);
  },
  start() {
    if (!this.osc) {
      const osc = audioCtx.createOscillator();
      osc.connect(this.filter);
      osc.type = 'sawtooth';
      osc.frequency.value = 200;
      osc.start(audioCtx.currentTime);

      this.osc = osc;
    }
  },
  stop() {
    if (this.osc) {
      this.osc.stop(audioCtx.currentTime);
      this.osc = null;
    }
  },
  set cutoff(freq) {
    this.filter.frequency.value = freq;
  },
  set q(freq) {
    this.filter.Q.value = freq;
  },
};

window.addEventListener('DOMContentLoaded', function() {
  synth.init();

  // buttons
  const $startButton = document.querySelector('#start-button');
  $startButton.addEventListener('click', function(e) {
    synth.start();
  });

  const $stopButton = document.querySelector('#stop-button');
  $stopButton.addEventListener('click', function(e) {
    synth.stop();
  });

  // sliders
  const $filterFreq = document.querySelector('#filter-freq');
  $filterFreq.addEventListener('input', function(e) {
    synth.cutoff = $filterFreq.value;
  }, false);

  const $filterQ = document.querySelector('#filter-q');
  $filterQ.addEventListener('input', function(e) {
    synth.q = $filterQ.value;
  }, false);

  // sensor input
  motionInput
    .init('orientation')
    .then((modules) => { // es6 arrow function
      const orientation = modules[0];

      if (orientation.isValid) {
        motionInput.addListener('orientation', (values) => { // es6 arrow function
          const pitch = values[1];
          const normPitch = 1 - Math.abs(pitch / 180);
          const clippedPitch = Math.min(1, Math.max(0, normPitch));
          const freq = synth.filterFreqMin * Math.exp(synth.filterFreqRatio * clippedPitch);

          synth.cutoff = freq;
          $filterFreq.value = freq; // move slider

          const roll = values[2];
          const normRoll = 0.5 + roll / 90;
          const clippedRoll = Math.min(1, Math.max(0, normRoll));
          const q = clippedRoll * 24;

          synth.q = q;
          $filterQ.value = q; // move slider
        });
      } else {
        console.log('orientation not available');
      }
    })
    .catch(function(err) {
      console.error(err);
    });
});
