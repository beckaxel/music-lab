import { SemitoneSpan } from "./SemitoneSpan";

/**
 * A Note
 * @public
 */
export class Note {

    public readonly semitone: number;
    public readonly octave: number;
    public readonly isNatural: boolean;

    constructor(public readonly midiNote: number) {

        const semitoneSpan = new SemitoneSpan(midiNote);

        this.semitone = semitoneSpan.remaindingSemitones;
        this.octave = semitoneSpan.spannedOctaves - 1;
        this.isNatural = this.semitone % 2 === (this.semitone < 5 ? 0 : 1);
    }

    public add(value: SemitoneSpan): Note {
        return new Note(this.midiNote + value.totalSemitones);
    }

    public subtract(value: SemitoneSpan): Note;
    public subtract(value: Note): SemitoneSpan;
    public subtract(value: SemitoneSpan | Note): Note | SemitoneSpan {
        return value instanceof Note
            ? new SemitoneSpan(this.midiNote - value.midiNote)
            : new Note(this.midiNote - value.totalSemitones);
    }
}