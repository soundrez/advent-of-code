import { expect } from "jsr:@std/expect/expect";

export type Position = { x: number, y: number }

export const directions = ['^', '>', 'v', '<'] as const;
export type Direction = typeof directions[number]

export function rotateClockwise(dir: Direction, rotations = 1): Direction {
    const rotations2 = ((rotations % 4) + 4) % 4;
    if (rotations2 === 0) return dir;
    let nextDir: Direction | null = null;
    if (dir === '<') nextDir = '^';
    if (dir === '^') nextDir = '>';
    if (dir === '>') nextDir = 'v';
    if (dir === 'v') nextDir = '<';
    if (!nextDir) throw new Error(`direction not recognised: ${dir}`)
    if (rotations2 === 1) return nextDir;
    return rotateClockwise(nextDir, rotations2 - 1)
}

Deno.test('rotations', () => {
    expect(rotateClockwise('<', 1)).toBe('^')
    expect(rotateClockwise('<', 2)).toBe('>')
    expect(rotateClockwise('<', 0)).toBe('<')
    expect(rotateClockwise('<', 4)).toBe('<')
    expect(rotateClockwise('<', 5)).toBe('^')
    expect(rotateClockwise('<', -1)).toBe('v')
})

export function addPosition(oldPos: Position, x: number, y: number): Position {
    return { x: oldPos.x + x, y: oldPos.y + y }
}

export function isOnMap(mapSize: Position): (input: Position) => boolean {
    const predicate = (input: Position) => {
        return input.x >= 0 && input.y >= 0 && input.x < mapSize.x && input.y < mapSize.y
    }
    return predicate;
}

export function newMap<T>(size: Position, val: T): T[][] {
    return new Array(size.y).fill(0).map(line => new Array(size.x).fill(val))
}

export function mapEach<T>(input: T[][], callback: (val: T, position: Position) => void) {
    input.forEach((line, y) => line.forEach((val, x) => callback(val, { x, y })))
}

export function getNextMoves(pos: Position): [Position, Position, Position, Position] {
    const { x, y } = pos;
    return [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 }
    ]
}

export function getNextMove(pos: Position, dir: Direction): Position {
    const { x, y } = pos;
    if (dir === '<') return { x: x - 1, y };
    if (dir === '^') return { x, y: y - 1 };
    if (dir === '>') return { x: x + 1, y };
    if (dir === 'v') return { x, y: y + 1 };
    throw new Error(`direction not recognised: ${dir}`)
}

export function readMap<T>(position: Position, map: T[][]): T {
    return map[position.y][position.x]
}

export function writeMap<T>(position: Position, map: T[][], newValue: T): T[][] {
    map[position.y][position.x] = newValue;
    return map
}

export function printMap<T>(map: T[][], pad: number = 0) {

    map.forEach(line => {
        console.log(line.map(val => {
            const valS = `${val}`;
            if (pad <= valS.length) {
                return val;
            }
            return [...Array(pad - valS.length).fill(' '), valS].join('')
        }).join(' '))
    })
    console.log('');
}