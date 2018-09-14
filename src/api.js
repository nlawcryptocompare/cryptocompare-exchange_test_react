import openSocket from 'socket.io-client';
import cccCurrent from 'ccc-current';

const socket = openSocket('https://streamer.cryptocompare.com/');

var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '11~BTC', '11~ETH'];
	socket.emit('SubAdd', { subs: subscription });

const subscribeToExchange = (callback) => {
    socket.on('connect', () => {
        console.log('connected!');
    });

    socket.on('m', (data) => {
        const unpackedData = cccCurrent.unpack(data);
        
        callback(unpackedData);
    });
};

export { subscribeToExchange };