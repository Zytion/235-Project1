// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({width: 800, height: 600, backgroundColor: 0xE3CD8C});
document.querySelector('#content').appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let stage;

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
    let noticeBox = makeRectangle(meatBox.width, 140, 0xFCE5CD);
    let buildBox = makeRectangle(170, 300, 0xFCE5CD);
    let popBox = makeRectangle(resourceBox.width, 220, 0xFCE5CD);
    let timeBox = makeRectangle(resourceBox.width, 70, 0xFCE5CD);
    let upgradeBox = makeRectangle(buildBox.width, 400, 0xFCE5CD);

    const vB = 0.25 * (sceneWidth - (resourceBox.width + meatBox.width + buildBox.width));
    const horizontalOffset = 60;
    const hB1 = ((0.25) * ((sceneHeight - horizontalOffset) - (resourceBox.height + popBox.height + timeBox.height)));

    console.log(hB1);

    resourceBox.x = vB;
    resourceBox.y = horizontalOffset + hB1;
    stage.addChild(resourceBox);

    meatBox.y = resourceBox.y;
    meatBox.x = resourceBox.x + resourceBox.width + vB;
    stage.addChild(meatBox);
        
    noticeBox.x = meatBox.x;
    noticeBox.y = meatBox.y + meatBox.height + 10;
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
    upgradeBox.y = buildBox.y + buildBox.height + 10;
    stage.addChild(upgradeBox);
}

function gameLoop() {

}

setup();