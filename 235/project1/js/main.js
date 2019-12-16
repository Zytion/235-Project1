//set up resources
let meat;
let wood;
let stone;
let ore;
//population
let maxPopulation = 1;
let population = 1;
localStorage.setItem("Population", population);
let populationPerTick = 60000;
let peopleUpdating;

//Jobs
let hunters;
let miners;
let lumberjacks;

let workingPopulation = 0;
let maxJobs = 0;

//day and time
let time;
//build
let houses;
let mineshafts;
let lumberyards;
let lodges;
//upgrades
let hunterUpgrades;
let recruiters;
let townmasters;
let upgradeNames = ["Novice", "Junior", "Veteran", "Master", "Grandmaster"];
let pickaxes;
let hatchets;
let spears;
let toolUpgradeNames = ["Stone", "Iron", "Steel", "Titanium", "Diamond"];
//list of sayings
let sayings = ["Hover over things for help", "Get started by clicking on the meat.", "Welcome to Meat Clicker"]
let buildButtons;
let upgradeButtons;
let jobUpButtons;
let jobDownButtons;

let tickManager = 0.05;

//let hasMedicine = false;
let eventTimer = 200000 + getRndInt(0, 70000);

let previousDay = 0;

window.onload = () => {
    buildButtons = document.querySelectorAll(".buildButton");
    upgradeButtons = document.querySelectorAll(".upgradeButton");
    jobUpButtons = document.querySelectorAll(".upArrow");
    jobDownButtons = document.querySelectorAll(".downArrow");
    gameSetUp();
}

//set up game
function gameSetUp() {
    //if the localStorage of meat is null, set up game
    if (localStorage.getItem("Meat") == null) {
        //#region Resources
        meat = new Resources("Meat", 0, 0);
        wood = new Resources("Wood", 0, 0);
        stone = new Resources("Stone", 0, 0);
        ore = new Resources("Ore", 0, 0);
        //#endregion

        //set up time
        time = new Time(0, 0);

        //#region Buildings
        //resources in order is wood, stone, ore
        houses = new Structure("House", [10, 0, 0], 0, 4, 0);
        mineshafts = new Structure("Mineshaft", [30, 0, 0]);
        lumberyards = new Structure("Lumberyard", [30, 15, 5]);
        lodges = new Structure("Lodge", [30, 0, 15]);
        //#endregion

        //#region Population
        hunters = new Population("Hunter", 0);
        miners = new Population("Miner", 0);
        lumberjacks = new Population("Lumberjack", 0);
        //#endregion

        //#region Upgrades
        hunterUpgrades = new Upgrade("HunterUpgrade", [50, 50, 50])
        recruiters = new Upgrade("Recruiter", [30, 50, 30]);
        townmasters = new Upgrade("Townmaster", [30, 50, 30]);
        pickaxes = new Upgrade("Pickaxe", [30, 50, 30]);
        hatchets = new Upgrade("Hatchet", [30, 50, 30]);
        spears = new Upgrade("Spear", [25, 10, 5]);
        //#endregion
    }
    //if there is meat in the local storage, set up the game if it has any values
    else {
        //#region Resources
        let meatStorage = JSON.parse(localStorage.getItem("Meat"));
        meat = new Resources("Meat", meatStorage.amount, meatStorage.resourcesPerTick);
        let woodStorage = JSON.parse(localStorage.getItem("Wood"));
        wood = new Resources("Wood", woodStorage.amount, woodStorage.resourcesPerTick);
        let stoneStorage = JSON.parse(localStorage.getItem("Stone"));
        stone = new Resources("Stone", stoneStorage.amount, stoneStorage.resourcesPerTick);
        let oreStorage = JSON.parse(localStorage.getItem("Ore"));
        ore = new Resources("Ore", oreStorage.amount, oreStorage.resourcesPerTick);
        //#endregion

        //time
        let timeStorage = JSON.parse(localStorage.getItem("Time"));
        time = new Time(timeStorage.ticks);

        //#region Buildings
        let houseStorage = JSON.parse(localStorage.getItem("House"));
        houses = new Structure("House", houseStorage.resourceNeeded, houseStorage.count, 4, 0);
        let mineshaftStorage = JSON.parse(localStorage.getItem("Mineshaft"));
        mineshafts = new Structure("Mineshaft", mineshaftStorage.resourceNeeded, mineshaftStorage.count);
        let lumberyardStorage = JSON.parse(localStorage.getItem("Lumberyard"));
        lumberyards = new Structure("Lumberyard", lumberyardStorage.resourceNeeded, lumberyardStorage.count);
        let lodgeStorage = JSON.parse(localStorage.getItem("Lodge"));
        lodges = new Structure("Lodge", lodgeStorage.resourceNeeded, lodgeStorage.count);
        //#endregion

        //#region Population
        let hunterStorage = JSON.parse(localStorage.getItem("Hunter"));
        hunters = new Population("Hunter", hunterStorage.count);
        let minerStorage = JSON.parse(localStorage.getItem("Miner"));
        miners = new Population("Miner", minerStorage.count);
        let lumberjackStorage = JSON.parse(localStorage.getItem("Lumberjack"));
        lumberjacks = new Population("Lumberjack", lumberjackStorage.count);

        let populationStorage = JSON.parse(localStorage.getItem("Population"));
        population = populationStorage;
        //#endregion

        //#region Upgrades
        let hunterUpgradeStorage = JSON.parse(localStorage.getItem("HunterUpgrade"));
        hunterUpgrades = new Upgrade("HunterUpgrade", hunterUpgradeStorage.resourceNeeded, hunterUpgradeStorage.count);
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
        //#endregion
    }

    //p = 5(houses + 2 * townmaster) + (mineshaft + lodges + lumberyards)(townmater / 5) + 1
    houses.housing = 5 * (houses.count + 2 * townmasters.count);
    mineshafts.housing = mineshafts.count * (townmasters.count / 5);
    lumberyards.housing = lumberyards.count * (townmasters.count / 5);
    lodges.housing = lumberyards.count * (townmasters.count / 5);

    //#region Setting Up Buttons

    //#region Build Buttons
    document.querySelector('#meatButton').addEventListener('click', clickMeat);

    for (let b of buildButtons) {
        b.addEventListener("click", buildClicked);

    }
    buildButtons[0].querySelector("div").innerHTML = GetResources(houses);
    buildButtons[0].querySelector(".counter").innerHTML = houses.count;

    buildButtons[1].querySelector("div").innerHTML = GetResources(mineshafts);
    buildButtons[1].querySelector(".counter").innerHTML = mineshafts.count;

    buildButtons[2].querySelector("div").innerHTML = GetResources(lumberyards);
    buildButtons[2].querySelector(".counter").innerHTML = lumberyards.count;

    buildButtons[3].querySelector("div").innerHTML = GetResources(lodges);
    buildButtons[3].querySelector(".counter").innerHTML = lodges.count;
    //#endregion

    //#region Upgrade Buttons
    for (let u of upgradeButtons) {
        u.addEventListener("click", upgradeClicked);
    }

    upgradeButtons[0].querySelector("div").innerHTML = GetResources(hunterUpgrades);
    upgradeButtons[0].querySelector(".counter").innerHTML = hunterUpgrades.count;

    upgradeButtons[1].querySelector("div").innerHTML = GetResources(recruiters);
    upgradeButtons[1].querySelector(".counter").innerHTML = recruiters.count;

    upgradeButtons[2].querySelector("div").innerHTML = GetResources(townmasters);
    upgradeButtons[2].querySelector(".counter").innerHTML = townmasters.count;

    upgradeButtons[3].querySelector("div").innerHTML = GetResources(pickaxes);
    upgradeButtons[3].querySelector(".counter").innerHTML = pickaxes.count;

    upgradeButtons[4].querySelector("div").innerHTML = GetResources(hatchets);
    upgradeButtons[4].querySelector(".counter").innerHTML = hatchets.count;

    upgradeButtons[5].querySelector("div").innerHTML = GetResources(spears);
    upgradeButtons[5].querySelector(".counter").innerHTML = spears.count;
    //#endregion

    //#region Population Control Buttons
    for (let up of jobUpButtons) {
        up.addEventListener("click", changeJobs);
    }
    for (let down of jobDownButtons) {
        down.addEventListener("click", changeJobs);
    }
    //#endregion

    //#endregion

    // set ticks
    setInterval(tickerLoop, 200);
    peopleUpdating = setInterval(lookForPeople, populationPerTick - (recruiters.count * 10000));
    setInterval(newEvent, eventTimer);

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

    feedPeople();

    gatherResources();

    updatePopulationValues();
    //Update labels
    updateLabels();
    //generate notifications
    updateNotifications();
}

function updatePopulationValues() {
    //p = 5(houses + 2 * townmaster) + (mineshaft + lodges + lumberyards)(townmater / 5) + 1
    maxPopulation = Math.trunc(houses.housing + mineshafts.housing + lodges.housing + lumberyards.housing + 1);

    workingPopulation = miners.count + lumberjacks.count + hunters.count;
    maxJobs = 4 * (mineshafts.count + lumberyards.count + lodges.count) + 3;
}

function lookForPeople() {
    if (maxPopulation > population && meat.amount > 0) {
        population++;
        localStorage.setItem("Population", population);
        sayings.push("You have gained a new person.");
    }
    if(maxPopulation < population)
    {
        population--;
        sayings.push("A person has left because they do not have housing!");
    }

    localStorage.setItem("Population", JSON.stringify(population));
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

function clickMeat(e) {
    meat.update(1 + (hunterUpgrades.count));
}

function updateNotifications() {
    let notificationList = document.querySelector("#notices");
    let str = "Day " + Math.trunc(time.days);

    while (sayings.length > 0) {
        let li = document.createElement("li");
        li.innerHTML = str + ": " + sayings.pop();
        notificationList.appendChild(li);
        notificationList.scrollTop = notificationList.scrollHeight;
    }
}

let buildClicked = (e) => {
    let i;
    let newResourceNeeded = "";
    let count = 0;
    switch (e.currentTarget.dataset.build) {
        case "house":
            buildStructure(houses);
            newResourceNeeded = GetResources(houses);
            houses.housing = 5 * (houses.count + 2 * townmasters.count);
            count = houses.count;
            i = 0;
            break;
        case "mine":
            buildStructure(mineshafts);
            newResourceNeeded = GetResources(mineshafts);
            mineshafts.housing = mineshafts.count * (townmasters.count / 5);
            count = mineshafts.count;
            i = 1;
            break;
        case "lumberyard":
            buildStructure(lumberyards);
            newResourceNeeded = GetResources(lumberyards);
            lumberyards.housing = lumberyards.count * (townmasters.count / 5);
            count = lumberyards.count;
            i = 2;
            break;
        case "lodge":
            buildStructure(lodges);
            newResourceNeeded = GetResources(lodges);
            lodges.housing = lodges.count * (townmasters.count / 5);
            count = lodges.count;
            i = 3;
            break;
    }
    buildButtons[i].querySelector("div").innerHTML = newResourceNeeded;
    buildButtons[i].querySelector(".counter").innerHTML = count;
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
    wood.spend(e.resourceNeeded[0]);
    stone.spend(e.resourceNeeded[1]);
    ore.spend(e.resourceNeeded[2]);
    e.build();
    sayings.push("You build a " + e.name + ".")
}

let upgradeClicked = (e) => {
    let i;
    let str = "";
    let count = 0;
    switch (e.currentTarget.dataset.upgrade) {
        case "hunter":
            upgradeTool(hunterUpgrades);
            str += GetResources(hunterUpgrades);
            count = hunterUpgrades.count;
            i = 0;
            break;
        case "recruiter":
            upgradeTool(recruiters);
            str += GetResources(recruiters);
            count = recruiters.count;
            clearInterval(peopleUpdating);
            peopleUpdating = setInterval(lookForPeople, populationPerTick - (recruiters.count * 10000));
            i = 1;
            break;
        case "townmaster":
            upgradeTool(townmasters);
            str += GetResources(townmasters);
            count = townmasters.count;
            i = 2;
            //Update max housing
            houses.housing = 5 * (houses.count + 2 * townmasters.count);
            mineshafts.housing = mineshafts.count * (townmasters.count / 5);
            lumberyards.housing = lumberyards.count * (townmasters.count / 5);
            lodges.housing = lumberyards.count * (townmasters.count / 5);
            break;
        case "pickaxe":
            upgradeTool(pickaxes);
            str += GetResources(pickaxes);
            count = pickaxes.count;
            i = 3;
            break;
        case "hatchet":
            upgradeTool(hatchets);
            str += GetResources(hatchets);
            count = hatchets.count;
            i = 4;
            break;
        case "spear":
            upgradeTool(spears);
            str += GetResources(spears);
            count = spears.count;
            i = 5;
            break;
    }
    upgradeButtons[i].querySelector("div").innerHTML = str;
    upgradeButtons[i].querySelector(".counter").innerHTML = count;
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
    wood.spend(e.resourceNeeded[0]);
    stone.spend(e.resourceNeeded[1]);
    ore.spend(e.resourceNeeded[2]);
    e.upgrade();
    sayings.push("You upgrade your " + e.name + "s.")
}

function updateLabels() {
    let resourceValues = document.querySelectorAll('.resourceValue');
    resourceValues[0].innerHTML = Math.trunc(meat.amount);
    resourceValues[1].innerHTML = Math.trunc(wood.amount);
    resourceValues[2].innerHTML = Math.trunc(stone.amount);
    resourceValues[3].innerHTML = Math.trunc(ore.amount);

    let toolTips = document.querySelectorAll('.tooltiptext');
    toolTips[0].innerHTML = "Meat per tick: " + Math.round(meat.resourcesPerTick * 1000) / 100;
    toolTips[1].innerHTML = "Wood per tick: " + Math.round(wood.resourcesPerTick * 1000) / 100;
    toolTips[2].innerHTML = "Stone per tick: " + Math.round(stone.resourcesPerTick * 1000) / 100;
    toolTips[3].innerHTML = "Ore per tick: " + Math.round(ore.resourcesPerTick * 1000) / 100;

    let populationLabel = document.querySelector("h3#popTrack");
    populationLabel.innerHTML = "Population: " + population + "/" + maxPopulation;

    let jobLabel = document.querySelector("h3#jobTrack");
    jobLabel.innerHTML = "Jobs: " + workingPopulation + "/" + maxJobs;

    let timeStamp = document.querySelectorAll("h4");
    timeStamp[0].innerHTML = "Day: " + Math.trunc(time.days);
    timeStamp[1].innerHTML = "Time: " + Math.trunc(time.hours) + ":";
    if (Math.trunc(time.minutes) < 10)
        timeStamp[1].innerHTML += "0" + Math.trunc(time.minutes);
    else
        timeStamp[1].innerHTML += Math.trunc(time.minutes);

    let popValues = document.querySelectorAll(".popValue");
    popValues[0].innerHTML = hunters.count + "/" + (lodges.count * lodges.jobs + 1);
    popValues[1].innerHTML = miners.count + "/" + (mineshafts.count * mineshafts.jobs + 1);
    popValues[2].innerHTML = lumberjacks.count + "/" + (lumberyards.count * lumberyards.jobs + 1);

    updatePopControls();
}

function changeJobs(e) {
    let totalJobs = hunters.count + miners.count + lumberjacks.count;
    switch (e.currentTarget.dataset.type) {
        case "hunter":
            if (e.currentTarget.className == "upArrow")
                hunters.increase();
            else if (e.currentTarget.className == "downArrow")
                hunters.decrease();
            break;
        case "miner":
            if (e.currentTarget.className == "upArrow")
                miners.increase();
            else if (e.currentTarget.className == "downArrow")
                miners.decrease();
            break;
        case "lumber":
            if (e.currentTarget.className == "upArrow")
                lumberjacks.increase();
            else if (e.currentTarget.className == "downArrow")
                lumberjacks.decrease();
            break;
    }
}

function updatePopControls() {
    let upArrows = document.querySelectorAll(".upArrow");
    let downArrows = document.querySelectorAll(".downArrow");
    
    if (population <= workingPopulation) {
        for (let arrow of upArrows) {
            arrow.disabled = true;
        }
    }
    else {
        for (let arrow of upArrows) {
            arrow.disabled = false;
        }
    }
    
    if (hunters.count >= lodges.count * lodges.jobs + 1)
        upArrows[0].disabled = true;
    if (miners.count >= mineshafts.count * mineshafts.jobs + 1)
        upArrows[1].disabled = true;
    if (lumberjacks.count >= lumberyards.count * lumberyards.jobs + 1)
        upArrows[2].disabled = true;

    if (hunters.count == 0)
        downArrows[0].disabled = true;
    else
        downArrows[0].disabled = false;
    if (miners.count == 0)
        downArrows[1].disabled = true;
    else
        downArrows[1].disabled = false;
    if (lumberjacks.count == 0)
        downArrows[2].disabled = true;
    else
        downArrows[2].disabled = false;
}

function gatherResources() {
    //meat = -population + 5(hunters.count * (spears.count/5 + 1))
    meat.resourcesPerTick += tickManager * 5 * (hunters.count * (spears.count / 5));
    wood.resourcesPerTick = tickManager * (lumberjacks.count * (hatchets.count / 5));
    stone.resourcesPerTick = tickManager * (miners.count * (pickaxes.count / 5) * 0.5);
    ore.resourcesPerTick = tickManager * (miners.count + (pickaxes.count / 2)) * 0.3;
}

function feedPeople() {
    if (meat.amount <= 0 && population > 0) {
        population--;
        sayings.push("You have lost a person you could not feed.");
        meat.amount = 0;
    }   
    //meat = -population + 5(hunters.count * (spears.count/5 + 1))
    meat.resourcesPerTick = tickManager * -population;
    if (workingPopulation > population) {
        if (miners.count > 0)
            miners.decrease();
        else if (lumberjacks.count > 0)
            lumberjacks.decrease();
        else if (hunters.count > 0)
            hunters.decrease();
    }
}

function badEvent() {
    let rand = getRndInt(1, 5);
    if (rand == 1) {
        sayings.push("Rats have invaded your supply of food.");
        sayings.push("You have lost half your meat.");
        meat.amount /= 2;
    }
    else if (rand == 2) {
        sayings.push("Wood ants have decided that your storage room is a perfect new home.")
        sayings.push("You have lost half of your food and a fourth of your wood.")
        meat.amount /= 2;
        wood.amount /= 4;
    }
    else if (rand == 3) {
        sayings.push("A disease has infected your village.");
        /* 
        if (hasMedicine) {
            sayings.push("The doctor's medicine has cured those infected.");
            hasMedicine = false;
        }
        else {
        */
        let randomPeople = getRndInt(1, population / 3);
        sayings.push("You have lost " + randomPeople + " people in your village.");
        population -= randomPeople;
        //}
    }
    else if (rand == 4) {
        let randomStone = getRndInt(1, stone.amount / 5);
        let randomOre = getRndInt(1, ore.count / 10);
        sayings.push("Someone stole supplies from the supply house!");
        sayings.push("You have lost some stone and ore.");
        stone.amount -= randomStone;        
        ore.amount -= randomOre;
    }
    else {
        let randomPopulation = getRndInt(1, population / 8);
        sayings.push(randomPopulation + " people are unhappy with your rule. They have left.");
        population -= randomPopulation;
    }
}

function goodEvent() {
    let rand = getRndInt(1, 3);
    /*
    if (rand == 1) {
        sayings.push("A doctor has come to your village and left you with medicine.");
        if (!hasMedicine)
            hasMedicine= true;
        else ()
    }
    */
    if (rand == 1) {
        sayings.push("A trader has come to your village and has given you some ore.");
        ore.amount += (ore.amount) / 12;
    }
    else if (rand == 2) {
        sayings.push("Your miners found a great vein of ore!")
        ore.amount += ore.amount / 10;
        stone.amount += stone.amount / 10;
    }
    else if (rand == 3) {
        sayings.push("Your lumberjacks were inspired to work extra hard today. They have returned with a ton of wood.");
        wood.amount += wood.resourcesPerTick * 100;
    }
}
function newEvent() {
    let rand = getRndInt(1, 2);
    if (rand == 1) {
        goodEvent();
    }
    else {
        badEvent();
    }
    eventTimer = 150000 + getRndInt(0, 70000);
}

function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
  