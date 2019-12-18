class Resources {
    constructor(name, amount = 0, resourcesPerTick = 0) {
        this.name = name;
        this.amount = amount;
        this.resourcesPerTick = resourcesPerTick;
    }

    spend(amt) {
        if (this.amount >= amt) {
            this.amount -= amt;
            return this.amount;
        }
    }
    update(amt) {
        this.amount += amt;
        //save resource to localStorage with name, save this object
        localStorage.setItem(this.name, JSON.stringify(this));
        return this.amount;
    }
}

class Time {
    constructor(ticks = 0) {
        this.ticks = ticks;
        this.minutes = ((this.ticks / 2) % (60));
        this.hours = ((this.ticks / 2) / 60) % 24;
        this.days = ((this.ticks / 2) / (60 * 24));
    }

    //updates ticks, days, hours, and minutes
    update() {
        this.ticks++;
        //2 ticks is one minute, to change the time switch the ticks / a number
        this.minutes = ((this.ticks / 2) % (60));
        this.hours = ((this.ticks / 2) / 60) % 24;
        this.days = ((this.ticks / 2) / (60 * 24));

        localStorage.setItem("Time", JSON.stringify(this));
    }

}

class Structure {
    constructor(name, resourceNeeded, upgradeRates, count = 0, housing = 1, jobs = 4) {
        this.name = name;
        this.resourceNeeded = resourceNeeded;
        this.resourceUpgradeRates = upgradeRates;
        this.count = count;
        this.housing = housing;
        this.jobs = jobs;
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    build() {
        this.count++;
        for (let i = 0; i < this.resourceNeeded.length; i++) {
            this.resourceNeeded[i] *= this.resourceUpgradeRates[i];
        }
        if(this.name != "House")
        {
            if(this.resourceNeeded[1] == 0)
                this.resourceNeeded[1] = 10;
            if((this.count == 1  && this.name != "Lumberyard") || (this.count == 2 && this.name == "Lumberyard"))
                this.resourceNeeded[2] = 5;
        }
        localStorage.setItem(this.name, JSON.stringify(this));
    }
}

class Upgrade {
    constructor(name, resourceNeeded, updateRates = [5,5,5], count = 0, totalUpgrades = 5) {
        this.name = name;
        this.resourceNeeded = resourceNeeded;
        this.resourceUpgradeRates = updateRates;
        this.totalUpgrades = totalUpgrades;
        this.count = count;
        let notActive = false;
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    upgrade() {
        if (this.count < this.totalUpgrades) {
            this.count++;
            for (let i = 0; i < this.resourceNeeded.length; i++) {
                this.resourceNeeded[i] *= this.resourceUpgradeRates[i];
            }
        }
        else {
            this.notActive = true;
        }
        localStorage.setItem(this.name, JSON.stringify(this));
    }

}

class Population {
    constructor(name, count = 0) {
        this.name = name;
        this.count = count;
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    increase() {
        this.count++;
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    decrease() {
        this.count--;
        localStorage.setItem(this.name, JSON.stringify(this));
    }

}