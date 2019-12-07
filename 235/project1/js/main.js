//set up resources
let meat;
let wood;
let stone;
let ore;
//population
let maxPopulation = 0;
let population = 0;
let populationPerTick = 60000;
//day and time
let time;
//build
let houses;
let mineshafts;
let lumberyards;
let lodges;
//upgrades
let hunterUpgrades = 0;
let recruiterUpgrades = 0;
let townmasterUpgrades = 0;
let upgradeNames = ["Novice", "Junior", "Veteran", "Master", "Grandmaster"];
//tool upgrades
let pickaxes = 0;
let hatchets = 0;
let spears = 0;
let toolUpgradeNames = ["Stone", "Iron", "Steel", "Titanium", "Diamond"];
//list of sayings
let sayings = ["Welcome to Meat Clicker", "Get started by clicking on the meat."]

//set up game
function gameSetUp() {
    //if the localStorage of meat is null, set up game
    if (localStorage.getItem("Meat") == null) {
        //set up resources
        meat = new Resources("Meat", 0, .1);
        wood = new Resources("Wood", 0, 0);
        stone = new Resources("Stone", 0, 0);
        ore = new Resources("Ore", 0, 0);
        //set up time
        time = new Time(0, 0);
        //set up buildings
        //resources in order is wood, stone, ore
        houses = new Structure("House", [10, 0, 0]);
        mineshafts = new Structure("Mineshaft", [30, 0, 0]);
        lumberyards = new Structure("Lumberyard", [30, 15, 5]);
        lodges = new Structure("Lodge", [30, 0, 15]);
    }
    //if there is meat in the local storage, set up the game if it has any values
    else {
        //resources
        let meatStorage = JSON.parse(localStorage.getItem("Meat"));
        meat = new Resources("Meat", meatStorage.amount, meatStorage.resourcesPerTick);
        let woodStorage = JSON.parse(localStorage.getItem("Wood"));
        wood = new Resources("Wood", woodStorage.amount, woodStorage.resourcesPerTick);
        let stoneStorage = JSON.parse(localStorage.getItem("Stone"));
        stone = new Resources("Stone", stoneStorage.amount, stoneStorage.resourcesPerTick);
        let oreStorage = JSON.parse(localStorage.getItem("Ore"));
        ore = new Resources("Ore", oreStorage.amount, oreStorage.resourcesPerTick);
        //time
        let timeStorage = JSON.parse(localStorage.getItem("Time"));
        time = new Time(timeStorage.ticks);
        //buildings
        let houseStorage = JSON.parse(localStorage.getItem("House"));
        houses = new Structure("House", houseStorage.resourceNeeded, houseStorage.count);
        let mineshaftStorage = JSON.parse(localStorage.getItem("Mineshaft"));
        mineshafts = new Structure("Mineshaft", mineshaftStorage.resourceNeeded, mineshaftStorage.count);
        let lumberyardStorage = JSON.parse(localStorage.getItem("Lumberyard", lumberyardStorage.resourceNeeded, lumberyardStorage.count));
        lumberyards = new Structure("Lumberyard", lumberyardStorage.resourceNeeded, lumberyardStorage.count);
        let lodgeStorage = JSON.parse(localStorage.getItem("Lodge"));
        lodges = new Structure("Lodges", lodgeStorage.resourceNeeded, lodgeStorage.count);
    }
}

gameSetUp();

//set up ticker loops
function tickerLoop() {
    //later change the amount resources per tick * structures + ((population + 1) * bonus)
    //for meat specifically, subtract .5 * people after
    meat.update(meat.resourcesPerTick);
    wood.update(wood.resourcesPerTick);
    stone.update(stone.resourcesPerTick);
    ore.update(ore.resourcesPerTick);

    time.update();
}
// set ticks
let tickUpdating = setInterval(tickerLoop, 200);
let peopleUpdating = setInterval(lookForPeople, populationPerTick)

function gameLoop() {
    //check for meat clicks

    //check for clicks on build
    
    //check for clicks on upgrades
    
    //check for clicks on population

    //generate notifications
}

function clickMeat(e) {
    meat.update(1);
}

function lookForPeople() {
    if (maxPopulation > population) {
        population++;
        sayings.push("You have gained a new person.");
    }
}

//build structure, if not enough resource, it will send alert and then return
function buildStructure(e) {
    if (e.resourceNeeded[0] > wood.amount) {
        //NO BUILD
        alert("You do not have enough wood.");
        return;
    }
    if (e.resourceNeeded[1] > stone.amount) {
        //NO BUILD
        alert("You do not have enough stone.");
        return;
    }
    if (e.resourceNeeded[2] > ore.amount) {
        //NO BUILD
        alert("You do not have enough ore.");
        return;
    }
    //otherwise, build structure
    e.build();
}

function upgradeTool(e) {
    if (e.resourceNeeded[0] > wood.amount) {
        //NO BUILD
        alert("You do not have enough wood.");
        return;
    }
    if (e.resourceNeeded[1] > stone.amount) {
        //NO BUILD
        alert("You do not have enough stone.");
        return;
    }
    if (e.resourceNeeded[2] > ore.amount) {
        //NO BUILD
        alert("You do not have enough ore.");
        return;
    }
    e.upgrade();
}