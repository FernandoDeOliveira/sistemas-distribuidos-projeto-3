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

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).room;

const client = new protoDescriptor.RoomServices('127.0.0.1:50051',
                                    grpc.credentials.createInsecure());

client.CreateRoom({suit: "yes",
                    max_people: "10",
                    wifi: "no",
                    checkins: [1, 7, 17, 21],
                    checkouts: [6, 10, 20, 24]
                    },
                    function(err, response) {
                        if (err != null) {
                            console.log("Something go wrong when invocated CreateBook");
                            return;
                        }    
    console.log("Book created successfully");

    
    client.CreateRoom({suit: "no",
                        max_people: "5",
                        wifi: "yes",
                        checkins: [1, 10, 15, 25],
                        checkouts: [4, 12, 20, 29],
                    }, 
                    function(err, response) {
        // verifica se ocorreu algum erro na comunicação
        if (err != null) {
            console.log("Something go wrong when invocated CreateBook");
            return;
        }

        console.log("Book created successfully");

        
        

    client.BookRoom({position: 1, date_in: 35, date_out:45}, function(err, response){
        if (err != null){
            console.log("Something go wrong when invocated BookRoom");
            return
        }

        console.log(response.msg);
        
    });

    client.AvailableDates({position: 1}, function(err, response){
        if (err != null){
            console.log("Something go wrong when invocated AvailableDates");
            return
        }
        

        });

    client.GetRooms({}, function(err, response) {
        if (err != null) {
            console.log("Something go wrong when invocated GetRooms");
            return;
        }
    
        console.log(" >>>>> Rooms' List: " + JSON.stringify(response.rooms) );
    });

    client.GetRoom({position: 1}, function(err, response) {
        if (err != null) {
            console.log("Something go wrong when invocated GetRooms");
            return;
        }
    
        console.log(">>> room 1: "+ JSON.stringify(response));
    });


});


});



