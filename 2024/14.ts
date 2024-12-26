import { expect } from "jsr:@std/expect/expect";


const exampleData = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`

type Position = { x: number, y: number }

type Robot = {
    position: Position;
    velocity: Position;
}


function readMap(input: string): Robot[] {

    const items = input.split("\n")
        .filter(a => a.length > 0)
        .map((line) => {
            const [pos, vel] = line.slice(2).split(" v=").map(a => a.split(","))

            return {
                position: { x: Number(pos[0]), y: Number(pos[1]) },
                velocity: { x: Number(vel[0]), y: Number(vel[1]) }
            }
        })
        .flat()
    return items;
}

Deno.test('readMap', () => {
    const ans = readMap(exampleData);
    expect(ans[0]).toEqual({ position: { x: 0, y: 4, }, velocity: { x: 3, y: -3 } })
    expect(ans[1]).toEqual({ position: { x: 6, y: 3, }, velocity: { x: -1, y: -3 } })

})

function move(robot: Robot, iterations: number, mapSize: Position): Robot {


    const absX = robot.position.x + (robot.velocity.x * iterations);
    let x = absX % mapSize.x;
    if (x < 0) {
        x = x + mapSize.x
    }

    const absY = robot.position.y + (robot.velocity.y * iterations);
    let y = absY % mapSize.y;
    if (y < 0) {
        y = y + mapSize.y
    }

    return {
        ...robot,
        position: {
            x, y
        }
    }
}

function print(bots: Robot[], mapSize: Position) {
    const map: number[][] = Array(mapSize.y).fill(0).map(line => Array(mapSize.x).fill(0))

    bots.forEach(bot => {
        map[bot.position.y][bot.position.x]++
    })

    map.forEach(line => {
        const output = line.map(a => a === 0 ? '.' : `${a}`).join('')
        Deno.writeTextFileSync("output.log", output, { append: true });
        Deno.writeTextFileSync("output.log", '\n', { append: true });

        console.log(output)
    })
}

function part1(input: string, mapSize: Position): number {
    const items = readMap(input);

    const movedItems = items.map(i => move(i, 100, mapSize));

    const midX = (mapSize.x - 1) / 2;
    const midY = (mapSize.y - 1) / 2;

    const topLeft = movedItems.filter(i => i.position.x < midX && i.position.y < midY);
    const topRight = movedItems.filter(i => i.position.x > midX && i.position.y < midY).length;
    const botLeft = movedItems.filter(i => i.position.x < midX && i.position.y > midY).length;
    const botRight = movedItems.filter(i => i.position.x > midX && i.position.y > midY).length;

    console.log({ topLeft, topRight, botLeft, botRight })

    return topLeft.length * topRight * botLeft * botRight;
}

Deno.test('part1 example', () => {
    expect(part1(exampleData, { x: 11, y: 7 })).toEqual(12)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/14.txt");

    const ans = part1(text, { x: 101, y: 103 })
    expect(ans).toBe(1)
})

function part2(input: string, mapSize: Position): number {

    let items = readMap(input);

    for (let i = 0; i < 100; i++) {
        items = items.map(i => move(i, 1, mapSize));
        console.log(i)
        Deno.writeTextFileSync("output.log", `\n\n${i} seconds:\n`, { append: true });
        print(items, mapSize)
    }


    return 0;
}

Deno.test('part 2 example', () => {
    expect(part2(exampleData, { x: 11, y: 7 })).toBe(1)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/14.txt");

    const ans = part2(text, { x: 101, y: 103 })
    expect(ans).toBe(1)
})