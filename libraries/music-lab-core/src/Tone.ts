/**
 * A Tone
 * @public
 */

class Tone {

    public readonly semitone: number;
    public readonly octave: number;
    public readonly isNaturalNote: boolean;

    constructor(public readonly midiNote: number) {

        this.semitone = midiNote % 12;
        this.octave = Math.floor(midiNote / 12 - 1);
        this.isNaturalNote = this.semitone % 2 === (this.semitone < 5 ? 0 : 1);
    }
}

export default Tone;