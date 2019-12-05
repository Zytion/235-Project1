//set up resources
let meat = new Resources("Meat");
let wood = new Resources("Wood", 0, 0);
let stone = new Resources("Stone", 0, 0);
let ore = new Resources("Ore", 0, 0);

//population
let maxPopulation = 0;
let population = 0;

//day and time
let ticksPassed = 0;

//build
let houses = 0;
let mineshafts = 0;
let lumberyards = 0;
let lodges = 0;

//upgrades
let hunterUpgrades = 0;
let recruiterUpgrades = 0;
let townmasterUpgrades = 0;
let upgradeNames = ["Novice", "Junior", "Veteran", "Master", "Grandmaster"];

let pickaxes = 0;
let hatchets = 0;
let spears = 0;
let toolUpgradeNames = ["Stone", "Iron", "Steel", "Titanium", "Diamond"];

function gameLoop() {
    //PUT THIS IN THE TICKER LOOP
    //update basic resources/time
    UpdateResources();
    UpdateTime();

    //check for meat clicks

    //check for clicks on build
    
    //check for clicks on upgrades
    
    //check for clicks on population

    //generate notifications
}