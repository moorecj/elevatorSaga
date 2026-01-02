{
    init: function(elevators, floors) {
        
        elevators.forEach(function(elevator) {
            elevator.on("floor_button_pressed", function(floorNum) { 
                //if(elevator.getPressedFloors().length == 2) {
                elevator.goToFloor(floorNum);
                //}
            });
            
            //elevator.on("idle", function() {
            //if(elevator.loadFactor > 0.8) {
            //elevator.goToFloor(elevator.getPressedFloors()[0].floorNum);
            //} 
            //});
        });
        
        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {
                elevators.forEach(function(elevator) {
                    //if(!elevator.goingDownIndicator()) {
                    elevator.goToFloor(floor.floorNum()); 
                    //}
                });
            });

            floor.on("down_button_pressed", function() {
                elevators.forEach(function(elevator) {
                    //if(!elevator.goingUpIndicator()) {
                    elevator.goToFloor(floor.floorNum()); 
                    //}
                });
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
        //elevators.forEach(function(elevator) {
        //     if(elevator.loadFactor > 0.1) {
        //         elevator.goToFloor(elevator.getPressedFloors()[0]);              
        //      }
        // });
    }
}