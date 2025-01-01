import { expect } from "jsr:@std/expect/expect";


const exampleData = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`

type Input = {
    towels: string[];
    designs: string[];
}

function readInput(input: string): Input {
    const [t, d] = input.split("\n\n")
    return {
        towels: t.split(", ").filter(a => a.length > 0), designs: d.split("\n").filter(a => a.length > 0)
    }
}

Deno.test('readInput', () => {
    expect(readInput(exampleData).towels).toEqual(["r", "wr", "b", "g", "bwu", "rb", "gb", "br"])
    expect(readInput(exampleData).designs).toEqual([
        "brwrr",
        "bggr",
        "gbbr",
        "rrbgbr",
        "ubwu",
        "bwurrg",
        "brgr",
        "bbrgwb"
    ])
})

function selectTowels(pattern: string, towels: string[]): boolean {
    if (pattern.length === 0) {
        // console.log('yes pattern')
        return true
    }

    const matches = towels.filter(t => pattern.startsWith(t));

    if (matches.length === 0) {
        console.log('no pattern', pattern)
        return false;
    }

    for (const m of matches) {
        if (selectTowels(pattern.slice(m.length), towels)) {
            return true;
        }
    }

    return false;
}

function comboTowels(fullPattern: string, matched: string, towels: string[]): number {

    const offset = matched.length;
    const pattern = fullPattern.slice(offset)

    if (pattern.length === 0) {
        // console.log('yes pattern', offset)
        return 1
    }

    const matches = towels.filter(t => pattern.startsWith(t));

    if (matches.length === 0) {
        // console.log('no pattern', pattern)
        return 0;
    }

    console.log('progress', matched, matches)
    let total = 0;
    for (const m of matches) {
        if (m === pattern) {
            // console.log('last match', m)
        }
        if (m.length < 1) {
            console.log('zero length!')
        }
        total += comboTowels(fullPattern, `${matched}${m}`, towels)
    }

    return total;
}

function part1(input: string): number {
    const { towels, designs } = readInput(input);


    const matches = designs.map(d => {
        console.log(`Target pattern: ${d}`)
        return selectTowels(d, towels)
    }).filter(a => a);

    return matches.length;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData)).toEqual(6)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/19.txt");

    const ans = part1(text)
    expect(ans).toBe(1)
})

function part2(input: string): number {
    const { towels, designs } = readInput(input);

    let totalTotal = 0;

    for (const design of designs) {

        const totalByIndex = new Array(design.length).fill(0);
        for (let n = 0; n < design.length; n++) {
            const cutDesign = design.slice(n);
            const matchingTowels = towels.filter(towel => cutDesign.startsWith(towel));
            // console.log('designs', cutDesign, matchingTowels)
            for (const t of matchingTowels) {
                if (n === 0) {
                    totalByIndex[t.length + n - 1] += 1
                } else {
                    totalByIndex[t.length + n - 1] += totalByIndex[n - 1]
                }
            }
            // console.log(totalByIndex)
        }
        console.log(design, totalByIndex[totalByIndex.length - 1])
        totalTotal += totalByIndex[totalByIndex.length - 1]

    }

    return totalTotal;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(16)
})

Deno.test('part 2 real sample', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/19.txt");

    const ans = readInput(text);

    const aa = comboTowels('rwgbwbggrbgbwggwguwwuuwwrbwurwwggbwwwbubwbwgwur', '', ans.towels)

    expect(aa).toBe(1)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/19.txt");

    const ans = part2(text)
    expect(ans).toBe(1)
})