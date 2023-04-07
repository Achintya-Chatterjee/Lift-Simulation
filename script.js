const floorHeightInPx = getComputedStyle(document.querySelector("html")).getPropertyValue("--floor-height");
const floorHeight = parseInt(floorHeightInPx.slice(0,floorHeightInPx.length - 2));
let liftsCount,floorsCount;
const liftsAvailability = new Map();
const liftAt = new Map();
const floorLiftMap = new Map();
const pendingCalls = [];


document.querySelector("button#submit").addEventListener("click",(event)=>{
    event.preventDefault();

    const floorsInput = document.querySelector("#floors_input");
    const liftsInput = document.querySelector("#lifts_input");
    floorsCount =  floorsInput.value;
    liftsCount = liftsInput.value;

    if(floorsCount <=0 || floorsCount > 100 || liftsCount <=0 || liftsCount > 10){
        alert("Inputs are invalid! Please Try Again.");
        return;
    }

    const inputBox = document.querySelector("#input_box");
    inputBox.style.display = "none";
    

    // user can see their entered floors and lifts count

    const floorsCountContainer = document.querySelector("#floors_count");
    const liftsCountContainer = document.querySelector("#lifts_count");
    floorsCountContainer.textContent = `Floors count - ${floorsCount}`;
    liftsCountContainer.textContent = `Lifts count - ${liftsCount}`;


renderFloors(floorsCount);
renderLifts(liftsCount);

});

function handleLiftCall(event){
    const calledFloor = event?.path[2];
    const floorId = calledFloor.id;
    if (floorLiftMap.get(floorId) != null) {
        const mappedLiftId = floorLiftMap.get(floorId);
        if (liftsAvailability.get(mappedLiftId)) {
            liftsAvailability.set(mappedLiftId, false);
            openAndCloseDoors(floorId, mappedLiftId);
        }
        return;
    }
    for(let lifNumber = 1; liftNumber <= liftsCount; liftNumber++){
        const liftId = `lift-${lifNumber}`;
        if (liftsAvailability.get(liftId)) {
            moveLift(floorId, liftId);
            return;
        }
    }
    pendingCalls.push(floorId);
};