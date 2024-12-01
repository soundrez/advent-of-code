

// if "/foo/bar.txt" contains the text "hello world":
// using file = await Deno.open("./2024/1/input.txt");

const text = await Deno.readTextFile("./2024/1/input.txt");

// const text = `3   4
// 4   3
// 2   5
// 1   3
// 3   9
// 3   3`

const text2 = text.split('\n')

// console.log(text2)

const leftList: number[] = [];
const rightList: number[] = [];

text2.forEach(line => {
    if (line.length === 0) {
        return;
    }
    const pair = line.split('   ')
    leftList.push(Number(pair[0]));
    rightList.push(Number(pair[1]));
});

leftList.sort();
rightList.sort();

// console.log(leftList)

const differences: number[] = [];

leftList.forEach((leftItem, index) => {
    const rightItem = rightList[index];
    differences.push(Math.abs(leftItem - rightItem))
})


const ans = differences.reduce((prev, total) => {
    return prev + total
}, 0)

console.log("difference score:", ans);

let similarity = 0

leftList.forEach(leftItem => {
    // console.log('leftList', leftList)
    // const leftMatches = leftList.filter(val => val === leftItem).length
    const rightMatches = rightList.filter(val => val === leftItem).length
    const multiplied = leftItem * rightMatches
    console.log('multiplied', leftItem, rightMatches, multiplied)
    similarity += multiplied;
});

console.log("similarity score: ", similarity)