'use strict';

const io = require('socket.io-client');
require('dotenv').config();
const HOST = process.env.HOST || 'http://localhost:3000';

let deliverySystem = io.connect(`${HOST}/caps`);

let data = { }


deliverySystem.emit('join', data)
const addStore = (val) => {
    data[`${val}`] = {'delivered': []}
    console.log("ADD STORE =====: ", data)
}

deliverySystem.on('join', payload => {
    if(!Object.keys(data).includes(payload)){addStore(payload)}
    if(data[`${payload}`].delivered.length > 0){
        deliverySystem.to(payload).emit('catchup', data[`${payload}`])
    }
})

deliverySystem.on('catched-up', payload => {
    // emit to whatever you want here
    data[`${payload.delivered[0].storeName}`] =  {'delivered': []}
});

deliverySystem.on('delivered', payload => {
    // emit to whatever you want here
    data[`${payload.storeName}`].delivered.push(payload)
});

deliverySystem.on('confirmed', payload => {
    // console.log("confirmed: ", payload)
    data[`${payload.storeName}`].delivered = track[`${payload.storeName}`].delivered.filter(el => {
        if (el.orderId !== payload.orderId) return el
    })
    // console.log("DELETED?======:", track[`${payload.storeName}`])
})