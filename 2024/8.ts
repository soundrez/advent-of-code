import { expect } from "jsr:@std/expect/expect";


const exampleData = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`

type Position = { x: number, y: number }

type MapData = {
    antennas: Record<string, Position[]>,
    mapSize: Position,
}

function readMap(input: string): MapData {

    const items = input.split("\n")
        .filter(a => a.length > 0)
        .map(line => line.split(""))

    const mapSize = { x: items[0].length, y: items.length }

    const antennas: Record<string, Position[]> = {};

    items.forEach((row, y) => row.forEach((item, x) => {
        if (item === '.') {
            return;
        }
        if (!antennas[item]) {
            antennas[item] = []
        }
        antennas[item].push({ x, y })
    }))

    console.log('size', mapSize)

    return { antennas, mapSize }
}

function isInMap(position: Position, mapSize: Position): boolean {
    return position.x >= 0 && position.y >= 0 && position.x < mapSize.x && position.y < mapSize.y
}


function findAntinode(firstAntenna: Position, secondAntenna: Position, mapSize: Position): Position | null {
    if (firstAntenna.x === secondAntenna.x && firstAntenna.y === secondAntenna.y) {
        return null;
    }
    const diffX = firstAntenna.x - secondAntenna.x;
    const diffY = firstAntenna.y - secondAntenna.y;

    const newPosition = { x: firstAntenna.x + diffX, y: firstAntenna.y + diffY }

    if (!isInMap(newPosition, mapSize)) {
        return null;
    }
    return newPosition
}


function part1(input: string): number {

    const mapData = readMap(input);

    const antinodesMap: Array<Array<boolean | undefined>> = Array(mapData.mapSize.y)
        .fill(null)
        .map(() => Array(mapData.mapSize.x));

    Object.values(mapData.antennas).forEach(antennaType => {
        for (const firstAntenna of antennaType) {
            for (const secondAntenna of antennaType) {
                const antinode = findAntinode(firstAntenna, secondAntenna, mapData.mapSize);
                if (antinode) {
                    try {
                        antinodesMap[antinode.y][antinode.x] = true;
                    } catch (err) {
                        console.log('couldnt set', antinode, antinodesMap)
                        throw err
                    }
                }
            }
        }
    })

    console.log(antinodesMap)

    return antinodesMap.flat().filter(v => v === true).length;
}

Deno.test('part 1 example', () => {
    expect(part1(exampleData)).toBe(14)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/8.txt");

    const ans = part1(text)
    expect(ans).toBe(357)
})

function findAntinodes2(firstAntenna: Position, secondAntenna: Position, mapSize: Position): Position[] {

    if (firstAntenna.x === secondAntenna.x && firstAntenna.y === secondAntenna.y) {
        return [];
    }

    const confirmedPositions: Position[] = []

    const diffX = firstAntenna.x - secondAntenna.x;
    const diffY = firstAntenna.y - secondAntenna.y;

    let newPosition: Position = { ...firstAntenna }

    let n = 0

    while (true) {
        n++;
        if (n > 1000000) {
            throw new Error('too big')
        }
        console.log('newPosition', newPosition)
        newPosition = { x: newPosition.x - diffX, y: newPosition.y - diffY }

        if (!isInMap(newPosition, mapSize)) {
            return confirmedPositions;
        }

        confirmedPositions.push(newPosition)
    }
}

function part2(input: string): number {
    const mapData = readMap(input);

    const antinodesMap: Array<Array<boolean | undefined>> = Array(mapData.mapSize.y)
        .fill(null)
        .map(() => Array(mapData.mapSize.x));

    Object.values(mapData.antennas).forEach(antennaType => {
        for (const firstAntenna of antennaType) {
            for (const secondAntenna of antennaType) {
                const antinodes = findAntinodes2(firstAntenna, secondAntenna, mapData.mapSize);

                antinodes.forEach(antinode => {
                    antinodesMap[antinode.y][antinode.x] = true;
                });

            }
        }
    })

    console.log(antinodesMap)

    return antinodesMap.flat().filter(v => v === true).length;

}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(34)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/8.txt");

    const ans = part2(text)
    expect(ans).toBe(1266)
})