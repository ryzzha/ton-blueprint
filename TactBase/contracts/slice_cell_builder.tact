import "@stdlib/deploy";

message ChangeAddressAndCoins {
    newAddress: Address;
    newCoinsNumber: Int;
}

contract SliceCellBuilder with Deployable {
    storage: Cell;

    init() {
        let coinAddress: Address = address("0:0000000000000000000000000000000000000000000000000000000000000000");
        let builder: Builder = beginCell().storeAddress(coinAddress).storeUint(100000, 64);
        self.storage = builder.asCell();
    }

    get fun coinAddress(): Address {
        let slice: Slice = self.storage.asSlice();
        let coinaddress: Address = slice.loadAddress();
        return coinaddress;
    }

    get fun coinNumber(): Int {
        let slice: Slice = self.storage.asSlice();
        slice.loadAddress();
        let coinnumber: Int = slice.loadUint(64);
        return coinnumber;
    }

    receive(msg: ChangeAddressAndCoins) {
        let builder: Builder = beginCell().storeAddress(msg.newAddress).storeUint(msg.newCoinsNumber, 64);
        self.storage = builder.asCell();
    }
}
