/**
 * Detects the most significant frequency in an FFT output
 * @public
 */
export interface IPitchDetector {

    name: string;

    detectPitch(buffer: Float32Array, sampleRate: number): number;
}

