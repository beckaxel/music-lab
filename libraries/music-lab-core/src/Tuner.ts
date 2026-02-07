import { IPitch } from "./IPitch";
import { IPitchDetector } from "./IPitchDetector";
import { ACF2PlusPitchDetector } from "./PitchDetectors";
import { Tuning } from "./Tuning";

/**
 * A Tuner
 * @public
 */
export class Tuner {

    private pitch: IPitch | null;
    private rms: number;

    constructor(
        public readonly sampleRate: number,
        public readonly rmsThreshold: number = 0.01,
        public readonly pitchDetector: IPitchDetector = ACF2PlusPitchDetector,
        public readonly tuning: Tuning = new Tuning()
    ) { 
        this.pitch = null;
        this.rms = 0;
    }

    public getPitch(): IPitch | null {
        return this.pitch;
    }

    public getRms(): number {
        return this.rms;
    }

    public next(buffer: Float32Array): boolean {
        this.rms = this.detectRms(buffer);
        if (this.rms < this.rmsThreshold) {
            this.pitch = null;
            return false;
        }
            
        const frequency = this.detectFrequency(buffer);
        this.pitch = this.tuning.getPitch(frequency);
        return true;
    }

    private detectRms(buffer: Float32Array): number {
    
        let size = buffer.length;
        
        let rms = 0;
        for (let i = 0; i < size; i++)
            rms += Math.pow(buffer[i], 2);
        rms = Math.sqrt(rms / size);

        return rms;
    }

    private detectFrequency(buffer: Float32Array): number {
        return this.pitchDetector.detectPitch(buffer, this.sampleRate);
    }
}
