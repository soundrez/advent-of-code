const text = await Deno.readTextFile("./2/input.txt");
// const text = await Deno.readTextFile("./2/test.txt");

const text2 = text.split('\n')

let safeCount = 0;

text2.forEach(report => {
    if (report.length == 0) {
        return;
    }

    const levels = report.split(' ').map(a => Number(a));
    const comparisons = levels.length - 1;
    let failed = false;

    const isIncreasing = levels[0] < levels[1];
    const safeMin = isIncreasing ? 1 : -3
    const safeMax = isIncreasing ? 3 : -1


    for (let i = 0; i < comparisons; i++) {
        const difference = levels[i + 1] - levels[i];

        if (difference < safeMin || difference > safeMax) {
            failed = true;
        }
    }

    console.log(`${report} - ${failed ? 'Unsafe' : 'Safe'}`)

    if (!failed) {
        safeCount += 1;
    }
})


console.log('safe:', safeCount)