import openSocket from 'socket.io-client';
import cccCurrent from 'ccc-current';

const socket = openSocket('http://localhost:6969/streamers');

const subscribeToExchange = (callback) => {
    socket.on('connect', () => {
        console.log('connected!');
    });

    socket.on('2', (currentData) => {
        const unpackedData = cccCurrent.unpack(`2~${currentData}`);

        console.log(unpackedData)
        
        callback(unpackedData);
    });
};

const unsubscribeFromExchange = () => {
    socket.disconnect();
};

export { subscribeToExchange, unsubscribeFromExchange };