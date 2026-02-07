import { Ticker } from '../Ticker';

describe('Ticker tests', () => {

  beforeEach(async () => {
    jest.useFakeTimers();
    await jest.advanceTimersByTimeAsync(Math.trunc(Math.random() * 1000000));
    await Promise.resolve();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("The ticker starts ticking immediately after it has been started", async () => {

    const callback = jest.fn();
    const ticker = new Ticker(200, callback);
    
    ticker.start();

    await jest.runOnlyPendingTimersAsync();
    expect(callback).toHaveBeenCalled();

    ticker.stop();
  });

  test("The ticker only ticks when it has been started", async () => {

    const callback = jest.fn();
    const ticker = new Ticker(200, callback);
    
    await jest.advanceTimersByTimeAsync(300);
    await Promise.resolve();
    expect(callback).not.toHaveBeenCalled();

    ticker.start();

    await jest.advanceTimersByTimeAsync(300);
    await Promise.resolve();
    expect(callback).toHaveBeenCalled();
    
    ticker.stop();

  });

  test("The ticker no longer ticks after it has been stopped", async () => {

    const callback = jest.fn();
    const ticker = new Ticker(200, callback);
    
    ticker.start();

    await jest.advanceTimersByTimeAsync(300);
    await Promise.resolve();
    expect(callback).toHaveBeenCalledTimes(2);
    
    ticker.stop();
    await Promise.resolve();

    await jest.advanceTimersByTimeAsync(300);
    await Promise.resolve();
    expect(callback).toHaveBeenCalledTimes(2);

  });

  test.each<{ interval: number, ticks: number }>([
    { interval: 10, ticks: 101 },
    { interval: 20, ticks: 51 },
    { interval: 50, ticks: 21 },
    { interval: 100, ticks: 11 },
    { interval: 250, ticks: 5 },
    { interval: 500, ticks: 3 },
    { interval: 1000, ticks: 2 }
  ])('The ticker ticks $ticks times at an interval of $interval milliseconds in 1001 milliseconds', async d => {
    
    const callback = jest.fn();
    const ticker = new Ticker(d.interval, callback);
    
    ticker.start();

    await jest.advanceTimersByTimeAsync(1000);
    
    ticker.stop();

    await Promise.resolve();
    expect(callback).toHaveBeenCalledTimes(d.ticks);

  });

  
  test.each<{ interval: number }>([
    { interval: 10 },
    { interval: 20 },
    { interval: 50 },
    { interval: 100 },
    { interval: 250 }
  ])('The ticker ticks at an interval of $interval milliseconds', async d => {
    
    const callback = jest.fn();
    const ticker = new Ticker(d.interval, callback);
    let times = 1;
    
    ticker.start();
    
    for (let i = 0; i < 5; i++) {

      await jest.advanceTimersByTimeAsync(d.interval - 1);
      await Promise.resolve();
    
      expect(callback).toHaveBeenCalledTimes(times);

      await jest.advanceTimersByTimeAsync(1);
      await Promise.resolve();

      times++;

      expect(callback).toHaveBeenCalledTimes(times);
    }

    ticker.stop();
  });

  test("The ticker hardly drifted away at all", async () => {

    const calls: number[] = [];
    const interval = 50;
    const end = performance.now() + 2 * interval + 4;
    let delay = Math.trunc(interval / 7);

    const callback = jest.fn(async () => {
      calls.push(performance.now());
      await jest.advanceTimersByTimeAsync(delay);
      delay *= 2;
    });

    const ticker = new Ticker(interval, callback)
    ticker.start();
    
    while (performance.now() < end) {
      await jest.advanceTimersByTimeAsync(1);
      await Promise.resolve();
    }

    ticker.stop();

    expect(calls).toHaveLength(3);

    const delta1 = calls[1] - calls[0];
    const delta2 = calls[2] - calls[1];
    const deltaTotal = calls[2] - calls[0];

    expect(delta1).toBeGreaterThanOrEqual(interval - 1);
    expect(delta1).toBeLessThanOrEqual(interval + 1);

    expect(delta2).toBeGreaterThanOrEqual(interval - 1);
    expect(delta2).toBeLessThanOrEqual(interval + 1);

    expect(deltaTotal).toBeGreaterThanOrEqual(2 * interval - 1);
    expect(deltaTotal).toBeLessThanOrEqual(2 * interval + 1);

  });
});