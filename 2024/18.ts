import { expect } from "jsr:@std/expect/expect";
import { addPosition, getNextMove, getNextMoves, isOnMap, mapEach, newMap, Position, printMap, readMap, writeMap } from "./common.ts";


const exampleData = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`

function readInput(input: string): Position[] {
    return input.split('\n').filter(a => a.length > 0).map(line => {
        const numbers = line.split(',')
        return { x: Number(numbers[0]), y: Number(numbers[1]) }
    })
}

type Terrain = '.' | '#';

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

function part1(input: string, mapSize: Position, maxObstacles: number): number {
    const obstacles = readInput(input).slice(0, maxObstacles);

    const map = newMap<Terrain>(mapSize, '.');
    obstacles.forEach(obs => {
        try {
            map[obs.y][obs.x] = '#'
        } catch (err) {
            console.log('error!', obs, map.length, map[0].length)
        }
    })
    printMap(map);
    const path = newMap(mapSize, 99999);
    path[0][0] = 0;

    explore(map, path)

    return readMap(addPosition(mapSize, -1, -1), path);
}

Deno.test('part1 example', () => {
    expect(part1(exampleData, { x: 7, y: 7 }, 12)).toEqual(22)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/18.txt");

    const ans = part1(text, { x: 71, y: 71 }, 1024)
    expect(ans).toBe(1)
})

function checkPath(map: Terrain[][], mapSize: Position): boolean {

    const path = newMap(mapSize, 99999);
    path[0][0] = 0;

    explore(map, path)

    const ans = readMap(addPosition(mapSize, -1, -1), path);

    return ans < 99999
}


function part2(input: string, mapSize: Position): string {
    const obstacles = readInput(input)

    let maxObstacles = 0;

    const map = newMap<Terrain>(mapSize, '.');

    for (; maxObstacles < obstacles.length; maxObstacles++) {
        writeMap(obstacles[maxObstacles], map, '#')
        console.log('trying obstacle', maxObstacles)
        // printMap(map)
        const didConnect = checkPath(map, mapSize);
        if (!didConnect) {
            break;
        }
    }

    const lastObstacle = obstacles[maxObstacles];

    console.log('ans', maxObstacles, lastObstacle)

    return `${lastObstacle.x},${lastObstacle.y}`;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData, { x: 7, y: 7 })).toBe("6,1")
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/18.txt");

    const ans = part2(text, { x: 71, y: 71 })
    expect(ans).toBe(1)
})