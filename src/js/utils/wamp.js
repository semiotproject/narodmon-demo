import autobahn from 'autobahn';

export default {
    subscribe(topic, callback) {
        const connection = new autobahn.Connection({
            url: 'ws://localhost:8080/ws',
            realm: 'tutorialpubsub'}
        );
        connection.onopen = function (session) {
            session.subscribe(topic, callback);
        };

        connection.open();
    }
};