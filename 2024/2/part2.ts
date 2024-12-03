

export function compareNumbers(number1: number, number2: number, testUp: boolean): boolean {
    const minValid = testUp ? 1 : -3;
    const maxValid = testUp ? 3 : -1;

    const difference = number2 - number1;


    return difference >= minValid && difference <= maxValid;
}

export function findDanger(levels: number[], testUp: boolean): number | null {
    const comparisons = levels.length - 1;


    for (let i = 0; i < comparisons; i++) {
        if (!compareNumbers(levels[i], levels[i + 1], testUp)) {
            return i
        }
    }
    return null;
}

export function removeNumber(levels: number[], index: number): number[] {
    return [...levels.slice(0, index), ...levels.slice(index + 1)];
}

function testReport2(levels: number[]): boolean {

    let dangerUp = findDanger(levels, true);

    if (dangerUp === null) {
        return true
    }

    const newNumbers = removeNumber(levels, dangerUp)
    dangerUp = findDanger(newNumbers, true);

    if (dangerUp === null) {
        return true
    }


    let dangerDown = findDanger(levels, false);

    if (dangerDown === null) {
        return true
    }

    const newNumbers2 = removeNumber(levels, dangerDown);
    dangerDown = findDanger(newNumbers2, false);


    return dangerDown === null

}

export function testReport(levels: number[], testUp: boolean): boolean {

    const comparisons = levels.length - 1;

    let failed = false;
    let dampenerUsed = null;

    for (let i = 0; i < comparisons; i++) {

        // has this number been removed?
        if (dampenerUsed === i) {
            continue;
        }

        if (!compareNumbers(levels[i], levels[i + 1], testUp)) {

            // It failed, try using the dampener
            if (dampenerUsed !== null) {
                // Nope, used already
                failed = true;
            } else if (i === levels.length - 1) {
                // last one - all good
            } else {
                console.log(`Removing ${levels[i + 1]} at ${i + 1} while going ${testUp ? 'up' : 'down'}`)
                dampenerUsed = i + 1;
                // check what's next
                if (!compareNumbers(levels[i], levels[i + 2], testUp)) {
                    failed = true;
                }
            }
        }
    }
    console.log(`${testUp ? 'up' : 'down'} ${failed ? 'failed' : 'passed'}`)
    return !failed;
}


export async function part2(filepath: string): Promise<number> {
    // const text = await Deno.readTextFile(filepath);
    const text = await Deno.readTextFile("./2/input.txt");
    // const text = await Deno.readTextFile("./2/test.txt");

    const text2 = text.split('\n')


    let safeCount = 0;
    text2.forEach(report => {
        if (report.length == 0) {
            return;
        }

        const levels = report.split(' ').map(a => Number(a));


        const result = testReport2(levels);

        if (result) {
            safeCount += 1;
        }
    })


    console.log('safe:', safeCount)
    return safeCount;
}

await part2('')