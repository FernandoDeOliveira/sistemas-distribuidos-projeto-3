const PROTO_PATH = "./room.proto";

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).room;

const roomList = [];


function is_available(room, date_in, date_out){

    var days_in = room.checkins;
    var days_out = room.checkouts;

    for (var index=0; index < days_in.length; index++){

        if (index + 1 == days_in.length){
            if (date_in > days_out[index]){
                return true
            }
        }

        else if (date_in > days_out[index] && 
            date_in< days_in[index + 1] &&
            date_out < days_in[index + 1]) {
                return true            
        }
    }
    return false
}

function getRooms(call, callback) {
    // get all rooms
    callback(null, {rooms: roomList});
}

function getRoom(call, callback) {
   const pos = call.request.position;
   callback(null, roomList[pos])
}

function availableDates(call, callback) {
    const room = roomList[call.request.position]
    console.log(room);
    callback(null, {
        room: room
        });
}

function createRoom(call, callback) {
    const room = {
        suit: call.request.suit,
        max_people: call.request.max_people,
        wifi: call.request.wifi,
        checkins: call.request.checkins,
        checkouts: call.request.checkouts
    };

    roomList.push(room);

    callback(null, {})
}

function bookRoom(call, callback) {
    var pos = call.request.position

    var room = roomList[pos]
    var date_in = call.request.date_in
    var date_out = call.request.date_out

    if (is_available(room, date_in, date_out)){
        roomList[pos].checkins.push(date_in)
        roomList[pos].checkins.sort()

        roomList[pos].checkouts.push(date_out)
        roomList[pos].checkouts.sort()
        console.log("Checking Done");
        callback(null, {msg: "Checkin done"})
    }

    else{
        console.log("Room is booked in this days")
        callback(null, {msg: "Room is booked in this days"})
    }

}

const server = new grpc.Server();

server.addService(protoDescriptor.RoomServices.service,
    {
        GetRooms: getRooms,
        GetRoom: getRoom,
        CreateRoom: createRoom,
        BookRoom: bookRoom,
        AvailableDates: availableDates,
    });

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

server.start();
