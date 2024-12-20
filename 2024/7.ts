import { expect } from "jsr:@std/expect/expect";

const exampleData = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`

type Equation = {
    ans: number;
    parts: number[];
}

function getEquations(input: string): Equation[] {
    return input.split('\n')
        .filter(a => a.length > 0)
        .map<Equation>(line => {
            const parts = line.split(": ")
            return {
                ans: Number(parts[0]),
                parts: parts[1].split(" ").map(v => Number(v))
            }
        })
}

function isValidEquation(e: Equation): boolean {
    if (e.parts.length === 2) {
        const s = e.parts[0] + e.parts[1];
        const x = e.parts[0] * e.parts[1];
        return s === e.ans || x === e.ans;
    }
    return isValidEquation({
        ans: e.ans,
        parts: [e.parts[0] + e.parts[1], ...e.parts.slice(2)]
    }) || isValidEquation({
        ans: e.ans,
        parts: [e.parts[0] * e.parts[1], ...e.parts.slice(2)]
    })
}

Deno.test('valid equations', () => {
    expect(isValidEquation({ ans: 10, parts: [5, 2] })).toBe(true)
    expect(isValidEquation({ ans: 7, parts: [5, 2] })).toBe(true)
    expect(isValidEquation({ ans: 10, parts: [5, 3, 2] })).toBe(true)

})

function part1(input: string): number {
    const equations = getEquations(input);

    const validEquations = equations.filter(e => isValidEquation(e))

    return validEquations.map(e => e.ans).reduce((prev, cur) => prev + cur, 0);
}

Deno.test('part 1 example', () => {
    const ans = part1(exampleData);
    expect(ans).toBe(3749)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/7.txt");

    const ans = part1(text)
    expect(ans).toBe(975671981569)
})

function isValidEquation2(e: Equation): boolean {
    if (e.parts.length === 2) {
        const s = e.parts[0] + e.parts[1];
        const x = e.parts[0] * e.parts[1];
        const o = Number(`${e.parts[0]}${e.parts[1]}`)
        return s === e.ans || x === e.ans || o === e.ans;
    }
    return isValidEquation2({
        ans: e.ans,
        parts: [e.parts[0] + e.parts[1], ...e.parts.slice(2)]
    }) || isValidEquation2({
        ans: e.ans,
        parts: [e.parts[0] * e.parts[1], ...e.parts.slice(2)]
    }) || isValidEquation2({
        ans: e.ans,
        parts: [Number(`${e.parts[0]}${e.parts[1]}`), ...e.parts.slice(2)]
    })
}



function part2(input: string) {
    const equations = getEquations(input);

    const validEquations = equations.filter(e => isValidEquation2(e))

    return validEquations.map(e => e.ans).reduce((prev, cur) => prev + cur, 0);

}
Deno.test('part 2 example', () => {
    const ans = part2(exampleData)
    expect(ans).toBe(11387)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/7.txt");

    const ans = part2(text)
    expect(ans).toBe(223472064194845)
})