import { expect } from "jsr:@std/expect/expect";

const exampleData2 = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`

const exampleData = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`

type MapIcon = '#' | '.' | 'O' | '@'
type Direction = '^' | '>' | 'v' | '<'
type Position = { x: number, y: number }

type Input = {
    map: MapIcon[][],
    moves: Direction[];
    robotPos: Position;
}

function readInput(input: string): Input {
    const [mapData, movementData] = input.split('\n\n');
    let robotPos: Position = { x: 0, y: 0 };

    const map = mapData.split('\n').filter(a => a.length > 0).map(line => line.split('')) as MapIcon[][];
    const moves = movementData.split('\n').filter(a => a.length).map(line => line.split('')).flat() as Direction[];

    map.forEach((a, y) => a.forEach((b, x) => {
        if (b === '@') {
            robotPos = { x, y }
        }
    }))
    return { map, moves, robotPos }
}

Deno.test('readInput', () => {
    const ans = readInput(exampleData2);

    expect(ans.map).toEqual([
        ['#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', '.', '.', 'O', '.', 'O', '.', '#'],
        ['#', '#', '@', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '#', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', '.', '.', '.', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#'],
    ])
    expect(ans.robotPos).toEqual({ x: 2, y: 2 })
    expect(ans.moves.length).toEqual(15)
})

function getNextPos(pos: Position, dir: Direction): Position {
    const offset = [0, 0];

    if (dir === '<') {
        offset[0] = -1
    }
    if (dir === '^') {
        offset[1] = -1
    }
    if (dir === '>') {
        offset[0] = 1
    }
    if (dir === 'v') {
        offset[1] = 1
    }
    return { x: pos.x + offset[0], y: pos.y + offset[1] }
}

function move(input: Input, move: Direction): Input {
    const { robotPos, map } = input;
    let freeSpace: Position | null = null;
    let nextPos: Position = { ...robotPos };
    let offset = 0;
    while (freeSpace === null) {
        offset += 1;
        nextPos = getNextPos(nextPos, move);
        const nextLoc = map[nextPos.y][nextPos.x];

        if (nextLoc === '#') {
            return input;
        }
        if (nextLoc === '.') {
            freeSpace = nextPos;
        }
    }

    if (offset > 1) {
        map[freeSpace.y][freeSpace.x] = 'O';
    }
    map[robotPos.y][robotPos.x] = '.';

    const newBot = getNextPos(robotPos, move);
    map[newBot.y][newBot.x] = '@'
    input.robotPos = newBot;

    return input;
}

Deno.test('move', () => {
    const input = readInput(exampleData2);

    const moved = move(input, input.moves[0]);
    expect(moved.map).toEqual([
        ['#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', '.', '.', 'O', '.', 'O', '.', '#'],
        ['#', '#', '@', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '#', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', '.', '.', '.', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#'],
    ])
    expect(moved.robotPos).toEqual({ x: 2, y: 2 })

    const moved2 = move(input, input.moves[1]);
    expect(moved2.map).toEqual([
        ['#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', '.', '@', 'O', '.', 'O', '.', '#'],
        ['#', '#', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '#', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', '.', '.', '.', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#'],
    ])
    expect(moved2.robotPos).toEqual({ x: 2, y: 1 })

    const moved3 = move(input, '>');
    expect(moved3.map).toEqual([
        ['#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', '.', '.', '@', 'O', 'O', '.', '#'],
        ['#', '#', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '#', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', '.', '.', '.', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#'],
    ])
    expect(moved3.robotPos).toEqual({ x: 3, y: 1 })

    const moved4 = move(input, '>');
    expect(moved4.map).toEqual([
        ['#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', '.', '.', '.', '@', 'O', 'O', '#'],
        ['#', '#', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '#', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', '.', '.', '.', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#'],
    ])
    expect(moved4.robotPos).toEqual({ x: 4, y: 1 })

    const moved5 = move(input, '>');
    expect(moved5.map).toEqual([
        ['#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', '.', '.', '.', '@', 'O', 'O', '#'],
        ['#', '#', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '#', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', 'O', '.', '.', '#'],
        ['#', '.', '.', '.', '.', '.', '.', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#'],
    ])
    expect(moved5.robotPos).toEqual({ x: 4, y: 1 })
})

function calcGPS(map: MapIcon[][]): number {
    let total = 0;
    map.forEach((line, y) => line.forEach((m, x) => {
        if (m === 'O') {
            total += y * 100 + x
        }
    }))
    return total;
}

function part1(input: string): number {
    let data = readInput(input);



    data.moves.forEach(dir => {
        data = move(data, dir)
    })


    return calcGPS(data.map);
}

Deno.test('part1 example', () => {
    expect(part1(exampleData2)).toEqual(2028)
    expect(part1(exampleData)).toEqual(10092)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/15.txt");

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
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/15.txt");

    const ans = part2(text)
    expect(ans).toBe(1)
})