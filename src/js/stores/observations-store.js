"use strict";

import { EventEmitter } from 'events';
import { loadLastObservations } from '../utils/analyzing-service';
import wamp from '../utils/wamp';
import { parseObservations } from '../utils/turtle';
import CONFIG from '../config';
import { loadLocations } from '../utils/sparql';
import $ from 'jquery';

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
                        this.observations[observation.created] = this.mergeObservations(result).map(this.normalizeObservation);
                        // console.log(`data after merge for timestamp ${observation.created}: `, this.observations[observation.created]);
                        localPromise.resolve();
                    });
                    promises.push(localPromise);
                });
                $.when(...promises).done(() => {
                    // finally, resolve basic promise
                    promise.resolve(this.observations);
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
    normalizeObservation(obs) {
        // TODO
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
    subscribe() {
        wamp.subscribe(CONFIG.TOPICS.observations, (message) => {
            console.info(`received message: ${JSON.stringify(message)}`);
            parseObservations(message).done((obs) => {
                console.info(`parsed observations: ` + obs);
                this.observations = obs;
                this.emit('update');
            });
        });
    }
}

export default new ObservationStore();
