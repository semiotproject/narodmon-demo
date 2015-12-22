"use strict";

import { EventEmitter } from 'events';
import { loadLastObservations } from '../utils/analyzing-service';
import wamp from '../utils/wamp';
import { parseObservations } from '../utils/turtle';
import CONFIG from '../config';
import { loadLocations } from '../utils/sparql';
import $ from 'jquery';

const MAX_INTENSITY = 0.5;
const MID_INTENSITY = 0.25;
const MIN_INTENSITY = 0.1;

class ObservationStore extends EventEmitter {
    constructor() {
        super();
        this.observations = {};
    }
    get() {
        return this.observations;
    }
    load() {
        const promise = $.Deferred();
        this.loadSensors().done(() => {
            loadLastObservations().done((observations) => {
                const promises = [];
                observations.map((observation) => {
                    const localPromise = $.Deferred();
                    parseObservations(observation.events).done((result) => {
                        this.observations[observation.created] = this.normalizeObservations(this.mergeObservations(result));
                        // console.log(`data after merge for timestamp ${observation.created}: `, this.observations[observation.created]);
                        localPromise.resolve();
                    });
                    promises.push(localPromise);
                });
                $.when(...promises).done(() => {
                    // finally, resolve basic promise
                    promise.resolve(this.observations);
                    this.subscribe();
                });
            });
        });
        return promise;
    }
    mergeObservations(obs) {
        return obs.map((o) => {
            if (!this.sensors[o.sensor]) {
                console.error(`found observation for sensor ${o.sensor}, but no location for it. WTF?`);
                return null;
            }
            return $.extend({}, this.sensors[o.sensor], o);
        }).filter((o) => { return o; });
    }

    // set correct `intensity` value
    normalizeObservations(obs) {

        // find max diff module
        const maxDiff = {
            lead: 0,
            rest: 0
        };
        obs.map((o) => {
            if ((o.group === 1 && o.avg > 0) || (o.group === 2 && o.avg < 0)) {
                o.lead = true;
                if (Math.abs(o.diff) > maxDiff['lead']) {
                    maxDiff['lead'] = Math.abs(o.diff);
                }
            } else {
                if (Math.abs(o.diff) > maxDiff['rest']) {
                    maxDiff['rest'] = Math.abs(o.diff);
                }
            }
        });

        // normalize observations
        obs.forEach((o, index) => {
            let intensity;
            if (o.lead) {
                if (maxDiff['lead'] === 0) {
                    intensity = 0;
                } else {
                    intensity = Math.abs((o.diff * (MAX_INTENSITY - MID_INTENSITY) / maxDiff['lead']) + MID_INTENSITY);
                }
            } else {
                if (maxDiff['rest'] === 0) {
                    intensity = 0;
                } else {
                    intensity = Math.abs((o.diff * (MID_INTENSITY - MIN_INTENSITY) / maxDiff['rest']) + MIN_INTENSITY);
                }
            }
            obs[index] = {
                x: o.location.lat,
                y: o.location.lng,
                color: o.avg > 0 ? "red" : "blue",
                group: o.group,
                avg: o.avg,
                temp: o.temp,
                diff: o.diff,
                intensity
            };
        });
        return obs;
    }
    loadSensors() {
        const promise = $.Deferred();

        loadLocations().done((res) => {
            this.sensors = {};
            res.results.bindings.map((b) => {
                this.sensors[b.meter.value] = {
                    location: {
                        lat: parseFloat(b.lat.value),
                        lng: parseFloat(b.lng.value)
                    }
                };
            });
            console.log('found sensors: ', this.sensors);
            promise.resolve();
        });
        return promise;
    }
    getSnapshotForTimestamp(timestamp) {
        console.info(`finding snapshot for ${new Date(timestamp)}`);
        let result = null;
        Object.keys(this.observations).map((key, index) => {
            if (!result && parseInt(key) > timestamp) {
                result = key;
            }
        });
        if (result === null) {
            // setting last snapshot
            result = Object.keys(this.observations)[Object.keys(this.observations).length - 1];
        }
        console.log(`result is ${new Date(parseInt(result))}`);
        return result;
    }
    getObservationsForSnapshot(snapshot) {
        return this.observations[snapshot];
    }
    getAvgForSnapshot(snapshot) {
        if (!this.observations[snapshot] || this.observations[snapshot].length === 0) {
            return null;
        }
        return this.observations[snapshot][0].avg;
    }
    getTempForSnapshot(snapshot) {
        if (!this.observations[snapshot] || this.observations[snapshot].length === 0) {
            return null;
        }
        return this.observations[snapshot].reduce((a, b) => {
            return a + b.temp;
        }, 0) / this.observations[snapshot].length;
    }
    subscribe() {
        wamp.subscribe(CONFIG.TOPICS.observations, (message) => {
            console.info(`received message: ${JSON.stringify(message)}`);
            parseObservations(message).done((result) => {
                this.observations[Date.now()] = this.normalizeObservations(this.mergeObservations(result));
                this.emit('newObservation');
            });
        });
    }
}

export default new ObservationStore();
