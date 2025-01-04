import "@stdlib/deploy";

const GlobalConst1: Int = 2000 + ton("1.24") + pow(10, 9);

contract Counter with Deployable {
    i1: Int as int257 = 1000; // - 2^256 to 2^256   0.184 TON per year
    i2: Int as uint256; // 0 to 2^256
    i3: Int as int256 = 17; 
    i4: Int as uint128 = 0;     // 0 to 2^128
    i5: Int as int128 = 0;      // -2^127 to 2^127
    i6: Int as coins = 0;       // 0 to 2^120
    i7: Int as uint64 = 0x1c4a;      // 0 to 2^65
    i8: Int as int64 = -203;
    i9: Int as uint32 = 0;
    i10: Int as int32 = 1000; // costs 0.023 ton per year
    i11: Int as uint16 = 0;     // 0 to 65,535
    i12: Int as int16 = 0;      // -32,768 to 32,767
    i13: Int as uint8 = 0;      // 0 to 255
    i14: Int as int8 = 0;       //-128 to 127

    s1: String = "hello world";
    s2: String = "yes unicode 😂🔥 no escaping /n";

    //264-bit
    //storing 1000 address 0.189 TON per year
    a1: Address = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"); // bouncable
    a2: Address = address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"); // non-bouncable
    a3: Address;

    a4: Address;
    a5: Address;
    a6: Address;

    b1: Bool = true;
    b2: Bool = false;

    const ContractConst1: Int = 2000 + ton("1.25") + pow(10, 9);

    init() {
        self.i2 = 0x83df;
        self.i4 = 154530043534;
        self.i5 = pow(10, 9); // 10^9 = 1,000,000,000
        self.i6 = ton("1.23"); // 9 decimals 1230000000
        self.i14 = self.i3 + 200;

        let i1: Int = -12345;
        let i2: Int = 6780000000; // coins = ton("6.78")

        let s3: String = i1.toString();
        let s4: String = i1.toFloatString(3); // "-12.345"
        let s5: String = i2.toCoinsString(); // "6.78"

        let sb: StringBuilder = beginString();
        sb.append(self.s1);
        sb.append(", your balance is: ");
        sb.append(s5);

        let s6: String = sb.toString();

        self.a3 = newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

        self.a4 = myAddress();
        self.a5 = sender();
        self.a6 = newAddress(0, 0);
        
    }

    receive() {
        self.a1 == self.a2; // true
        self.a2 == self.a3; // true

        let b: Bool = true;

        self.b1 == true; // true
        self.b1 == self.b2; // false
        self.b1 != self.b2; // true
    }

    get fun sum(): Int {
        return self.ContractConst1 + GlobalConst1;
    }

    get fun location(): Address {
        return myAddress();
    }

    get fun greeting(): String {
        return "hello world";
    }

    get fun and(a: Bool, b: Bool): Bool {
        return a && b;
    }

    get fun answer(a: Int): String {
        let sb: StringBuilder = beginString();
        sb.append("The meaning of life is ");
        sb.append(a.toString());
        return sb.toString();
    }
}
