import { ITemperament } from "./ITemperament";
import { EqualTemperament } from "./Temperaments";
import { Note } from "./Note";
import { SemitoneSpan } from "./SemitoneSpan";
import { IPitch } from "./IPitch";

/**
 * A specific Tuning
 * @public
 */
export class Tuning {

    private readonly semitoneToPositiveCentMap: number[];
    private readonly semitoneToNegativeCentMap: number[];

    constructor(
        public readonly tuningNote: Note = new Note(69),
        public readonly fundamentalFrequency: number = 440,
        public readonly temperament: ITemperament = EqualTemperament
    ) {
        this.semitoneToPositiveCentMap = [
            temperament.P1,
            temperament.m2,
            temperament.M2,
            temperament.m3,
            temperament.M3,
            temperament.P4,
            temperament.TT,
            temperament.P5,
            temperament.m6,
            temperament.M6,
            temperament.m7,
            temperament.M7,
            temperament.P8
        ];

        this.semitoneToNegativeCentMap = [
            temperament.P8 - 1200,
            temperament.M7 - 1200,
            temperament.m7 - 1200,
            temperament.M6 - 1200,
            temperament.m6 - 1200,
            temperament.P5 - 1200,
            temperament.TT - 1200,
            temperament.P4 - 1200,
            temperament.M3 - 1200,
            temperament.m3 - 1200,
            temperament.M2 - 1200,
            temperament.m2 - 1200,
            temperament.P8 - 1200
        ];
    }

    public getFrequency(note: Note): number {
        const semitoneDifference = note.subtract(this.tuningNote);
        const centDifference = this.convertSemitoneSpanToCents(semitoneDifference);
        return this.fundamentalFrequency * Math.pow(2, centDifference / 1200);
    }

    public getPitch(frequency: number): IPitch {
        const centDifference = 1200 * Math.log2(frequency / this.fundamentalFrequency);
        const [semitoneDifference, deviation] = this.convertCentsToSemitoneSpan(centDifference);
        return {
            note: this.tuningNote.add(semitoneDifference),
            frequency,
            deviation,
            temperament: this.temperament
        };
    }

    private convertSemitoneSpanToCents(value: SemitoneSpan): number {
        return value.spannedOctaves * 1200 + 
            (value.remaindingSemitones < 0 
                ? this.semitoneToNegativeCentMap[Math.abs(value.remaindingSemitones)] 
                : this.semitoneToPositiveCentMap[value.remaindingSemitones]);
    }

    private convertCentsToSemitoneSpan(value: number): [SemitoneSpan, number] {
        const octaves = value < 0 ? Math.ceil(value / 1200) : Math.floor(value / 1200);
        const semitoneCents = value % 1200;

        
        let semitones = 0;
        let deviation = 1200;
        let map = semitoneCents < 0 ? this.semitoneToNegativeCentMap : this.semitoneToPositiveCentMap;
        
        while (semitones < map.length) {
            const currentDeviation = semitoneCents - map[semitones];
            if (Math.abs(currentDeviation) >= Math.abs(deviation))
                break;
                
            deviation = currentDeviation;
            semitones++;
        }

        return [new SemitoneSpan(octaves, semitoneCents < 0 ? -(semitones - 1) : (semitones - 1)), deviation];
    }
}