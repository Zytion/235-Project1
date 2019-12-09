//set up resources
let meat;
let wood;
let stone;
let ore;
//population
let maxPopulation = 1;
let workingPopulation = 0;
let population = 1;
let populationPerTick = 60000;

let hunters;
let miners;
let lumberjacks;

//day and time
let time;
//build
let houses;
let mineshafts;
let lumberyards;
let lodges;
//upgrades
let hunterUpgrade;
let recruiters;
let townmasters;
let upgradeNames = ["Novice", "Junior", "Veteran", "Master", "Grandmaster"];
let pickaxes;
let hatchets;
let spears;
let toolUpgradeNames = ["Stone", "Iron", "Steel", "Titanium", "Diamond"];
//list of sayings
let sayings = ["Welcome to Meat Clicker", "Get started by clicking on the meat."]
let buildButtons;
let upgradeButtons;

window.onload = () => {
    buildButtons = document.querySelectorAll(".buildButton");
    upgradeButtons = document.querySelectorAll(".upgradeButton");

    gameSetUp();
}

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
        //population
        hunters = new Population("Hunter", 0);
        miners = new Population("Miner", 0);
        lumberjacks = new Population("Lumberjack", 0);
        //Upgrades
        hunterUpgrade = new Upgrade("HunterUpgrade", [50, 50, 50], 0)
        recruiters = new Upgrade("Recruiter", [30, 50, 30], 0);
        townmasters = new Upgrade("Townmaster", [30, 50, 30], 0);
        pickaxes = new Upgrade("Pickaxe", [30, 50, 30], 0);
        hatchets = new Upgrade("Hatchet", [30, 50, 30], 0);
        spears = new Upgrade("Spear", [25, 10, 5], 0);
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
        let lumberyardStorage = JSON.parse(localStorage.getItem("Lumberyard"));
        lumberyards = new Structure("Lumberyard", lumberyardStorage.resourceNeeded, lumberyardStorage.count);
        let lodgeStorage = JSON.parse(localStorage.getItem("Lodge"));
        lodges = new Structure("Lodges", lodgeStorage.resourceNeeded, lodgeStorage.count);
        //population
        let hunterStorage = JSON.parse(localStorage.getItem("Hunter"));
        hunters = new Population("Hunter", hunterStorage.count);

        let minerStorage = JSON.parse(localStorage.getItem("Miner"));
        miners = new Population("Miner", minerStorage.count);
        let lumberjackStorage = JSON.parse(localStorage.getItem("Lumberjack"));
        lumberjacks = new Population("Lumberjack", lumberjackStorage.count);

        //upgrades
        let hunterUpgradeStorage = JSON.parse(localStorage.getItem("HunterUpgrade"));
        hunterUpgrade = new Upgrade("HunterUpgrade", hunterUpgradeStorage.resourceNeeded, hunterUpgradeStorage.count);
        let recruiterStorage = JSON.parse(localStorage.getItem("Recruiter"));
        recruiters = new Upgrade("Recruiter", recruiterStorage.resourceNeeded, recruiterStorage.count);
        let townmasterStorage = JSON.parse(localStorage.getItem("Townmaster"));
        townmasters = new Upgrade("Townmaster", townmasterStorage.resourceNeeded, townmasterStorage.count);
        let pickaxeStorage = JSON.parse(localStorage.getItem("Pickaxe"));
        pickaxes = new Upgrade("Pickaxe", pickaxeStorage.resourceNeeded, pickaxeStorage.count);
        let hatchetStorage = JSON.parse(localStorage.getItem("Hatchet"));
        hatchets = new Upgrade("Hatchet", hatchetStorage.resourceNeeded, hatchetStorage.count);
        let spearStorage = JSON.parse(localStorage.getItem("Spear"));
        spears = new Upgrade("Spear", spearStorage.resourceNeeded, spearStorage.count);
    }

    //remember to remove this later
    meat.resourcesPerTick = 0;

    document.querySelector('#meatButton').addEventListener('click', clickMeat);

    for (let b of buildButtons) {
        b.addEventListener("click", buildClicked);
    }

    buildButtons[0].querySelector("div").innerHTML = GetResources(houses);
    buildButtons[1].querySelector("div").innerHTML = GetResources(mineshafts);
    buildButtons[2].querySelector("div").innerHTML = GetResources(lumberyards);
    buildButtons[3].querySelector("div").innerHTML = GetResources(lodges);

    for (let u of upgradeButtons) {
        u.addEventListener("click", upgradeClicked);
    }

    upgradeButtons[0].querySelector("div").innerHTML = GetResources(hunterUpgrade);
    upgradeButtons[1].querySelector("div").innerHTML = GetResources(recruiters);
    upgradeButtons[2].querySelector("div").innerHTML = GetResources(townmasters);
    upgradeButtons[3].querySelector("div").innerHTML = GetResources(pickaxes);
    upgradeButtons[4].querySelector("div").innerHTML = GetResources(hatchets);
    upgradeButtons[5].querySelector("div").innerHTML = GetResources(spears);

    // set ticks
    let tickerUpdating = setInterval(tickerLoop, 200);
    let peopleUpdating = setInterval(lookForPeople, populationPerTick);

    setInterval(gameLoop, 200);
}
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

function gameLoop() {

    //check for meat clicks

    //check for clicks on build

    //check for clicks on upgrades

    //check for clicks on population
    lookForPeople();
    //Update labels
    updateLabels();
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

let buildClicked = (e) => {
    let i;
    let str = "";
    switch (e.target.dataset.build) {
        case "house":
            buildStructure(houses);
            str = GetResources(houses);
            i = 0;
            break;
        case "mine":
            buildStructure(mineshafts);
            str = GetResources(mineshafts);
            i = 1;
            break;
        case "lumber":
            buildStructure(lumberyards);
            str = GetResources(lumberyards);
            i = 2;
            break;
        case "lodge":
            buildStructure(lodges);
            str = GetResources(lodges);
            i = 3;
            break;
    }
    buildButtons[i].querySelector("div").innerHTML = str;
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

function GetResources(e) {
    let str = "";
    if (e.resourceNeeded[0] > 0) {
        str += "Wood: " + e.resourceNeeded[0];
    }
    if (e.resourceNeeded[1] > 0) {
        str += ", Stone: " + e.resourceNeeded[1];
    }
    if (e.resourceNeeded[2] > 0) {
        str += ", Ore: " + e.resourceNeeded[2];
    }
    return str;
}

let upgradeClicked = (e) => {
    let i;
    let str = "";
    switch (e.target.dataset.upgrade) {
        case "hunter":
            upgradeTool(hunterUpgrades);
            str += GetResources(hunterUpgrades);
            i = 0;
            break;
        case "recruit":
            upgradeTool(recruiters);
            str += GetResources(recruiters);
            i = 1;
            break;
        case "townmaster":
            upgradeTool(townmasters);
            str += GetResources(townmasters);
            i = 2;
            break;
        case "pickaxe":
            upgradeTool(pickaxes);
            str += GetResources(pickaxes);
            i = 3;
            break;
        case "hatchet":
            upgradeTool(hatchets);
            str += GetResources(hatchets);
            i = 4;
            break;
        case "spear":
            upgradeTool(spears);
            str += GetResources(spears);
            i = 5;
            break;
    }
    upgradeButtons[i].querySelector("div").innerHTML = str;
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

function updateLabels() {
    let resourceValues = document.querySelectorAll('.resourceValue');
    resourceValues[0].innerHTML = meat.amount;
    resourceValues[1].innerHTML = wood.amount;
    resourceValues[2].innerHTML = stone.amount;
    resourceValues[3].innerHTML = ore.amount;

    let populationLabel = document.querySelector("h3");
    populationLabel.innerHTML = population + "/" + maxPopulation;

    let timeStamp = document.querySelectorAll("h4");
    timeStamp[0].innerHTML = "Day: " + Math.trunc(time.days);
    timeStamp[1].innerHTML = "Time: " + Math.trunc(time.hours) + ":";
    if (Math.trunc(time.minutes) < 10)
        timeStamp[1].innerHTML += "0" + Math.trunc(time.minutes);
    else
        timeStamp[1].innerHTML += Math.trunc(time.minutes);

    let popValues = document.querySelectorAll(".popValue");
    popValues[0].innerHTML = hunters.count;
    popValues[1].innerHTML = miners.count;
    popValues[2].innerHTML = lumberjacks.count;

}

function changeJobs(e) {
    switch (e.dataset.type) {
        case "hunter":

            break;
        case "miner":
            break;
        case "lumber":
            break;
    }
}