import "@stdlib/deploy";

contract Loops with Deployable {
    init() {}

    receive("loop1") {
        let sum: Int = 0;
        let i: Int = 0;
        repeat(12) {
            i = i + 1;
            sum = sum + i;
        }
        dump(sum);
    }

    receive("loop2") {
        let sum: Int = 0;
        let i: Int = 0;
        while(i<10){
            i = i + 1;
            sum = sum + i;
        }
        dump(sum);
    }

    receive("loop3") {
        let sum: Int = 0;
        let i: Int = 0;
        do {
            i = i + 1;
            sum = sum + i;
        } until (i>=10);

        dump(sum);
    }
}
