import { expect } from "jsr:@std/expect/expect";

const exampleData = `2333133121414131402`

function readData(input: string): string[] {
    const data: string[] = input.split('');

    const expandedData: string[] = [];

    let isFile = true;
    let fileId = 0
    data.forEach(item => {
        for (let n = 0; n < Number(item); n++) {
            if (isFile) {
                expandedData.push(`${fileId}`);
            } else {
                expandedData.push(".");
            }
        }
        isFile = !isFile;
        if (isFile) {
            fileId += 1;
        }
    })
    return expandedData;
}

Deno.test('expander', () => {
    expect(readData('12345').join('')).toBe('0..111....22222')
})

function calcChecksum(input: string[]): number {
    let total = 0;

    input.forEach((item, index) => {
        if (item !== '.') {
            total += Number(item) * index;
        }
    });
    return total;
}

Deno.test('calcChecksum', () => {
    expect(calcChecksum('0099811188827773336446555566..............'.split(''))).toBe(1928)
})

function part1(input: string): number {
    const data = readData(input);

    const emptyIndexes: number[] = [];

    data.forEach((element, index) => {
        if (element === ".") {
            emptyIndexes.push(index)
        }
    });

    const emptyIndexCount = emptyIndexes.length;

    for (let i = 0; i < emptyIndexCount; i++) {
        const endIndex = data.length - (1 + i);

        const endItem = data[endIndex];

        if (endItem === ".") {
            emptyIndexes.pop();
            continue;
        }

        data[emptyIndexes[0]] = endItem;
        data[endIndex] = "."
        emptyIndexes.shift();
    }

    console.log('sorted', data);

    const ans = calcChecksum(data);

    console.log('ans', ans);
    return ans;
}

Deno.test('part 1 example', () => {
    expect(part1(exampleData)).toBe(1928)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/9.txt");

    const ans = part1(text)
    expect(ans).toBe(357)
})

function part2(input: string): number {
    return 0;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(34)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/9.txt");

    const ans = part2(text)
    expect(ans).toBe(1266)
})