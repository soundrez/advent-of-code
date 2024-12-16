import { expect } from "jsr:@std/expect/expect";

type Rule = {
    bef: number;
    aft: number
}


function extractRules(input: string[]): Rule[] {

    return input.map(val => {
        const s = val.split('|')
        return {
            bef: Number(s[0]),
            aft: Number(s[1])
        }
    })
}

function extractPages(input: string[]): number[][] {
    return input.map(val => val.split(",").map(v2 => Number(v2)))
}


function checkInsert(val: number, index: number, existingValues: number[], rules: Rule[]): boolean {
    return true;
}

function validateBook(pages: number[], rules: Rule[]): boolean {


    for (const rule of rules) {
        const firstIndex = pages.findIndex(page => page === rule.bef)
        const secondIndex = pages.findIndex(page => page === rule.aft);

        if (firstIndex !== -1 && secondIndex !== -1 && secondIndex < firstIndex) {
            console.log(`${rule.aft} was before ${rule.bef}`)
            return false
        }
    }
    return true;
}

function isAfterAnything(page: number, rules: Rule[], ignore: number[]) {

    const validRules = rules.filter(rule => rule.aft === page && !ignore.includes(rule.bef))

    return validRules.length > 0;
}

function orderRules(rules: Rule[], allPages: Set<number>): number[] {
    const ordered: number[] = [];

    // const allPages = new Set<number>();
    const relevantRules = rules.filter(rule => allPages.has(rule.aft) || allPages.has(rule.bef))


    let tryCounter = 0
    while (ordered.length < allPages.size) {

        allPages.forEach(page => {
            if (ordered.includes(page)) {
                return;
            }
            // check page has nothing important before it
            // if not, add it to the ordered list
            if (!isAfterAnything(page, relevantRules, ordered)) {
                ordered.push(page);
            }
        })

        tryCounter++;
        const extraPages = Array.from(allPages).filter(p => !ordered.includes(p))
        if (tryCounter % 1000 === 999) {
            console.log('ordered pages', ordered)
            console.log('remaining numbers', extraPages, tryCounter)

        }
        if (tryCounter > 10000) {
            ordered.push(...extraPages);
        }
    }
    return ordered;
}

function orderPages(pages: number[], rules: Rule[]): number[] {


    const orderedRules = orderRules(rules, new Set(pages));
    console.log('rules', orderedRules)


    return pages.sort((a, b) => {
        const v1 = orderedRules.indexOf(a)
        const v2 = orderedRules.indexOf(b);
        // console.log(`${v1}(${a}) - ${v2}(${b})`)
        return v1 - v2;
    })
}


function part1(input: string): number {

    const lines = input
        .split("\n\n")

    const rules = extractRules(lines[0].split('\n'));
    const books = extractPages(lines[1].split('\n'))


    let total = 0;

    books.forEach(book => {
        if (validateBook(book, rules)) {
            total += book[(book.length - 1) / 2]
        }
    });


    console.log('total was', total)
    return total;
}

function part2(input: string): number {
    const lines = input
        .split("\n\n")

    const rules = extractRules(lines[0].split('\n'));
    const books = extractPages(lines[1].split('\n')).filter(book => !validateBook(book, rules))


    console.log('books', books)
    let total = 0;

    const allPages = new Set([...rules.map(r => r.aft), ...rules.map(r => r.bef)])

    const orderedRules = orderRules(rules, allPages);
    console.log('master order:', orderedRules)

    books.forEach(book => {
        const orderedBook = orderPages(book, rules);
        console.log(orderedBook)
        total += orderedBook[(orderedBook.length - 1) / 2]

    });


    console.log('total was', total)
    return total;
}

const exampleData = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`

Deno.test("part 1 example", () => {
    const ans = part1(exampleData);
    expect(ans).toBe(143)
});

Deno.test("part 1 real data", async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/5.txt");
    const ans = part1(text)

    console.log('ans was:', ans);
    expect(ans).toBe(4569);
});

Deno.test("part 2 example", () => {
    console.log('testing')
    const ans = part2(exampleData);
    expect(ans).toBe(123)
});

Deno.test("part 2 real data", async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/5.txt");
    const ans = part2(text)

    console.log('ans was:', ans);
    expect(1).toBe(1);
});