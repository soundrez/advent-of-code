
function checkChar(char: string): 'number' | 'comma' | 'close-bracket' | 'other' {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(char)) {
        return 'number';
    }
    if (char === ',') {
        return 'comma'
    }
    if (char === ')') {
        return 'close-bracket'
    }
    return 'other';
}


export function computeMul(input: string): number {


    let status: 'first' | 'second' = 'first';

    let firstBuffer = '';
    let secondBuffer = '';
    let closed = false;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const charType = checkChar(char)

        if (charType === 'other') {
            return 0;
        }

        else if (charType === 'close-bracket') {
            if (status === 'second') {
                closed = true;
                break;
            } else {
                return 0
            }
        }

        else if (charType === 'comma') {
            if (status === 'first') {
                status = 'second'
            } else {
                return 0;
            }
        }

        // must be a number
        else {
            if (status === 'first') {
                firstBuffer += char;
            } else {
                secondBuffer += char;
            }
        }
    }
    if (!closed) {
        return 0;
    }

    console.log('buffers', { firstBuffer, secondBuffer })

    // extract first number
    const firstNum = Number(firstBuffer)

    // extract second number
    const secondNum = Number(secondBuffer)

    return firstNum * secondNum
}

export function part1(text: string): number {
    // const text = await Deno.readTextFile("./2/input.txt");

    const maybeMuls = text.split('mul(')

    let mulTotal = 0;

    maybeMuls.forEach(maybeMul => {
        mulTotal += computeMul(maybeMul)
    });

    console.log("total:", mulTotal)
    return mulTotal
}


// part1();