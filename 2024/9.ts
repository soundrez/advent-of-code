import { expect } from "jsr:@std/expect/expect";

const exampleData = `2333133121414131402`

function readData(input: string): string[] {
    const data: string[] = input.split('');

    const expandedData: string[] = [];

    let isFile = true;
    let fileId = 0
    data.forEach(item => {
        for (let n = 0; n < Number(item); n++) {
            if (isFile) {
                expandedData.push(`${fileId}`);
            } else {
                expandedData.push(".");
            }
        }
        isFile = !isFile;
        if (isFile) {
            fileId += 1;
        }
    })
    return expandedData;
}

Deno.test('expander', () => {
    expect(readData('12345').join('')).toBe('0..111....22222')
})

function calcChecksum(input: string[]): number {
    let total = 0;

    input.forEach((item, index) => {
        if (item !== '.') {
            total += Number(item) * index;
        }
    });
    return total;
}

Deno.test('calcChecksum', () => {
    expect(calcChecksum('0099811188827773336446555566..............'.split(''))).toBe(1928)
})

function part1(input: string): number {
    const data = readData(input);

    const emptyIndexes: number[] = [];

    data.forEach((element, index) => {
        if (element === ".") {
            emptyIndexes.push(index)
        }
    });

    const emptyIndexCount = emptyIndexes.length;

    for (let i = 0; i < emptyIndexCount; i++) {
        const endIndex = data.length - (1 + i);

        const endItem = data[endIndex];

        if (endItem === ".") {
            emptyIndexes.pop();
            continue;
        }

        data[emptyIndexes[0]] = endItem;
        data[endIndex] = "."
        emptyIndexes.shift();
    }

    console.log('sorted', data);

    const ans = calcChecksum(data);

    console.log('ans', ans);
    return ans;
}

Deno.test('part 1 example', () => {
    expect(part1(exampleData)).toBe(1928)
})

Deno.test('part 1 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/9.txt");

    const ans = part1(text)
    expect(ans).toBe(6398608069280)
})



type FileSection = {
    size: number;
    fileId: number | null // null implies empty space
}

function readData2(input: string): FileSection[] {
    const data: string[] = input.split('');

    const expandedData: FileSection[] = [];

    let isFile = true;
    let fileId = 0
    data.forEach((item) => {

        expandedData.push({
            size: Number(item),
            fileId: isFile ? fileId : null,
        });


        isFile = !isFile;
        if (isFile) {
            fileId += 1;
        }
    })
    console.log('expanded', expandedData)
    return expandedData;
}

function moveFile(disc: FileSection[], oldIndex: number, newIndex: number): FileSection[] {

    const file = { ...disc[oldIndex] };
    const freeSpace = disc[newIndex];
    disc[oldIndex].fileId = null;


    if (freeSpace.size === file.size) {
        freeSpace.fileId = file.fileId;
        file.fileId = null;
        return disc;
    }

    const writtenData = [
        ...disc.slice(0, newIndex),
        { ...file },
        { size: freeSpace.size - file.size, fileId: null },
        ...disc.slice(newIndex + 1)
    ]

    return writtenData;

}

Deno.test('writeData', () => {
    const input: FileSection[] = [
        { size: 1, fileId: 1 },
        { size: 4, fileId: null },
        { size: 2, fileId: 2 },
        { size: 3, fileId: 3 },
    ];
    const output = moveFile(input, 3, 1);
    expect(output).toEqual([
        { size: 1, fileId: 1 },
        { size: 3, fileId: 3 },
        { size: 1, fileId: null },
        { size: 2, fileId: 2 },
        { size: 3, fileId: null },
    ])

    const output2 = moveFile(output, 1, 4);
    expect(output2).toEqual([
        { size: 1, fileId: 1 },
        { size: 3, fileId: null },
        { size: 1, fileId: null },
        { size: 2, fileId: 2 },
        { size: 3, fileId: 3 },
    ])
})

function part2(input: string): number {

    let disc = readData2(input);

    let lastFileId = disc.findLast(v => v.fileId != null)!.fileId!

    while (lastFileId >= 0) {
        const lastFileIndex = disc.findIndex(a => a.fileId === lastFileId);
        const lastFile = disc[lastFileIndex];

        if (!lastFile) {
            throw new Error(`Loast file ${lastFileId}!`)
        }

        const freeSpaceIndex = disc.findIndex(a => a.fileId === null && a.size >= lastFile.size);
        const freeSpace = disc[freeSpaceIndex];

        if (freeSpace && freeSpaceIndex < lastFileIndex) {
            disc = moveFile(disc, lastFileIndex, freeSpaceIndex)
        }
        lastFileId -= 1;
    }


    // expand filesystem
    const expandedData: string[] = [];


    disc.forEach(item => {
        for (let n = 0; n < Number(item.size); n++) {
            if (item.fileId !== null) {
                expandedData.push(`${item.fileId}`);
            } else {
                expandedData.push(".");
            }
        }
    })


    const ans = calcChecksum(expandedData);

    return ans;

}

Deno.test('part 2 example', () => {
    expect(part2(exampleData)).toBe(2858)
})

Deno.test('part 2 real', async () => {
    const text = await Deno.readTextFile("/Users/daniel/code/advent-of-code/2024/inputs/9.txt");

    const ans = part2(text)
    expect(ans).toBe(6427437134372)
})