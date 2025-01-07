import "@stdlib/deploy";
import "@stdlib/ownable";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

trait Trackable with Ownable {
    messagesReceived: Int;
    owner: Address;

    virtual const ENABLE_RESET: Bool = true;

    fun receiveNewMessage(){
        if(self.filterMessage()){
            self.messagesReceived += 1;
        } 
    }

    receive("reset stats"){
        if(self.ENABLE_RESET){
            self.requireOwner();
            self.messagesReceived = 0;
            self.reply("reset done".asComment());
        }
    }

    get fun stats(): Int {
        return self.messagesReceived;
    }

    virtual fun filterMessage(): Bool{
        if(sender()==self.owner){
            return false;
        }
        return true;
    }
}

contract TrackableCounter with Deployable, Trackable {
    id: Int as uint32;
    counter: Int as uint32;
    owner: Address;
    messagesReceived: Int;
    override const ENABLE_RESET: Bool = false;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
        self.owner = sender();
        self.messagesReceived = 0;
    }

    receive(msg: Add) {
        self.receiveNewMessage();
        self.counter = (self.counter + msg.amount);
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}
