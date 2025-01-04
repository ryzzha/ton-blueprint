import "@stdlib/deploy";

message Deposit {
    amount: Int as uint32;
}

contract Company with Deployable {
    balance: Int as uint32;

    init() {
        self.balance = 11;
    }

    receive(msg: Deposit) {
        self.balance = (self.balance + msg.amount);
    }

     get fun balance(): Int {
        return self.balance;
    }
}
