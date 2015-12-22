import autobahn from 'autobahn';

const MESSAGE = `

`;

export default {
    subscribe(topic, callback) {
        console.log(`subscribing on WAMP topic ${topic}..`);
        const connection = new autobahn.Connection({
            url: 'ws://demo-1.semiot.ru:8080/ws',
            realm: 'realm1'
        });
        connection.onopen = function (session) {
            console.log(`WAMP connecttion opened`);
            session.subscribe(topic, callback);
            /*
            setInterval(() => {
                callback(MESSAGE);
            }, 2000);
*/
        };

        connection.open();
    }
};