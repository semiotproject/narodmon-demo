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
                parseObservations(observations).done((obs) => {
                    this.observations = this.mergeObservations(obs);
                    console.log(`data after merge: `, this.observations);
                    promise.resolve(this.observations);
                    // this.subscribe();
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
