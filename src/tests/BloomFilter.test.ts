import { BloomFilter } from '../models/BloomFilter';

describe('BloomFilter', () => {
    it("should create a bloom filter with correct parameters", () => {
        bloomFilter = new BloomFilter(1000, 0.1);

        expect(bloomFilter.size).toBe(1000);
        expect(bloomFilter.errorRate).toBe(0.1);

        expect(bloomFilter.bitArray.length).toBe(1000);
        expect(bloomFilter.bitArray.every(bit => bit === 0)).toBe(true);
    });

    it("should contain the initially added words", () => {
        bloomFilter = new BloomFilter(1000, 0.1);

        expect(bloomFilter.contains("hello")).toBe(false);
        expect(bloomFilter.contains("world")).toBe(false);
        expect(bloomFilter.contains("testing")).toBe(false);
    });

    it("should NOT contain words that were not added", () => {
        bloomFilter = new BloomFilter(1000, 0.1);

        expect(bloomFilter.contains("testingbf")).toBe(false);
    });

    it("should contain words that were added", () => {
        bloomFilter = new BloomFilter(1000, 0.1);

        bloomFilter.insert("testingbf");
        expect(bloomFilter.contains("testingbf")).toBe(true);
    });
});
