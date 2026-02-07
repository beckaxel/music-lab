import { IPitchDetector } from "./IPitchDetector";

/**
 * The ACF2Plus algorithm
 * @public
 */
export const ACF2PlusPitchDetector: IPitchDetector = {

    name: "ACF2+",

    detectPitch(buffer: Float32Array, sampleRate: number): number {
    
        let size = buffer.length;
                
        const threshold = 0.2;
        const center = size / 2;
        
        let left = 0;
        for (let i = 0; i < center; i++) { 
            if (Math.abs(buffer[i]) < threshold) { 
                left = i;
                break; 
            } 
        }
    
        let right = size - 1;
        for (let i = right; i > center; i--) { 
            if (Math.abs(buffer[i]) < threshold) { 
                right = i; 
                break; 
            }
        }

        buffer = buffer.slice(left, right);
        size = buffer.length;

        const c = new Array(size);
        for (let i = 0; i < size; i++)
            c[i] = 0;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size - i; j++) {
                c[i] = c[i] + buffer[j] * buffer[j + i];
            }
        }

        let d = 0; 
        while (c[d] > c[d + 1]) 
            d++;

        let max = -1;
        let t0 = -1;
        for (let i = d; i < size; i++) {
            if (c[i] > max) {
                max = c[i];
                t0 = i;
            }
        }

        const x1 = c[t0 - 1];
        const x2 = c[t0];
        const x3 = c[t0 + 1];
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        if (a)
            t0 = t0 - b / (2 * a); 

        return sampleRate / t0;
    }
}