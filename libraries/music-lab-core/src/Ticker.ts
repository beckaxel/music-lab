/**
 * Called on every tick
 * @public
 */
export type TickCallback = () => void | Promise<void>

/**
 * A ticking thing
 * @public
 */
export class Ticker {
  
    private nextTick: number | null;
    private timeoutId: number | null;

    constructor(
        public readonly interval: number, 
        private readonly callback: TickCallback
    ) {
        this.nextTick = null;
        this.timeoutId = null;
    }

    public start() {
        if (this.nextTick !== null)
            return;

        this.nextTick = performance.now();
        this.scheduleNext();
    }

    public stop() {
        if (this.nextTick === null)
            return;

        this.nextTick = null;
        if (this.timeoutId === null)
            return;
        
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }

    private scheduleNext() {
        if (this.nextTick === null) 
            return;

        const delay = Math.max(0, this.nextTick - performance.now());
        this.timeoutId = setTimeout(async () => {
            if (this.nextTick === null) 
                return;

            await Promise.resolve(this.callback());
            this.nextTick += this.interval;
            this.scheduleNext();
        }, delay);
    }
}
