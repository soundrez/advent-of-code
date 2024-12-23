import { expect } from "jsr:@std/expect/expect";


const exampleData = `125 17`

type Cache = Record<number, Record<number, number>>;

function readNumbers(input: string): number[] {
    return input.split(' ').map(a => Number(a))
}

function blinkStone(num: number): number[] {


    if (num === 0) {
        return [1];
    }
    // if (num === 2024) {
    //     return [20, 24];
    // }
    // if (num === 20) {
    //     return [2, 0];
    // }
    // if (num === 24) {
    //     return [2, 4]
    // }
    // if (num === 32772608) {
    //     return [3277, 2608]
    // }
    // if (num === 16192) {
    //     return [32772608]
    // }
    const numStr = `${num}`;
    const numLen = numStr.length;
    if (numLen % 2 === 0) {
        const ans = [
            Number(numStr.slice(0, numLen / 2)),
            Number(numStr.slice(numLen / 2))
        ]
        return ans;
    }
    const ans = [num * 2024];
    return ans;
}

Deno.test('blinkStones', () => {
    expect(blinkStone(0)).toEqual([1]);
    expect(blinkStone(1)).toEqual([2024])
    expect(blinkStone(10)).toEqual([1, 0])
    expect(blinkStone(99)).toEqual([9, 9])
    expect(blinkStone(999)).toEqual([2021976])
})

function predictStones(numbers: number[], blinks: number): number {

    let newNumbers = [...numbers];
    const cache: Cache = {}

    for (let i = 0; i < blinks; i++) {
        newNumbers = newNumbers.map(a => blinkStone(a)).flat()
    }
    console.log('cache', cache)
    return newNumbers.length
}

function predictStone(number: number, blinks: number, cache: Cache = {}): number {

    if (!cache[number]) {
        cache[number] = {}
    }


    if (cache[number] && cache[number][blinks]) {
        return cache[number][blinks];
    }

    const ans = blinkStone(number);

    if (blinks === 1) {
        cache[number][blinks] = ans.length;
        return ans.length
    }
    const nextBlink = blinks - 1
    let prediction = 0;
    if (ans.length === 1) {
        prediction = predictStone(ans[0], nextBlink, cache)
    } else {
        prediction = predictStone(ans[0], nextBlink, cache) + predictStone(ans[1], nextBlink, cache);
    }

    cache[number][blinks] = prediction;
    return prediction;
}

Deno.test('predictStone', () => {
    expect(predictStone(0, 1, {})).toEqual(1);
    expect(predictStone(1, 1, {})).toEqual(1)
    expect(predictStone(10, 1, {})).toEqual(2)
    expect(predictStone(99, 1, {})).toEqual(2)
    expect(predictStone(999, 1, {})).toEqual(1)

    expect(predictStone(125, 1, {})).toEqual(1)
    expect(predictStone(125, 2, {})).toEqual(2)
    expect(predictStone(125, 3, {})).toEqual(2)
    expect(predictStone(125, 4, {})).toEqual(3)

})

function part1(input: string): number {
    const numbers = readNumbers(input);

    const ans = predictStones(numbers, 25)

    console.log('answer:', ans)
    return ans;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData)).toEqual(55312)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/11.txt");

    const ans = part1(text)
    expect(ans).toBe(194482)
})

function part2(input: string, blinks: number): number {
    const numbers = readNumbers(input);
    const cache: Cache = {};
    const ans = numbers.map(n => {
        const ans = predictStone(n, blinks, cache);
        console.log('stones predicted', ans);
        return ans;
    }).reduce((a, b) => a + b, 0)

    // console.log('cache', Object.entries(cache).sort((a, b) => b[1].instances - a[1].instances))
    console.log('answer:', ans)
    return ans;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData, 25)).toBe(55312)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/11.txt");

    const ans = part2(text, 75)
    expect(ans).toBe(1)
})