/**
 * A range of semitones
 * @public
 */
export class SemitoneSpan {
    
    public readonly totalSemitones: number;
    public readonly spannedOctaves: number;
    public readonly remaindingSemitones: number;

    constructor(semitones: number);
    constructor(octaves: number, semitones: number);
    constructor(arg1: number, arg2?: number) { 
         if (typeof arg2 === 'number') {
            this.spannedOctaves = arg1;
            this.remaindingSemitones = arg2;
            this.totalSemitones = this.spannedOctaves * 12 + this.remaindingSemitones;
         } 
         else {
            this.totalSemitones = arg1;
            this.spannedOctaves = this.totalSemitones > 0 
                ? Math.floor(this.totalSemitones / 12)
                : Math.ceil(this.totalSemitones / 12) || 0;
            this.remaindingSemitones = this.totalSemitones % 12 || 0;
            
         }
    }
}