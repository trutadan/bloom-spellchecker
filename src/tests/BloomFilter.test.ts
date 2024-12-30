import { BloomFilter } from '../models/BloomFilter';

describe('BloomFilter', () => {
    it("should create a bloom filter with correct parameters", () => {
        const bloomFilter = new BloomFilter(100000, 0.1);

        expect(bloomFilter.getK()).toBe(3);
        expect(bloomFilter.getSeeds().length).toBe(3);

        expect(bloomFilter.getM()).toBe(479253);
        expect(bloomFilter.getBitArray().length).toBe(479253);
    });

    it("should contain the initially added words", () => {
        const bloomFilter = new BloomFilter(100000, 0.1);

        expect(bloomFilter.contains("hello")).toBe(false);
        expect(bloomFilter.contains("world")).toBe(false);
        expect(bloomFilter.contains("testing")).toBe(false);
    });

    it("should NOT contain words that were not added", () => {
        const bloomFilter = new BloomFilter(100000, 0.1);

        expect(bloomFilter.contains("testingbf")).toBe(false);
    });

    it("should contain words that were added", () => {
        const bloomFilter = new BloomFilter(100000, 0.1);

        bloomFilter.insert("testingbf");
        expect(bloomFilter.contains("testingbf")).toBe(true);
    });
});
