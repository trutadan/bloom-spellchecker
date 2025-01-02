import { BloomFilter } from './models/BloomFilter';
import {
    readDictionaryFromFile,
    saveBloomFilter,
    loadBloomFilter,
} from './utils';

async function main() {
    const bloomFilter = new BloomFilter(100000, 0.1);
    readDictionaryFromFile(bloomFilter, 'words');
    
    console.log(bloomFilter.contains("hello"));
    console.log(bloomFilter.contains("world"));

    console.log(bloomFilter.contains("testingg"));

    bloomFilter.insert("testingg");
    console.log(bloomFilter.contains("testingg"));

    saveBloomFilter(bloomFilter, 'words.bf', 1);

    const bf = loadBloomFilter('words.bf');

    console.log(bf.contains("hello"));
    console.log(bf.contains("world"));

    console.log(bf.contains("testingg"));
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
