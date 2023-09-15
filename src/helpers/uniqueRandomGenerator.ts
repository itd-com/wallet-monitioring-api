
const removeKeyDuplicates = [
    0, // not use
    10, // Dup ".10" == ".1"
    20, // Dup ".20" == ".2"
    30, // Dup ".30" == ".3"
    40, // Dup ".40" == ".4"
    50, // Dup ".50" == ".5"
    60, // Dup ".60" == ".6"
    70, // Dup ".70" == ".7"
    80, // Dup ".80" == ".8"
    90, // Dup ".90" == ".9"
];

export class UniqueRandomGenerator {
    private readonly nums: Set<number>;
    private readonly range: number;

    // example range 100 is Random 0 - 99
    constructor(range: number, removeKeyUsed: number[]) {
        this.range = range;
        this.nums = new Set([
            ...removeKeyDuplicates,
            ...removeKeyUsed,
        ]);
    }

    public generate(): number | null {
        if (this.nums.size >= this.range) {
            return null; // return null or throw an error if all possible numbers have been generated
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const randomNum = Math.floor(Math.random() * this.range);
            if (!this.nums.has(randomNum)) {
                this.nums.add(randomNum);
                return randomNum;
            }
        }
    }
}



