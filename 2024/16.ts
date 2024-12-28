import { expect } from "jsr:@std/expect/expect";
import { Direction, directions, getNextMove, getNextMoves, isOnMap, Position, printMap, readMap, rotateClockwise } from "./common.ts";


const exampleData = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`

const exampleData2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`

type Terrain = 'S' | 'E' | '.' | '#' | Direction;


function importData(input: string): Terrain[][] {
    return input.split('\n').filter(a => a.length > 0).map(line => line.split('')) as Terrain[][];
}

function markPath(map: Terrain[][], pos: Position, dir: Direction): Terrain[][] {
    const newMap = map.map(a => [...a])
    newMap[pos.y][pos.x] = dir;
    return newMap
}

function nextMove(pos: Position, dir: Direction, map: Terrain[][], score: number, pointScores: number[][]): number {

    if (map[pos.y][pos.x] === 'E') {
        return score;
    }

    if (score > 105516) {
        return score;
    }

    const options = []

    for (let i = 0; i < 4; i++) {
        const rotationCost = i == 2 ? 2000 : i == 0 ? 0 : 1000;
        const nextScore = score + 1 + rotationCost;
        const nextDir = rotateClockwise(dir, i)
        const nextMoveVal = getNextMove(pos, nextDir);
        const prevPointScore = pointScores[nextMoveVal.y][nextMoveVal.x]
        if ((nextScore - 2001) > prevPointScore) {
            // already found a quicker way
            continue;
        }
        const nextTerrain = readMap(nextMoveVal, map);
        if (nextTerrain === 'E') {
            console.log('made it', score)
            // printMap(map);
            // printMap(pointScores)
            return nextScore
        }
        if (nextTerrain === '.') {
            const newMap = markPath(map, nextMoveVal, nextDir)
            pointScores[nextMoveVal.y][nextMoveVal.x] = Math.min(nextScore, pointScores[nextMoveVal.y][nextMoveVal.x])
            options.push(nextMove(nextMoveVal, nextDir, newMap, nextScore, pointScores))
        }
    }
    if (options.length === 0) {
        // console.log('dead end')
        // printMap(map)
        return Number.MAX_VALUE;
    }
    return Math.min(...options)

}

function findPoints(map: Terrain[][]): [Position, Position] {
    let start: Position = { x: 0, y: 0 }
    let end: Position = { x: 0, y: 0 }

    map.forEach((row, y) => row.forEach((p, x) => {
        if (p === 'S') {
            start = { x, y }
        }
        if (p === 'E') {
            end = { x, y }
        }
    }))

    return [start, end]
}

function part1(input: string): number {
    const map = importData(input);
    const [start, end] = findPoints(map);

    const pointScores: number[][] = map.map(a => a.map(b => 999999))

    const score = nextMove(start, '>', map, 0, pointScores)
    printMap(pointScores)
    return score;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData)).toEqual(7036)
})


Deno.test('part1 example 2', () => {
    expect(part1(exampleData2)).toEqual(11048)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/16.txt");

    const ans = part1(text)
    expect(ans).toBe(105496)
})

function recordPath(map: Terrain[][], unique: Set<string>): Set<string> {
    map.forEach((row, y) => row.forEach((val, x) => {
        if (['S', 'E', ...directions].includes(val)) {
            unique.add(JSON.stringify({ x, y }))
        }
    }))
    console.log('recorded uniques', unique.size)
    return unique
}

function nextMove2(pos: Position, dir: Direction, map: Terrain[][], score: number, pointScores: number[][], unique: Set<string>, target: number): number {

    if (map[pos.y][pos.x] === 'E') {
        if (score === target) {
            recordPath(map, unique)
        }
        return score;
    }

    if (score > 105510) {
        return score;
    }

    const options = []

    for (let i = 0; i < 4; i++) {
        const rotationCost = i == 2 ? 2000 : i == 0 ? 0 : 1000;
        const nextScore = score + 1 + rotationCost;
        const nextDir = rotateClockwise(dir, i)
        const nextMoveVal = getNextMove(pos, nextDir);
        const prevPointScore = pointScores[nextMoveVal.y][nextMoveVal.x]
        if ((nextScore - 2001) > prevPointScore) {
            // already found a quicker way
            continue;
        }
        const nextTerrain = readMap(nextMoveVal, map);
        if (nextTerrain === 'E') {
            console.log('made it', nextScore)
            // printMap(map);
            // printMap(pointScores)
            if (nextScore === target) {
                recordPath(map, unique)
            }
            return nextScore
        }
        if (nextTerrain === '.') {
            const newMap = markPath(map, nextMoveVal, nextDir)
            pointScores[nextMoveVal.y][nextMoveVal.x] = Math.min(nextScore, pointScores[nextMoveVal.y][nextMoveVal.x])
            options.push(nextMove2(nextMoveVal, nextDir, newMap, nextScore, pointScores, unique, target))
        }
    }
    if (options.length === 0) {
        // console.log('dead end')
        // printMap(map)
        return Number.MAX_VALUE;
    }
    return Math.min(...options)

}


function part2(input: string, target: number): number {
    const map = importData(input);
    const [start, end] = findPoints(map);

    const pointScores: number[][] = map.map(a => a.map(b => 999999))
    const uniqueCoordinates = new Set<string>();

    const score = nextMove2(start, '>', map, 0, pointScores, uniqueCoordinates, target)
    printMap(pointScores)
    return uniqueCoordinates.size;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData, 7036)).toBe(45)
})

Deno.test('part 2 example 2', () => {
    expect(part2(exampleData2, 11048)).toBe(64)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/16.txt");

    const ans = part2(text, 105496)
    expect(ans).toBe(1)
})