# Build Your Own Spell Checker Using a Bloom Filter

This repository contains a Node.js (TypeScript) implementation of a spell checker using a **Bloom filter**, a probabilistic data structure optimized for efficient membership queries. The solution adheres to the requirements of the challenge to build a space-efficient spell checker without storing the entire dictionary in memory.

## About

The implementation:
- Creates a **Bloom filter** to store words from a dictionary.
- Provides a command-line interface (CLI) for:
  - **Building** the Bloom filter from a dictionary file.
  - **Saving** and **loading** the Bloom filter in a binary format.
  - **Querying** if words are likely spelled correctly.
- Ensures efficient memory usage while allowing for acceptable false positives.

## Use Cases
- Quick membership checks for large datasets (e.g., spell checkers, password validation, etc.).
- Demonstrates practical applications of Bloom filters in real-world scenarios.

---

This project serves as a practical example of how to implement and apply a Bloom filter for spell-checking tasks, showcasing its efficiency and versatility in scenarios where storage space and performance are critical.

---

Feel free to explore, modify, and extend the implementation for your needs!
