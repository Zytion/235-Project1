class Resources {
    constructor(amount = 0, resourcesPerTick = 0) {
        this.amount = amount,
        this.resourcesPerTick = resourcesPerTick;
    }

    spend(amt) {
        if (amount >= amt) {
            amount -= amt;
        }
    }
    gain(amt) {
        amount += amt;
    }
}

class Time {
    constructor(ticks = 0, dTime = 0) {
        this.ticks = ticks,
        this.dTime = dTime;
    }

    update() {
        ticks++;
        if (ticks)
    }

}