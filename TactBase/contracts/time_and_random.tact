import "@stdlib/deploy";

contract TimeAndRandom with Deployable {
    deployTime: Int as uint32;
   
    init() {
        self.deployTime = now();
    }

    get fun unixTime(): Int {
        return now();
    }

    receive("wait 12s") {
        require(now() - self.deployTime >= 10, "too early wait 10s");
        dump("thank to wait 10s");
    }

    get fun rand(): Int {
        return randomInt();
    }

    get fun randBetween(from: Int, to: Int): Int {
        return random(from, to);
    }
}
