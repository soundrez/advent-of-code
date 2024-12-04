import { expect } from "jsr:@std/expect/expect";
import { removeDonts, part2 } from "./part2.ts";



Deno.test('removeDonts', () => {
    const removed = removeDonts("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))")
    expect(removed).toEqual("xmul(2,4)&mul[3,7]!^?mul(8,5))")
})


Deno.test('excercise', async () => {
    console.log(Deno.execPath())
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/3/input.txt");


    const results = part2(text)

    console.log('result', results)

    expect(typeof results).toEqual('number')
})