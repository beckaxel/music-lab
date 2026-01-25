import Tone from '../Tone';

describe('ToneTest', () => {
  it('make things correct', () => {
    expect((new Tone(45)).octave).toBe(2);
  });
});