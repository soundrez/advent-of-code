import { expect } from "jsr:@std/expect/expect";
import { removeDonts } from "./part2.ts";



Deno.test('removeDonts', () => {
    const removed = removeDonts("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))")
    expect(removed).toEqual("xmul(2,4)&mul[3,7]!^?mul(8,5))")
})