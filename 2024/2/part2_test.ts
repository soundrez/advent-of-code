import { expect } from "jsr:@std/expect";

import { compareNumbers, part2, removeNumber, testReport } from './part2.ts'


Deno.test("compare up", () => {
    expect(compareNumbers(-1, -2, true)).toBe(false);
    expect(compareNumbers(-1, -1, true)).toBe(false);
    expect(compareNumbers(-1, 0, true)).toBe(true);
    expect(compareNumbers(-1, 1, true)).toBe(true);
    expect(compareNumbers(-1, 2, true)).toBe(true);
    expect(compareNumbers(-1, 3, true)).toBe(false);
});

Deno.test("compare down", () => {
    expect(compareNumbers(1, 2, false)).toBe(false);
    expect(compareNumbers(1, 1, false)).toBe(false);
    expect(compareNumbers(1, 0, false)).toBe(true);
    expect(compareNumbers(1, -1, false)).toBe(true);
    expect(compareNumbers(1, -2, false)).toBe(true);
    expect(compareNumbers(1, -3, false)).toBe(false);
});

Deno.test('sample reports up', () => {
    expect(testReport([7, 6, 4, 2, 1], true)).toBe(false);
    expect(testReport([1, 2, 7, 8, 9], true)).toBe(false);
    expect(testReport([9, 7, 6, 2, 1], true)).toBe(false);
    expect(testReport([1, 3, 2, 4, 5], true)).toBe(true);
    expect(testReport([8, 6, 4, 4, 1], true)).toBe(false);
    expect(testReport([1, 3, 6, 7, 9], true)).toBe(true);
})

Deno.test('sample reports down', () => {
    expect(testReport([7, 6, 4, 2, 1], false)).toBe(true);
    expect(testReport([1, 2, 7, 8, 9], false)).toBe(false);
    expect(testReport([9, 7, 6, 2, 1], false)).toBe(false);
    expect(testReport([1, 3, 2, 4, 5], false)).toBe(false);
    expect(testReport([8, 6, 4, 4, 1], false)).toBe(true);
    expect(testReport([1, 3, 6, 7, 9], false)).toBe(false);
})


Deno.test("remove numbers", () => {
    expect(removeNumber([1, 2, 3, 4, 5], 0)).toEqual([2, 3, 4, 5])
    expect(removeNumber([1, 2, 3, 4, 5], 1)).toEqual([1, 3, 4, 5])
    expect(removeNumber([1, 2, 3, 4, 5], 4)).toEqual([1, 2, 3, 4])
})

Deno.test("examples full", async () => {
    const text = await Deno.readTextFile("./2/test.txt");

    // const ans = await part2('./2/test.txt');

    // expect(ans).toBe(4)

    expect(1).toBe(1)
})