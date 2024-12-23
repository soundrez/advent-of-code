import { expect } from "jsr:@std/expect/expect";


const exampleData = ``

function part1(input: string): number {
    return 0;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData)).toEqual(1)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/10.txt");

    const ans = part1(text)
    expect(ans).toBe(1)
})

function part2(input: string): number {
    return 0;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(1)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/10.txt");

    const ans = part2(text)
    expect(ans).toBe(1)
})