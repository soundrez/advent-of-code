import { expect } from "jsr:@std/expect/expect";


const exampleData = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`

type PlotData = { plant: string, group?: number, edges?: number }
type MapData = PlotData[][];

type Position = { x: number, y: number }


function readMap(input: string): MapData {

    const items = input.split("\n")
        .filter(a => a.length > 0)
        .map(line => line.split("").map(v => ({ plant: v })))
    return items;
}

function isInMap(position: Position, mapSize: Position): boolean {
    return position.x >= 0 && position.y >= 0 && position.x < mapSize.x && position.y < mapSize.y
}

function countEdges(position: Position, map: MapData): number {

    const plant = map[position.y][position.x].plant;
    const mapSize = { x: map[0].length, y: map.length }

    const positions: Position[] = [
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y },
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 },
    ]
    return positions.filter(p => {
        if (!isInMap(p, mapSize)) {
            return true
        }
        if (map[p.y][p.x].plant === plant) {
            return false
        }
        return true
    }).length
}

function addGroup(position: Position, map: MapData) {
    const start = map[position.y][position.x];
    const mapSize = { x: map[0].length, y: map.length }
    const positions: Position[] = [
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y },
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 },
    ].filter(p => {
        if (!isInMap(p, mapSize)) {
            return false
        }
        const posVal = map[p.y][p.x];
        if (posVal.plant === start.plant && posVal.group === undefined) {
            return true
        }
        return false
    })
    console.log('positions with', start.plant, positions)

    positions.forEach(p => {
        map[p.y][p.x].group = start.group;
        addGroup(p, map)
    })
}

function part1(input: string): number {
    const map = readMap(input);

    let nextGroupId = 1;
    map[0][0].group = 0;

    map.forEach((row, y) => row.forEach((plot, x) => {
        const curPlot = map[y][x];
        if (curPlot.group === undefined) {
            console.log(`grouping ${x},${y}`, curPlot, nextGroupId)
            curPlot.group = nextGroupId;
            nextGroupId += 1;
        }
        addGroup({ x, y }, map)
        curPlot.edges = countEdges({ x, y }, map);

    }))

    const flattenedMap = map.flat();

    let totalPrice = 0;

    for (let i = 0; i < nextGroupId; i++) {
        const groupItems = flattenedMap.filter(a => a.group === i);
        const perimiter = groupItems.reduce((prev, cur) => prev + cur.edges!, 0);
        const area = groupItems.length;
        totalPrice += perimiter * area;
    }
    console.log('final map', map)


    return totalPrice;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData)).toEqual(1930)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/12.txt");

    const ans = part1(text)
    expect(ans).toBe(1)
})


function part2(input: string): number {
    return 0;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(80)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/12.txt");

    const ans = part2(text)
    expect(ans).toBe(1)
})