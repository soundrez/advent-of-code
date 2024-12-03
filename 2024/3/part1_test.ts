import { expect } from "jsr:@std/expect/expect";
import { computeMul, part1 } from "./part1.ts";


Deno.test('valid examples', () => {
    expect(computeMul('2,4)%&')).toEqual(8)
})
Deno.test('invalid examples', () => {
    expect(computeMul('mul(32,64]then(')).toEqual(0)
})

Deno.test('example full', () => {
    const results = part1('xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))')
    expect(results).toEqual(161)
})

Deno.test('excercise', async () => {
    console.log(Deno.execPath())
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/3/input.txt");


    const results = part1(text)

    console.log('result', results)

    expect(typeof results).toEqual('number')
})