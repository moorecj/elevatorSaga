{
    init: function(elevators, floors) {

        function goToFloorIfNotInAnyQueue(elevator, elevators, floorNum) {
            if (floorNotInAnyQueue(elevators,floorNum)) {
                console.log(`Elevator ${elevator.ElevatorNum}  Going to floor ${floorNum}`);
                elevator.goToFloor(floorNum);
            }
        }

        function goToFloorIfNotInThisElevatorQueue(elevator, floorNum) {
            if (floorNotInThisElevatorQueue(elevators,floorNum)) {
                console.log(`Elevator ${elevator.ElevatorNum}  Going to floor ${floorNum}`);
                elevator.goToFloor(floorNum);
            }
        }
        
        function floorNotInThisElevatorQueue(elevator, floorNum){
            !elevator.destinationQueue.includes(floorNum);
        }

        function floorNotInAnyQueue(elevators, floorNum) {
            // returns true if no elevators are going to this floor at the moment
            return !elevators.some(elevator => elevator.destinationQueue.includes(floorNum));
        }

        var  floorGoingUpQueue = [];
        var  floorGoingDownQueue = [];
        var idleElevatorQueue =[];

        for(let i=0; i<elevators.length; i++){
            let elevator = elevators[i];
            elevator["ElevatorNum"] = i;
            elevator.on("idle", function() {
                if(floorGoingDownQueue.length>0){
                    const poppedFloor = floorGoingDownQueue.pop();
                    goToFloorIfNotInAnyQueue(elevator, elevators, poppedFloor);
                    return;
                }
                
                if(floorGoingUpQueue.length>0){
                    const poppedFloor = floorGoingUpQueue.pop();
                    goToFloorIfNotInAnyQueue(elevator, elevators, poppedFloor);
                    return;
                }

                idleElevatorQueue.push(elevator);

            });

            elevator.on("floor_button_pressed", function(floorNum) {
                console.log(`Elevator ${i} floor ${floorNum} pressed`);
                goToFloorIfNotInThisElevatorQueue(elevator, floorNum);
            });

            elevator.on("passing_floor", function(floorNum, direction) { 
                if(direction == 'down' && floorGoingDownQueue.includes(floorNum)){
                    floorGoingDownQueue = floorGoingDownQueue.filter(fn => fn != floorNum);
                    goToFloorIfNotInAnyQueue(elevator, elevators, floorNum);
                }
                else if(direction == 'up' && floorGoingUpQueue.includes(floorNum) ){   
                    floorGoingUpQueue = floorGoingDownQueue.filter(fn => fn != floorNum);
                    goToFloorIfNotInAnyQueue(elevator, elevators, floorNum);
                }
             });
        }

        for(let i=0; i<floors.length; i++){
            let floor = floors[i];
            floor.on("up_button_pressed", function() {
                if(idleElevatorQueue.length > 0 && floorNotInAnyQueue(elevators, floor.floorNum())){
                    var elevator = idleElevatorQueue.pop();
                    goToFloorIfNotInAnyQueue(elevator, elevators, floor.floorNum())
                    return;
                }
                if(!floorGoingUpQueue.includes(floor.floorNum()))
                    floorGoingUpQueue.push(floor.floorNum());
            });

            floor.on("down_button_pressed", function() { 
                if(idleElevatorQueue.length > 0 && floorNotInAnyQueue(elevators, floor.floorNum())){
                    var elevator = idleElevatorQueue.pop();
                    goToFloorIfNotInAnyQueue(elevator, elevators, floor.floorNum())
                    return;
                }

                if(!floorGoingDownQueue.includes(floor.floorNum()))
                    floorGoingDownQueue.push(floor.floorNum());
            });
        }

    },


    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}