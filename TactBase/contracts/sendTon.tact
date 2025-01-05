import "@stdlib/deploy";

message Withdraw{
    amount: Int as coins;
}

contract SendTon with Deployable {
    owner: Address;
    const MinTonForStorage: Int = ton("0.01"); // 1 KB for 2.5 year

    init() {
        self.owner = sender();
    }

    fun onlyOwner(){
        require(sender() == self.owner, "only owner is allowed to withdraw");
    }

    receive() {

    }

    receive("withdraw all") {
        require(sender() == self.owner, "you are not an owner");
        send(SendParameters{
            to: sender(), 
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors,
            bounce: true,
        });
    }

    receive("withdraw safe"){
        self.onlyOwner();
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value - self.MinTonForStorage,
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }

    receive(msg: Withdraw){
        self.onlyOwner();
        let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);
        require(amount>0, "Insufficient balance");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: amount,
            mode: SendIgnoreErrors, 
        });
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }
}