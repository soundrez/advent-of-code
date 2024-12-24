import { expect } from "jsr:@std/expect/expect";


const exampleData = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`

type Position = { x: number, y: number }


type ClawMachine = {
    a: Position;
    b: Position;
    prize: Position;
}

function readInput(input: string): ClawMachine[] {
    const machines = input.split("\n\n").map<ClawMachine>(mData => {
        const lines = mData.split('\n')

        const lineA = lines[0].slice(12).split(', Y+')
        const a = { x: Number(lineA[0]), y: Number(lineA[1]) }

        const lineB = lines[1].slice(12).split(', Y+')
        const b = { x: Number(lineB[0]), y: Number(lineB[1]) }

        const lineP = lines[2].slice(9).split(', Y=')
        const prize = { x: Number(lineP[0]), y: Number(lineP[1]) }

        return { a, b, prize }
    });

    return machines;
}

function readInput2(input: string): ClawMachine[] {
    return readInput(input).map(a => ({
        ...a,
        prize: { x: a.prize.x + 10000000000000, y: a.prize.y + 10000000000000 }
    }))
}

Deno.test('readInput', () => {
    expect(readInput(exampleData)[0]).toEqual({
        a: { x: 94, y: 34 },
        b: { x: 22, y: 67 },
        prize: { x: 8400, y: 5400 }
    })
})

function mul(pos: Position, val: number): Position {
    return { x: pos.x * val, y: pos.y * val }
}

function winMachine(machine: ClawMachine): number {

    let minWin = 500;

    const maxACount = Math.ceil(machine.prize.x / machine.a.x)

    for (let aCount = 0; aCount <= maxACount; aCount++) {
        const a = mul(machine.a, aCount)

        const remainingX = machine.prize.x - a.x;
        const remainingY = machine.prize.y - a.y;

        if (remainingX % machine.b.x === 0) {
            const bCount = remainingX / machine.b.x;
            if (bCount * machine.b.y === remainingY) {
                console.log('combination', aCount, bCount)
                minWin = Math.min(minWin, (aCount * 3) + bCount)
            }
        }

    }
    if (minWin === 500) {
        return 0 // no way to win
    } else {
        return minWin
    }
}

Deno.test('winMachine', () => {
    expect(winMachine(readInput(exampleData)[0])).toBe(280)
    expect(winMachine(readInput(exampleData)[1])).toBe(0)
})

Deno.test('winMachine large', () => {
    expect(winMachine(readInput2(exampleData)[0])).toBe(0)
    expect(winMachine(readInput2(exampleData)[1])).toBeGreaterThan(0)
})

function part1(input: string): number {

    const machines = readInput(input);

    let tokensUsed = 0;

    machines.forEach(machine => {
        tokensUsed += winMachine(machine)
    })

    return tokensUsed;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData)).toEqual(480)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/13.txt");

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
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/13.txt");

    const ans = part2(text)
    expect(ans).toBe(1)
})