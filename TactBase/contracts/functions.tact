import "@stdlib/deploy";

extends fun mul(self: Int, num: Int): Int {
    return self * num;
}

extends mutates fun add(self: Int, num: Int) {
    self = self + num;
}

contract Functions with Deployable {
    num: Int as uint32;

    init() {
       self.num = 3; 
    }

    receive() {}

    receive("add") {
        self.num.add(5);
    }

    get fun num(): Int {
        return self.num;
    }

    fun multiply(num: Int): Int {
        return self.num.mul(5);
    }
}