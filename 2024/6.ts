import { expect } from "jsr:@std/expect";


const PATH = 'X'
const OBS = '#'
const BLA = '.'

type Location = '.' | '#' | 'X' | 'guard' | 'outside';
type Map = Location[][];
type Position = { x: number, y: number }
type Direction = 'up' | 'down' | 'left' | 'right';

type GuardState = { position: Position, direction: Direction }

const exampleData = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

function getMap(input: string): Map {
    return input.split('\n').map(row => row.split('').map(loc => {
        if (loc === '.') { return '.' }
        if (loc === '#') { return '#' }
        if (loc === 'X') { return 'X' }
        if (loc === '^') { return 'guard' }
        throw new Error(`Location not recognised: ${loc}`)
    })).filter(a => a.length > 0)
}

Deno.test('get map', () => {
    expect(getMap(`.#^X\nX^#.`)).toEqual([['.', '#', 'guard', 'X'], ['X', 'guard', '#', '.']])
})

function findGuard(map: Map): GuardState {
    let position: Position | null = null;
    map.forEach((row, rowNumber) => {
        const result = row.indexOf('guard')
        if (result != -1) {
            position = { x: result, y: rowNumber }
        }
    })
    if (position != null) {
        return { position, direction: 'up' }
    }
    throw new Error("Guard not found")
}

Deno.test('find guard', () => {
    expect(findGuard(getMap(exampleData))).toEqual({ position: { x: 4, y: 6 }, direction: 'up' })
})

function rotate(dir: Direction): Direction {
    if (dir === 'up') { return 'right' }
    if (dir === 'right') { return 'down' }
    if (dir === 'down') { return 'left' }
    return 'up'
}

function getNext(state: GuardState): Position {
    if (state.direction === 'down') {
        return { x: state.position.x, y: state.position.y + 1 }
    }
    if (state.direction === 'up') {
        return { x: state.position.x, y: state.position.y - 1 }
    }
    if (state.direction === 'left') {
        return { x: state.position.x - 1, y: state.position.y }
    }
    return { x: state.position.x + 1, y: state.position.y }

}

function isOnMap(position: Position, map: Map): boolean {
    return position.x >= 0 && position.x < map[0].length && position.y >= 0 && position.y < map.length;
}

function move(state: GuardState, map: Map, extraObstacle?: Position): GuardState {
    const next = getNext(state)



    if (isOnMap(next, map) && (map[next.y][next.x] === '#')) {
        return {
            ...state,
            direction: rotate(state.direction)
        }
    }

    if (extraObstacle?.x === next.x && extraObstacle.y === next.y) {
        return {
            ...state,
            direction: rotate(state.direction)
        }
    }

    return {
        ...state,
        position: next
    }
}




function part1(input: string): number {
    const map = getMap(input);

    let guardPos = findGuard(map);

    map[guardPos.position.y][guardPos.position.x] = 'X';

    while (true) {
        guardPos = move(guardPos, map);

        if (!isOnMap(guardPos.position, map)) {
            break;
        }
        map[guardPos.position.y][guardPos.position.x] = 'X';
    }

    const pathCount = map.flat().filter(v => v === 'X').length;

    console.log({ pathCount })

    map.forEach(v => console.log(v.join('')))

    return pathCount

}



Deno.test('part 1 example', () => {
    const ans = part1(exampleData)
    expect(ans).toBe(41)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/6.txt");

    const ans = part1(text)
    expect(ans).toBe(41)
})



type Pathways = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

function hasBeenHere(guardPos: GuardState, pathways: Pathways[][]): boolean {
    // console.log(guardPos.position)
    try {

        if (guardPos.direction === 'down' && pathways[guardPos.position.y][guardPos.position.x].down) {
            return true;
        }
        if (guardPos.direction === 'up' && pathways[guardPos.position.y][guardPos.position.x].up) {
            return true;
        }
        if (guardPos.direction === 'left' && pathways[guardPos.position.y][guardPos.position.x].left) {
            return true;
        }
        if (guardPos.direction === 'right' && pathways[guardPos.position.y][guardPos.position.x].right) {
            return true;
        }
        return false
    } catch (e) {
        console.log('error', guardPos, pathways.length, pathways[guardPos.position.y].length)
        throw e
    }
}

function canExit(map: Map, extraObstacle?: Position): boolean {
    const pathways = map.map(l => l.map(v => ({ up: false, down: false, left: false, right: false } as Pathways)))
    let guardPos = findGuard(map);


    pathways[guardPos.position.y][guardPos.position.x].up = true;


    while (true) {
        guardPos = move(guardPos, map, extraObstacle);

        if (!isOnMap(guardPos.position, map)) {
            return true;
        }

        if (hasBeenHere(guardPos, pathways)) {
            return false;
        }

        if (guardPos.direction === 'down') {
            pathways[guardPos.position.y][guardPos.position.x].down = true;
        }
        if (guardPos.direction === 'up') {
            pathways[guardPos.position.y][guardPos.position.x].up = true;
        }
        if (guardPos.direction === 'left') {
            pathways[guardPos.position.y][guardPos.position.x].left = true;
        }
        if (guardPos.direction === 'right') {
            pathways[guardPos.position.y][guardPos.position.x].right = true;
        }
    }
}

function part2(input: string): number {
    const map = getMap(input);
    let guardPos = findGuard(map);

    let trappedCount = 0

    map.forEach((row, y) => {
        row.forEach((col, x) => {
            // console.log('row', y, x)
            if (guardPos.position.x === x && guardPos.position.y === y) {
                return;
            }
            if (map[y][x] === '#') {
                return
            }

            if (!canExit(map, { x, y })) {
                // console.log('trapped', x, y)
                trappedCount += 1;
            }
        })
    })


    return trappedCount;
}

Deno.test('part 2 example', () => {
    const ans = part2(exampleData)
    expect(ans).toBe(6)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/6.txt");

    const ans = part2(text)
    expect(ans).toBe(1516)
})