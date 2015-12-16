import { EventEmitter } from 'events';
import ObservationStore from './observations-store';

const state = {
    currentTime: Date.now(),
    currentSnapshot: null,
    isPlaying: false
};

const TIME_BOUNDS = [
    Date.now() - 12 * 3600 * 1000,
    Date.now()
];

// every ten minutes
const PLAY_UPDATE_INTERVAL = 1000 * 60 * 10;

const PLAY_UPDATE_PERIOD = 1000;

let PLAY_TIMER = null;

class AppStateStore extends EventEmitter {
    constructor() {
        super();
    }

    get currentTime() {
        return state.currentTime;
    }
    set currentTime(timestamp) {
        if (this.isInBounds(timestamp)) {
            state.currentTime = timestamp;
            this.checkSnapshot(timestamp);
            this.emit('update');
        } else {
            console.warn(`new timestamp is out of bounds; stopping play`);
            this.isPlaying = false;
        }
    }

    get isPlaying() {
        return state.isPlaying;
    }
    set isPlaying(flag) {
        state.isPlaying = flag;
        if (flag) {
            this.startPlaying();
        } else {
            this.stopPlaying();
        }
        this.emit('update');
    }

    get currentSnapshot() {
        return state.currentSnapshot;
    }
    set currentSnapshot(timestamp) {
        state.currentSnapshot = timestamp;
        this.emit('update');
    }

    checkSnapshot(timestamp = state.currentTime) {
        state.currentSnapshot = ObservationStore.getSnapshotForTimestamp(timestamp);
    }

    startPlaying() {
        if (PLAY_TIMER) {
            this.stopPlaying();
        }
        PLAY_TIMER = setInterval(() => {
            this.currentTime += PLAY_UPDATE_INTERVAL;
        }, PLAY_UPDATE_PERIOD);
    }
    stopPlaying() {
        clearInterval(PLAY_TIMER);
        PLAY_TIMER = null;
    }

    get timeBounds() {
        return TIME_BOUNDS;
    }
    isInBounds(timestamp) {
        return TIME_BOUNDS[0] < timestamp && TIME_BOUNDS[1] > timestamp;
    }
}

export default new AppStateStore();
