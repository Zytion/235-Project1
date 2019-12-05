class Resources {
    constructor(name, amount = 0, resourcesPerTick = 0) {
        this.name = name,
        this.amount = amount,
        this.resourcesPerTick = resourcesPerTick;
    }

    spend(amt) {
        if (amount >= amt) {
            amount -= amt;
            return this.amount;
        }
    }
    update(amt) {
        amount += amt;
        return this.amount;
    }
}

class Time {
    constructor(ticks = 0, dTime = 0) {
        this.ticks = ticks,
        this.dTime = dTime,
        days = 0,
        hours = 0,
        minutes = 0;
    }

    //updates ticks, days, hours, and minutes
    update() {
        ticks++;
        days = ticks / (24 * 3600);
        hours = (ticks % (24 * 3600)) / 3600;
        minutes = ((ticks % (24 * 3600)) / 3600) /60;
    }

}

class Structure {
    constructor(name, resourceNeeded) {
        this.name = name,
        this.resourceNeeded = resourceNeeded,
        count = 0;
    }

    build() {
        count++;
    }

}

class Upgrade {
    constructor(name, resourceNeeded, totalUpgrades) {
        this.name = name,
        this.resourceNeeded = resourceNeeded,
        this.totalUpgrades = totalUpgrades,
        count = 0,
        notActive = false;
    }

    upgrade() {
        if (count < totalUpgrades) {
            count++;
        }
        else {
            notActive = true;
        }
    }

}