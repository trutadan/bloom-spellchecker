import * as fs from 'fs';
import { BloomFilter } from './models/BloomFilter';
import {
    readDictionaryFromFile,
    saveBloomFilter,
    loadBloomFilter,
} from './utils';

function showHelp() {
    console.log(`
  Usage:
    ccspellcheck build <dictionary-file> [--output <bloom-filter-file>] [--count <n>] [--prob <p>]
        Builds a Bloom Filter from the specified dictionary file.
  
    ccspellcheck check <bloom-filter-file> <word1> <word2> <word3> ...
        Checks whether the given words are probably in the dictionary (Bloom Filter) or definitely not.
  
  Options for "build":
    --output <bloom-filter-file>  Defaults to "words.bf"
    --count  <n>                  Estimated number of words in the dictionary (defaults to 100_000)
    --prob   <p>                  Desired false-positive probability (defaults to 0.01)
  
  Examples:
    ccspellcheck build dict.txt
    ccspellcheck build dict.txt --output mydict.bf --count 200000 --prob 0.001
    ccspellcheck check mydict.bf concurrency coding challenges
  `);
}

async function handleBuildCommand(args: string[]) {
  let dictionaryFile: string | undefined;
  let outputFile = 'words.bf';
  let estimatedCount = 100_000;
  let falsePositiveProb = 0.01;

  // arg parsing
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!dictionaryFile && !arg.startsWith('--')) {
      // the first arg that isn't --something we consider the dictionary file
      dictionaryFile = arg;
    } else if (arg === '--output') {
      outputFile = args[i + 1];
      i++;
    } else if (arg === '--count') {
      estimatedCount = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--prob') {
      falsePositiveProb = parseFloat(args[i + 1]);
      i++;
    }
  }

  if (!dictionaryFile) {
    console.error('Error: no dictionary file specified.');
    showHelp();
    process.exit(1);
  }

  if (!fs.existsSync(dictionaryFile)) {
    console.error(`Error: dictionary file "${dictionaryFile}" not found.`);
    process.exit(1);
  }

  // 1. create the Bloom Filter
  const bloomFilter = new BloomFilter(estimatedCount, falsePositiveProb);

  // 2. insert words from the dictionary file
  console.log(`Reading words from "${dictionaryFile}"...`);
  readDictionaryFromFile(bloomFilter, dictionaryFile);

  // 3. save bloom filter to disk
  console.log(`Saving Bloom Filter to "${outputFile}"...`);
  saveBloomFilter(bloomFilter, outputFile);

  console.log('Build complete!');
}

async function handleCheckCommand(args: string[]) {
  if (args.length < 2) {
    console.error(`
      For the "check" command, you must provide at least:
        1) The Bloom Filter file path
        2) One or more words to check
    `);
    process.exit(1);
  }

  // the first argument is the .bf file
  const bfFilePath = args[0];
  if (!fs.existsSync(bfFilePath)) {
    console.error(`Error: Bloom filter file "${bfFilePath}" not found.`);
    process.exit(1);
  }

  // the rest of the arguments are the words to check
  const wordsToCheck = args.slice(1);

  // 1. load the Bloom filter
  console.log(`Loading Bloom Filter from "${bfFilePath}"...`);
  const bloomFilter = loadBloomFilter(bfFilePath);

  // 2. check each word
  const definitelyMissing: string[] = [];
  for (const w of wordsToCheck) {
    if (!bloomFilter.contains(w)) {
      definitelyMissing.push(w);
    }
  }

  // 3. print results
  if (definitelyMissing.length > 0) {
    console.log(`\nThese words are definitely NOT in the dictionary:`);
    definitelyMissing.forEach(word => console.log(`  - ${word}`));
  } else {
    console.log('\nAll given words are probably in the dictionary!');
  }
}

async function main() {
    // skip the first three arguments: [0] is npx, [1] is the ts-node, [2] is the script name
    const args = process.argv.slice(2);
  
    if (args.length < 1) {
      showHelp();
      process.exit(1);
    }
  
    const command = args[0];
    switch (command) {
      case 'build':
        await handleBuildCommand(args.slice(1));
        break;
  
      case 'check':
        await handleCheckCommand(args.slice(1));
        break;
  
      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
