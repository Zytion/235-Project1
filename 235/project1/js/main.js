//set up resources
let meat;
let wood;
let stone;
let ore;
//population
let maxPopulation = 1;
let population = 0;
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
let sayings = [];
let buildButtons;
let upgradeButtons;
let jobUpButtons;
let jobDownButtons;

let tickManager = 0.01;

//let hasMedicine = false;
let eventTimer = 200000 + getRndInt(0, 70000);

let previousDay = 0;

let embeddedAudio;
let audioSrcs = ["music/Detlas Suburbs.mp3", "music/Detlas.mp3", "music/Elkurn.mp3",
    "music/Maltic.mp3", "music/Nemract.mp3", "music/Nivla Woods.mp3", "music/Ragni.mp3"];

window.onload = () => {
    buildButtons = document.querySelectorAll(".buildButton");
    upgradeButtons = document.querySelectorAll(".upgradeButton");
    jobUpButtons = document.querySelectorAll(".upArrow");
    jobDownButtons = document.querySelectorAll(".downArrow");
    embeddedAudio = document.querySelector("audio");

    gameSetUp();
}
//set up game
function gameSetUp() {
    //if the localStorage of meat is null, set up game
    if (localStorage.getItem("Hunter") == null) {
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
        houses = new Structure("House", [10, 0, 0], [2, 0, 0], 0, 4, 0);
        mineshafts = new Structure("Mineshaft", [10, 0, 0], [1.75, 2, 1.75]);
        lumberyards = new Structure("Lumberyard", [10, 0, 0], [1.9, 2, 1.75]);
        lodges = new Structure("Lodge", [10, 10, 0], [1.8, 1.75, 2]);
        //#endregion

        //#region Population
        hunters = new Population("Hunter", 0);
        miners = new Population("Miner", 0);
        lumberjacks = new Population("Lumberjack", 0);
        //#endregion

        //#region Upgrades
        hunterUpgrades = new Upgrade("HunterUpgrade", [15, 15, 10])
        recruiters = new Upgrade("Recruiter", [20, 20, 10]);
        townmasters = new Upgrade("Townmaster", [20, 20, 10]);
        pickaxes = new Upgrade("Pickaxe", [15, 20, 5]);
        hatchets = new Upgrade("Hatchet", [15, 20, 5]);
        spears = new Upgrade("Spear", [20, 15, 5]);
        //#endregion

        localStorage.setItem("Muted", false);
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
        houses = new Structure("House", houseStorage.resourceNeeded, houseStorage.resourceUpgradeRates, houseStorage.count, 4, 0);
        let mineshaftStorage = JSON.parse(localStorage.getItem("Mineshaft"));
        mineshafts = new Structure("Mineshaft", mineshaftStorage.resourceNeeded, mineshaftStorage.resourceUpgradeRates, mineshaftStorage.count);
        let lumberyardStorage = JSON.parse(localStorage.getItem("Lumberyard"));
        lumberyards = new Structure("Lumberyard", lumberyardStorage.resourceNeeded, lumberyardStorage.resourceUpgradeRates, lumberyardStorage.count);
        let lodgeStorage = JSON.parse(localStorage.getItem("Lodge"));
        lodges = new Structure("Lodge", lodgeStorage.resourceNeeded, lodgeStorage.resourceUpgradeRates, lodgeStorage.count);
        //#endregion

        //#region Population
        let hunterStorage = JSON.parse(localStorage.getItem("Hunter"));
        hunters = new Population("Hunter", hunterStorage.count);
        let minerStorage = JSON.parse(localStorage.getItem("Miner"));
        miners = new Population("Miner", minerStorage.count);
        let lumberjackStorage = JSON.parse(localStorage.getItem("Lumberjack"));
        lumberjacks = new Population("Lumberjack", lumberjackStorage.count);

        let populationStorage = JSON.parse(localStorage.getItem("Population"));
        if (populationStorage != null)
            population = populationStorage;
        else
            population = 0;
        //#endregion

        //#region Upgrades
        let hunterUpgradeStorage = JSON.parse(localStorage.getItem("HunterUpgrade"));
        hunterUpgrades = new Upgrade("HunterUpgrade", hunterUpgradeStorage.resourceNeeded, hunterUpgradeStorage.resourceUpgradeRates, hunterUpgradeStorage.count);
        let recruiterStorage = JSON.parse(localStorage.getItem("Recruiter"));
        recruiters = new Upgrade("Recruiter", recruiterStorage.resourceNeeded, recruiterStorage.resourceUpgradeRates, recruiterStorage.count);
        let townmasterStorage = JSON.parse(localStorage.getItem("Townmaster"));
        townmasters = new Upgrade("Townmaster", townmasterStorage.resourceNeeded, townmasterStorage.resourceUpgradeRates, townmasterStorage.count);
        let pickaxeStorage = JSON.parse(localStorage.getItem("Pickaxe"));
        pickaxes = new Upgrade("Pickaxe", pickaxeStorage.resourceNeeded, pickaxeStorage.resourceUpgradeRates, pickaxeStorage.count);
        let hatchetStorage = JSON.parse(localStorage.getItem("Hatchet"));
        hatchets = new Upgrade("Hatchet", hatchetStorage.resourceNeeded, hatchetStorage.resourceUpgradeRates, hatchetStorage.count);
        let spearStorage = JSON.parse(localStorage.getItem("Spear"));
        spears = new Upgrade("Spear", spearStorage.resourceNeeded, spearStorage.resourceUpgradeRates, spearStorage.count);
        //#endregion

        let muteStorage = JSON.parse(localStorage.getItem("Muted"));
        if (muteStorage) {
            embeddedAudio.src = audioSrcs[getRndInt(0, audioSrcs.length - 1)];
            mute();
        }
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

if(time.days < 2)
{
    sayings.push("Hover over things for help");
    sayings.push("Get started by clicking on the meat.");
    sayings.push("Welcome to Meat Clicker");
}

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
    generateRandomNotices();

    updateNotifications();

    checkMusic();
}

function checkMusic() {
    if (document.querySelector("#mute").querySelector("i").className == "fa fa-volume-up" &&
        (embeddedAudio.paused || embeddedAudio.currentTime >= embeddedAudio.duration))
        PlayNewAudio();
}

function PlayNewAudio() {
    embeddedAudio.src = audioSrcs[getRndInt(0, audioSrcs.length - 1)];
    let promise = embeddedAudio.play();
    if (promise !== undefined) {
        promise.then(_ => {
          console.log("Autoplay started");
        }).catch(error => {
          console.log("Autoplay prevented");
        });
      }
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
        if (maxPopulation == 1 && workingPopulation == 0)
            sayings.unshift("Try assigning your resident as a lumberjack.");
    }
    else if (maxPopulation == population) {
        sayings.push("A stranger passes through your town looking for housing");
    }
    if (maxPopulation < population) {
        population--;
        sayings.push("A person has left because they do not have housing!");
    }
    localStorage.setItem("Population", JSON.stringify(population));
}

function GetResources(e) {
    let str = "";
    if (e.resourceNeeded[0] > 0) {
        str += "Wood: " + Math.round(e.resourceNeeded[0]);
    }
    if (e.resourceNeeded[1] > 0) {
        str += ", Stone: " + Math.round(e.resourceNeeded[1]);
    }
    if (e.resourceNeeded[2] > 0) {
        str += ", Ore: " + Math.round(e.resourceNeeded[2]);
    }
    return str;
}

function clickMeat(e) {
    meat.update(1 + (hunterUpgrades.count));
}

function updateNotifications() {
    let notificationList = document.querySelector("#notices");
    let str = Math.trunc(time.hours) + ":" + Math.trunc(Math.trunc(time.minutes / 10) * 10);
    if (Math.trunc(Math.trunc(time.minutes / 10) * 10 == 0))
        str += "0";

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
    sayings.push("You build a " + e.name.toLowerCase() + ".")
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
    if (e.notActive) {
        alert("You have reached maximum upgrades.")
    }
    else {
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
        sayings.push("You upgrade your " + e.name.toLowerCase() + "s.")
    }
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

    //#region build buttons update
    if (houses.resourceNeeded[0] <= wood.amount && houses.resourceNeeded[1] <= stone.amount && houses.resourceNeeded[2] <= ore.amount)
        buildButtons[0].className = "buildButton ready";
    else
        buildButtons[0].className = "buildButton";

    if (mineshafts.resourceNeeded[0] <= wood.amount && mineshafts.resourceNeeded[1] <= stone.amount && mineshafts.resourceNeeded[2] <= ore.amount)
        buildButtons[1].className = "buildButton ready";
    else
        buildButtons[1].className = "buildButton";

    if (lumberyards.resourceNeeded[0] <= wood.amount && lumberyards.resourceNeeded[1] <= stone.amount && lumberyards.resourceNeeded[2] <= ore.amount)
        buildButtons[2].className = "buildButton ready";
    else
        buildButtons[2].className = "buildButton";


    if (lodges.resourceNeeded[0] <= wood.amount && lodges.resourceNeeded[1] <= stone.amount && lodges.resourceNeeded[2] <= ore.amount)
        buildButtons[3].className = "buildButton ready";
    else
        buildButtons[3].className = "buildButton";
    //#endregion

    //#region  upgrade buttons update
    if (!hunterUpgrades.notActive && hunterUpgrades.resourceNeeded[0] <= wood.amount && hunterUpgrades.resourceNeeded[1] <= stone.amount && hunterUpgrades.resourceNeeded[2] <= ore.amount)
        upgradeButtons[0].className = "upgradeButton ready";
    else
        upgradeButtons[0].className = "upgradeButton";

    if (!recruiters.notActive && recruiters.resourceNeeded[0] <= wood.amount && recruiters.resourceNeeded[1] <= stone.amount && recruiters.resourceNeeded[2] <= ore.amount)
        upgradeButtons[1].className = "upgradeButton ready";
    else
        upgradeButtons[1].className = "upgradeButton";

    if (!townmasters.notActive && townmasters.resourceNeeded[0] <= wood.amount && townmasters.resourceNeeded[1] <= stone.amount && townmasters.resourceNeeded[2] <= ore.amount)
        upgradeButtons[2].className = "upgradeButton ready";
    else
        upgradeButtons[2].className = "upgradeButton";

    if (!pickaxes.notActive && pickaxes.resourceNeeded[0] <= wood.amount && pickaxes.resourceNeeded[1] <= stone.amount && pickaxes.resourceNeeded[2] <= ore.amount)
        upgradeButtons[3].className = "upgradeButton ready";
    else
        upgradeButtons[3].className = "upgradeButton";

    if (!hatchets.notActive && hatchets.resourceNeeded[0] <= wood.amount && hatchets.resourceNeeded[1] <= stone.amount && hatchets.resourceNeeded[2] <= ore.amount)
        upgradeButtons[4].className = "upgradeButton ready";
    else
        upgradeButtons[4].className = "upgradeButton";

    if (!spears.notActive && spears.resourceNeeded[0] <= wood.amount && spears.resourceNeeded[1] <= stone.amount && spears.resourceNeeded[2] <= ore.amount)
        upgradeButtons[5].className = "upgradeButton ready";
    else
        upgradeButtons[5].className = "upgradeButton";

    //#endregion

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
    meat.resourcesPerTick += tickManager * 5 * (hunters.count * (spears.count / 5 + 1));
    wood.resourcesPerTick = tickManager * 4 / 5 * (lumberjacks.count * (hatchets.count / 5 + 1));
    stone.resourcesPerTick = tickManager / 2 * (miners.count * (pickaxes.count / 5 + 1));
    ore.resourcesPerTick = tickManager / 3 * (miners.count + (pickaxes.count / 2));
}

function feedPeople() {
    if (meat.amount <= 0 && population > 0) {
        population--;
        if(time.hours > 5)
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
    else if (rand == 3 && population > 10) {
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
        if (randomOre > 0 && randomStone > 0) {
            sayings.push("Someone stole supplies from the supply house!");
            sayings.push("You have lost some stone and ore.");
            stone.amount -= randomStone;
            ore.amount -= randomOre;
        }
    }
    else {
        let randomPopulation = getRndInt(1, population / 8);
        if (randomPopulation > 0) {
            sayings.push(randomPopulation + " people are unhappy with your rule. They have left.");
            population -= randomPopulation;
        }
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
    else if (rand == 2 && miners.count > 0) {
        sayings.push("Your miners found a great vein of ore!")
        ore.amount += ore.amount / 10;
        stone.amount += stone.amount / 10;
    }
    else if (rand == 3 && lumberjacks.count > 0) {
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
    return Math.floor(Math.random() * (max - min)) + min;
}

function mute() {
    let muteButton = document.querySelector("#mute").querySelector("i");
    if (muteButton.className == "fa fa-volume-up") {
        muteButton.className = "fa fa-volume-off";
        embeddedAudio.pause();
        localStorage.setItem("Muted", true);
    }
    else {
        muteButton.className = "fa fa-volume-up";
        embeddedAudio.play();
        localStorage.setItem("Muted", false);
    }
}

let randomNotices = ["Your villagers decided to have a feast to celebreate a brithday.",
    "A villager spots a group of houses in the distance... Neat.", 
    " Timmy's fallen down a well? What good news, this will give him ample opportunity to explore his interest in geology.",
    "Gossip is spreading through the village, looks like a marriage will be occoring soon.",
    "A strange man appears in your village trying to sell a rim that he says 'Just Works'. You ask him to leave.",
    "The village is bussiling with activity today, looks like things are going well.",
    "People greet you as you walk by.", "Your villagers seem to be doing well today."];

let randomWeather = ["Looks like its going to be a rainy day today.", "What a wonderfully sunny day!", "It is nice and breezy today.",
    "Cloudy and cool. What a wonderful day for work!", "Its a bit cilly out today.", "Nice and warm outside today.", 
    "Another day, another step."];

let weatherReport = false;
let noticeOccored = false;
let currentDay = 0;

function generateRandomNotices() {
    if (time.hours > 7  && time.hours < 8 && !weatherReport) {
        weatherReport = true;
        sayings.unshift(randomWeather[getRndInt(0, randomWeather.length - 1)]);
    }
    else if(time.hours > 8)
        weatherReport = false;

    if (population > 10) {
        if (time.hours > 11 && time.hours < 12 && Math.random > 0.98 && noticeOccored) {
            sayings.unshift(randomNotices[getRndInt(0, randomNotices.length - 1)]);
            noticeOccored = true;
        }
        else if( time.hours > 12)
        {
            noticeOccored = false;
        }
    }
    if(currentDay < Math.trunc(time.days))
    {
        currentDay = Math.trunc(time.days);
        sayings.push("Day " + currentDay);
    }
}