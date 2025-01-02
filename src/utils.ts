import { BloomFilter } from "./models/BloomFilter";
import * as fs from 'fs';

export function readDictionaryFromFile(
    bloomFilter: BloomFilter, 
    fileName: string
): void {
    const words = fs.readFileSync(fileName, 'utf-8').split('\n');
    for (const word of words) {
        const trimmed = word.trim();
        // only insert non-empty lines
        if (trimmed) {
            bloomFilter.insert(trimmed);
        }
    }
}

export function saveBloomFilter(bloomFilter: BloomFilter, filePath: string, version: number = 1): void {
    // 1. create a buffer for the header 
    // 4 + 2 + 2 + 4 = 12 bytes
    const headerBuffer = Buffer.alloc(12);

    // first 4 bytes: "CCBF" string in ASCII
    headerBuffer.write('CCBF', 0, 4, 'ascii');

    // next 2 bytes: version number in big-endian
    headerBuffer.writeUInt16BE(version, 4);

    // next 2 bytes: number of hash functions (k) in big-endian
    headerBuffer.writeUInt16BE(bloomFilter.getK(), 6);

    // next 4 bytes: number of bits (m) in big-endian
    headerBuffer.writeUInt32BE(bloomFilter.getM(), 8);

    // 2. write seeds (k seeds, each 4 bytes)
    const seedBuffer = Buffer.alloc(bloomFilter.getK() * 4);
    bloomFilter.getSeeds().forEach((seed, i) => {
        seedBuffer.writeUInt32BE(seed, i * 4);
    });

    // 3. write bit array
    const bitArrayBuffer = Buffer.from(bloomFilter.getBitArray());

    // 4. concat all
    const output = Buffer.concat([headerBuffer, seedBuffer, bitArrayBuffer]);

    fs.writeFileSync(filePath, output);
    console.log(`BloomFilter saved to ${filePath} successfully!`);
}

export function loadBloomFilter(filePath: string): BloomFilter {
    const data = fs.readFileSync(filePath);
  
    // 1. check the magic bytes "CCBF"
    const magic = data.toString('ascii', 0, 4);
    if (magic !== 'CCBF') {
        throw new Error('Not a valid bloom filter file (missing CCBF header).');
    }
  
    // 2. version (big-endian)
    data.readUInt16BE(4);
  
    // 3. read k
    const k = data.readUInt16BE(6);
  
    // 4. read m
    const m = data.readUInt32BE(8);
  
    // 5. read seeds (k of them, each 4 bytes)
    const seeds: number[] = [];
    let offset = 12;
    for (let i = 0; i < k; i++) {
        const seed = data.readUInt32BE(offset);
        seeds.push(seed);
        offset += 4;
    }
  
    // 6. the rest is the bit array, length = m bytes
    const bitArrayBuffer = data.subarray(offset, offset + m);
    if (bitArrayBuffer.length !== m) {
        throw new Error(`File does not contain expected bit array of length ${m} bytes.`);
    }
  
    // 7. construct BloomFilter from stored data
    return BloomFilter.fromStorage(
        m,
        k,
        seeds,
        new Uint8Array(bitArrayBuffer)
    );
}