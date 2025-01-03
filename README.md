# bloom-spellchecker
Bloom Filter–based spell checker in TypeScript.

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
