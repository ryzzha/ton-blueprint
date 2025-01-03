import "@stdlib/deploy";

message Add {
    amount: Int as uint32
}

contract Counter with Deployable {
    id: Int as uint32;
    counter: Int as uint32;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    receive("increment") {
        self.counter += 1;
    }

    receive(msg: Add) {
        self.counter += msg.amount;
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun Id(): Int {
        return self.id;
    }
}
