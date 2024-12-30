export class BloomFilter {
    private readonly m: number;
    private readonly k: number;
    private readonly bitArray: Uint8Array;
    private readonly seeds: number[];
  
    constructor(n: number, p: number, seedBase?: number) {
        if (n <= 0) {
            throw new Error("n must be > 0");
        }

        if (p <= 0 || p >= 1) {
            throw new Error("p must be between 0 and 1 (exclusive)");
        }
    
        // 1. calculate m using the standard formula (rounded up)
        // m = - (n * ln(p)) / (ln(2)^2)
        this.m = Math.ceil(-n * Math.log(p) / (Math.log(2) ** 2));
    
        // 2. calculate k (rounded)
        // k = (m / n) * ln(2)
        const floatK = (this.m / n) * Math.log(2);
        this.k = Math.max(1, Math.round(floatK));
    
        // 3. create a bit array of length m
        this.bitArray = new Uint8Array(this.m);
    
        // 4. generate k random seeds
        this.seeds = Array.from({ length: this.k }, (_, i) => {
            if (typeof seedBase !== "undefined") {
                // a simple formula
                return (seedBase + i * 13_777) % this.m;
            }
            
            return Math.floor(Math.random() * this.m);
        });
    }
  
    private hashFnv1a(value: string, seed: number): number {
        // FNV offset basis
        let hash = seed ^ 2166136261;
        for (let i = 0; i < value.length; i++) {
            hash ^= value.charCodeAt(i);
            // multiply by FNV prime => 16777619
            // ensure 32-bit
            hash = (hash * 16777619) >>> 0;
        }

        // then mod by m to fit in bit array range
        return hash % this.m;
    }
  
    public insert(value: string): void {
      for (const seed of this.seeds) {
        const index = this.hashFnv1a(value, seed);
        this.bitArray[index] = 1;
      }
    }
  
    public contains(value: string): boolean {
      return this.seeds.every(seed => {
        const index = this.hashFnv1a(value, seed);
        return this.bitArray[index] === 1;
      });
    }
  
    public getM(): number {
      return this.m;
    }
  
    public getK(): number {
      return this.k;
    }
  
    public getBitArray(): Uint8Array {
      return this.bitArray;
    }
  
    public getSeeds(): number[] {
      return this.seeds;
    }
  }
  