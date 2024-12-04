import { expect } from "jsr:@std/expect/expect";

const directions = [
    "up",
    "up-left",
    "left",
    "down-left",
    "down",
    "down-right",
    "right",
    "up-right",
] as const;

type Direction = (typeof directions)[number];

type Coordinate = {
    x: number;
    y: number;
};

function moveCoordinate(old: Coordinate, length: number, direction: Direction) {
    const { x, y } = old;

    switch (direction) {
        case "up":
            return { x: x - length, y };
        case "up-left":
            return { x: x - length, y: y - length };
        case "left":
            return { x, y: y - length };
        case "down-left":
            return { x: x + length, y: y - length };
        case "down":
            return { x: x + length, y };
        case "down-right":
            return { x: x + length, y: y + length };
        case "right":
            return { x: x, y: y + length };
        case "up-right":
            return { x: x - length, y: y + length };
    }
}

function validateChar(
    position: Coordinate,
    value: string,
    data: string[][]
): boolean {
    if (position.y < 0 || position.y >= data.length) {
        return false;
    }

    if (position.x < 0 || position.x >= data[0].length) {
        return false;
    }

    return data[position.y][position.x] === value;
}

function searchXmas(start: Coordinate, lines: string[][]): number {
    let hits = 0;

    directions.forEach((direction) => {
        // check m
        const xM = moveCoordinate(start, 1, direction);
        if (!validateChar(xM, "M", lines)) {
            return;
        }

        // check a
        const xA = moveCoordinate(start, 2, direction);
        if (!validateChar(xA, "A", lines)) {
            return;
        }

        // check m
        const xS = moveCoordinate(start, 3, direction);
        if (!validateChar(xS, "S", lines)) {
            return;
        }
        hits += 1;
    });

    return hits;
}

function searchMas(start: Coordinate, lines: string[][]): boolean {
    let hits = 0;
    const diagonals: Direction[] = ['down-left', 'down-right', 'up-left', 'up-right'];

    diagonals.forEach(direction => {
        // check m
        const xM = moveCoordinate(start, -1, direction);
        if (!validateChar(xM, "M", lines)) {
            return;
        }
        // check s
        const xS = moveCoordinate(start, 1, direction);
        if (!validateChar(xS, "S", lines)) {
            return;
        }
        hits += 1;
    })

    return hits === 2;
}

function part1(input: string) {
    const lines = input
        .split("\n")
        .filter((line) => line.length > 0)
        .map((line) => line.split(""));

    let xmasCount = 0;

    lines.forEach((chars, rowIndex) => {
        chars.forEach((char, colIndex) => {
            if (char === "X") {
                xmasCount += searchXmas({ x: colIndex, y: rowIndex }, lines);
            }
        });
    });

    console.log("Xmas count:", xmasCount);

    return xmasCount;
}

function part2(input: string) {
    const lines = input
        .split("\n")
        .filter((line) => line.length > 0)
        .map((line) => line.split(""));

    let xmasCount = 0;

    lines.forEach((chars, rowIndex) => {
        chars.forEach((char, colIndex) => {
            if (char === "A") {
                if (searchMas({ x: colIndex, y: rowIndex }, lines)) {
                    xmasCount += 1;
                }
            }
        });
    });

    console.log("Xmas count:", xmasCount);

    return xmasCount;
}

Deno.test("example", () => {
    const result = part1(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`);
    expect(result).toBe(18)
});

Deno.test("excercise", async () => {
    console.log(Deno.execPath())
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/4.txt");


    const results = part1(text)

    console.log('result', results)

    expect(typeof results).toEqual('number')
})

Deno.test("example 2", () => {
    const result = part2(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`);
    expect(result).toBe(9)
});

Deno.test("excercise 2", async () => {
    console.log(Deno.execPath())
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/4.txt");


    const results = part2(text)

    console.log('result', results)

    expect(typeof results).toEqual('number')
})