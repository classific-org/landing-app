/**
 * One shared scroll loop for every scroll-linked effect (parallax, heading drift, header tone,
 * the page thread). Each frame it runs every subscriber's `read` first and only then every
 * `write`, so layout is read once and never re-flushed between writes. Independent handlers
 * that each read a rect and then write a style force the browser to recalculate layout several
 * times per frame, which is what makes long pages stutter.
 */
type Subscriber = { read: () => unknown; write: (value: never) => void };

const subscribers = new Set<Subscriber>();
let frame = 0;
let listening = false;

function flush() {
    frame = 0;
    const active = [...subscribers];
    const values = active.map((subscriber) => subscriber.read());
    active.forEach((subscriber, index) => subscriber.write(values[index] as never));
}

/** Asks for a flush on the next frame; calls made before it runs are coalesced. */
export function requestScrollFrame() {
    if (frame === 0 && typeof window !== "undefined") {
        frame = requestAnimationFrame(flush);
    }
}

/**
 * Subscribes an effect to the shared loop. `read` may touch layout (rects, offsets, scroll
 * position); `write` receives its result and should only write styles or attributes.
 * Returns the unsubscribe function.
 */
export function subscribeToScroll<T>(read: () => T, write: (value: T) => void): () => void {
    const subscriber: Subscriber = { read, write: write as (value: never) => void };
    subscribers.add(subscriber);
    if (!listening) {
        listening = true;
        window.addEventListener("scroll", requestScrollFrame, { passive: true });
        window.addEventListener("resize", requestScrollFrame, { passive: true });
    }
    requestScrollFrame();

    return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && listening) {
            listening = false;
            window.removeEventListener("scroll", requestScrollFrame);
            window.removeEventListener("resize", requestScrollFrame);
            cancelAnimationFrame(frame);
            frame = 0;
        }
    };
}
