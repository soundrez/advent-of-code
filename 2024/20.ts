import { expect } from "jsr:@std/expect/expect";
import { directions, getNextMove, getNextMoves, isOnMap, mapEach, newMap, Position, printMap, readMap, writeMap } from "./common.ts";


const exampleData = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`

type Terrain = '.' | '#' | 'S' | 'E';

function readInput(input: string): Terrain[][] {
    return input.split('\n').filter(a => a.length > 0).map(b => b.split('') as Terrain[])
}

function explore(map: Terrain[][], path: number[][]) {
    const mapSize = { x: map[0].length, y: map.length }


    let updates = 1;

    while (updates > 0) {
        updates = 0;

        map.forEach((mapLine, y) => mapLine.forEach((mapVal, x) => {
            if (mapVal === '#') {
                return;
            }
            const curVal = readMap({ x, y }, path)
            const neighbours = getNextMoves({ x, y }).filter(isOnMap(mapSize)).map(c => readMap(c, path) + 1)
            const newPathVal = Math.min(...neighbours, curVal)
            if (newPathVal !== curVal) {
                updates += 1;
                writeMap({ x, y }, path, newPathVal);
            }
        }))
    }

    // printMap(path);

}

function part1(input: string, cutoff: number): number {
    const map = readInput(input);
    const mapSize = { x: map[0].length, y: map.length }
    const startPath = newMap(mapSize, 999);
    const endPath = newMap(mapSize, 999);

    let endPoint: Position | null = null;

    map.forEach((line, y) => {
        const startIndex = line.findIndex(a => a === 'S')
        if (startIndex !== -1) {
            startPath[y][startIndex] = 0;
        }
        const endIndex = line.findIndex(a => a === 'E')
        if (endIndex !== -1) {
            endPath[y][endIndex] = 0
            endPoint = { x: endIndex, y }
        }
    })

    if (!endPoint) {
        throw new Error("help")
    }

    explore(map, startPath);
    explore(map, endPath);
    const normalDistance = readMap(endPoint, startPath)

    let goodShortcuts = 0

    // now find shortcuts
    mapEach(startPath, (val, pos) => {
        if (readMap(pos, map) === '#') {
            return;
        }
        const shortcuts = directions.map(d => getNextMove(getNextMove(pos, d), d)).filter(isOnMap(mapSize));
        shortcuts.forEach(shortcut => {
            const shortcutVal = normalDistance - readMap(shortcut, endPath) - val - 2;
            if (shortcutVal >= cutoff) {
                goodShortcuts += 1
                console.log('good shortcut', pos, shortcut, shortcutVal)
            }
        })
    })

    printMap(map)
    printMap(startPath, 3)
    printMap(endPath, 3)
    return goodShortcuts;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData, 65)).toEqual(0)
    expect(part1(exampleData, 64)).toEqual(1)
    expect(part1(exampleData, 41)).toEqual(1)
    expect(part1(exampleData, 40)).toEqual(2)
    expect(part1(exampleData, 39)).toEqual(2)
    expect(part1(exampleData, 38)).toEqual(3)
    expect(part1(exampleData, 37)).toEqual(3)
    expect(part1(exampleData, 36)).toEqual(4)
    expect(part1(exampleData, 21)).toEqual(4)
    expect(part1(exampleData, 20)).toEqual(5)
    expect(part1(exampleData, 13)).toEqual(5)
    expect(part1(exampleData, 12)).toEqual(8)
    expect(part1(exampleData, 11)).toEqual(8)
    expect(part1(exampleData, 10)).toEqual(10)
    expect(part1(exampleData, 9)).toEqual(10)
    expect(part1(exampleData, 8)).toEqual(14)
    expect(part1(exampleData, 7)).toEqual(14)
    expect(part1(exampleData, 6)).toEqual(16)
    expect(part1(exampleData, 5)).toEqual(16)
    expect(part1(exampleData, 4)).toEqual(30)
    expect(part1(exampleData, 3)).toEqual(30)
    expect(part1(exampleData, 2)).toEqual(44)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/20.txt");

    const ans = part1(text, 100)
    expect(ans).toBe(1)
})

function part2(input: string): number {
    return 0;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(1)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/20.txt");

    const ans = part2(text)
    expect(ans).toBe(1)
})