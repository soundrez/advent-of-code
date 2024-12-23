import { expect } from "jsr:@std/expect/expect";


const exampleData = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`

type Position = { x: number, y: number }


function readMap(input: string): number[][] {

    const items = input.split("\n")
        .filter(a => a.length > 0)
        .map(line => line.split("").map(v => v === '.' ? -1 : Number(v)))
    return items;
}
function isInMap(position: Position, map: number[][]): boolean {
    const mapSize = {
        x: map[0].length,
        y: map.length,
    }
    return position.x >= 0 && position.y >= 0 && position.x < mapSize.x && position.y < mapSize.y
}

function findTrailheads(map: number[][]): Position[] {
    const items: Position[] = [];

    map.forEach((row, y) => row.forEach((item, x) => {
        if (item === 0) {
            items.push({ x, y })
        }
    }))
    return items;
}

function searchPeaks(curPos: Position, map: number[][]): Position[] {
    const currentElevation = map[curPos.y][curPos.x]
    if (currentElevation === 9) {
        return [curPos];
    }

    const nextPositions: Position[] = [
        { x: curPos.x + 1, y: curPos.y },
        { x: curPos.x - 1, y: curPos.y },
        { x: curPos.x, y: curPos.y + 1 },
        { x: curPos.x, y: curPos.y - 1 }
    ]
    const ans = nextPositions
        .filter(pos => {
            // off the map
            if (!isInMap(pos, map)) {
                return false;
            }
            // going up
            if (map[pos.y][pos.x] === currentElevation + 1) {
                return true;
            }
            // anything else
            return false;
        })
        .map(pos => searchPeaks(pos, map))
        .flat();

    return ans;
}

function getTrailheadScore(trailhead: Position, map: number[][]): number {


    const peaks = searchPeaks(trailhead, map);

    const uniquePeaks = new Set();

    peaks.forEach(peak => {
        uniquePeaks.add(JSON.stringify(peak))
    })

    return uniquePeaks.size
}

function part1(input: string): number {
    const map = readMap(input);

    const trailheads = findTrailheads(map);

    let score = 0;

    trailheads.forEach(trailhead => {
        score += getTrailheadScore(trailhead, map)
    })

    return score;
}

Deno.test('part1 example', () => {

    expect(part1(exampleData)).toEqual(36)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/10.txt");

    const ans = part1(text)
    expect(ans).toBe(776)
})

function getTrailheadScore2(trailhead: Position, map: number[][]): number {

    const peaks = searchPeaks(trailhead, map);

    return peaks.length;
}

function part2(input: string): number {
    const map = readMap(input);

    const trailheads = findTrailheads(map);

    let score = 0;

    trailheads.forEach(trailhead => {
        score += getTrailheadScore2(trailhead, map)
    })

    return score;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(81)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/10.txt");

    const ans = part2(text)
    expect(ans).toBe(1)
})