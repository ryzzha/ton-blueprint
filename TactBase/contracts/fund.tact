import "@stdlib/deploy";

message Deposit {
    amount: Int as uint32;
}

message Withdraw {
    amount: Int as uint32;
    target: Address;
}

contract Fund with Deployable {
    balance: Int as uint32;

    init() {
        self.balance = 11;
    }

    receive(msg: Deposit) {
        self.balance = (self.balance + msg.amount);
    }

    receive(msg: Withdraw) {
        self.balance = (self.balance - msg.amount);
        send(SendParameters{
            to: msg.target, 
            value: 0,  
            mode: SendRemainingValue + SendIgnoreErrors,
            body: Deposit{ amount: msg.amount }.toCell(),
        });
    }

    bounced(src: Deposit) {
        self.balance = (self.balance + src.amount);
    }

    get fun balance(): Int {
        return self.balance;
    }
}
