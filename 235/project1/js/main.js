// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({width: 800, height: 600, backgroundColor: 0xE3CD8C});
document.querySelector('#content').appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let stage;


//resources
let meat = 0;
let meatPerSec = 0;
let wood = 0;
let woodPerSec = 0;
let stone = 0;
let stonePerSec = 0;
let ore = 0;
let orePerSec = 0;

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
let upgradeNames = ["Stone", "Iron", "Steel", "Titanium", "Diamond"];

function setup() {
    stage = app.stage;

    createLabelsAndButtons();
}

function createLabelsAndButtons() {
    let boxStyle = new PIXI.TextStyle({
        fill: 0xFCE5CD,
        fontSize: 24,
        stroke: 0x000000,
        strokeThickness: 6
    });


    let resourceBox = makeRectangle(150, 180, 0xFCE5CD);
    let meatBox = makeRectangle(390, 360, 0xFCE5CD);
    let noticeBox = makeRectangle(meatBox.width, 174, 0xFCE5CD);
    let buildBox = makeRectangle(170, 200, 0xFCE5CD);
    let popBox = makeRectangle(resourceBox.width, 250, 0xFCE5CD);
    let timeBox = makeRectangle(resourceBox.width, 70, 0xFCE5CD);
    let upgradeBox = makeRectangle(buildBox.width, 334, 0xFCE5CD);

    const vB = 0.25 * (sceneWidth - (resourceBox.width + meatBox.width + buildBox.width));
    const horizontalOffset = 60;
    const hB1 = ((0.25) * (sceneHeight - (resourceBox.height + popBox.height + timeBox.height)));
    const hB3 = ((0.25) * (sceneHeight - (upgradeBox.height + buildBox.height)));
    const hB2 = ((0.25) * (sceneHeight - (meatBox.height + noticeBox.height)));

    resourceBox.x = vB;
    resourceBox.y = hB1;
    stage.addChild(resourceBox);

    meatBox.y = resourceBox.y;
    meatBox.x = resourceBox.x + resourceBox.width + vB;
    stage.addChild(meatBox);
        
    noticeBox.x = meatBox.x;
    noticeBox.y = meatBox.y + meatBox.height + hB2;
    stage.addChild(noticeBox);

    buildBox.y = resourceBox.y;
    buildBox.x = meatBox.x + meatBox.width + vB;
    stage.addChild(buildBox);

    popBox.x = resourceBox.x;
    popBox.y = resourceBox.y + resourceBox.height + hB1;
    stage.addChild(popBox);

    timeBox.x = resourceBox.x;
    timeBox.y = popBox.y + popBox.height + hB1;
    stage.addChild(timeBox);

    upgradeBox.x = buildBox.x;
    upgradeBox.y = buildBox.y + buildBox.height + hB3;
    stage.addChild(upgradeBox);
}

function gameLoop() {

}

setup();