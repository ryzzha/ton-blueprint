import "@stdlib/deploy";

message Reach {
    counter: Address;
    target: Int as uint32;
}

message CounterValue {
    amount: Int as uint32;
}

contract BulkAdder with Deployable {
    target: Int as uint32;

     init() {
        self.target = 0;
    }

    receive(msg: Reach) {
        self.target = msg.target;
        send(SendParameters{
            to: msg.counter, 
            value: 0,  
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "query".asComment(),
        });
    }

    receive(msg: CounterValue) {
        if(msg.amount < self.target) {
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()
            });
        }
    }

    get fun target(): Int {
        return self.target;
    }
}