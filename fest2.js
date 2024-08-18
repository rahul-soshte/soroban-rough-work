function computeInstructionFee(instructions) {
    const FEE_RATE = 6250;
    const DIVISOR = 10000;
    const instructionsNum = Number(instructions);
    const fee = (instructionsNum * FEE_RATE) / DIVISOR;
    return Math.ceil(fee);
}

function computeReadEntriesFee(numberOfReadsandWriteEntries) {
    const FEE_RATE = 6250;
    const numberOfReadsandWriteEntriesNum = Number(numberOfReadsandWriteEntries);
    const fee = (numberOfReadsandWriteEntriesNum * FEE_RATE);
    return fee;
}

function computeWriteEntriesFee(numberOfWriteEntries) {
    const FEE_RATE = 10000;
    const numberOfWriteEntriesNum = Number(numberOfWriteEntries);
    const fee = numberOfWriteEntriesNum * FEE_RATE;
    return fee;
}

// console.log(computeReadEntriesFee(5)); // Output: 31250 
// console.log(computeWriteEntriesFee(5)); // Output: 50000


function computeReadBytesFee(bytesRead) {
    const FEE_RATE = 1786;
    const DIVISOR = 1024;
    const bytesReadNum = Number(bytesRead);
    const fee = (bytesReadNum * FEE_RATE) / DIVISOR;
    return Math.ceil(fee);
}

function computeWriteBytesFee(instructions) {
    const FEE_RATE = 11800;
    const DIVISOR = 1024;
    const instructionsNum = Number(instructions);
    const fee = (instructionsNum * FEE_RATE) / DIVISOR;
    return Math.ceil(fee);
}

console.log(computeReadBytesFee(51200));  // Output: 8721
console.log(computeWriteBytesFee(10240));  // Output: 57618