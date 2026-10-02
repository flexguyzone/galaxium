// Galaxium chain configuration — genesis parameters

export const COIN = {
  name: 'Galaxium',
  ticker: 'GXM',
  maxSupply: 1_000_000_000, // 1 billion GXM
  consensus: 'PoW BlockDAG (Kaspa-style GHOSTDAG)',
  signatures: 'ML-DSA + SLH-DSA (post-quantum, cryptographically agile)',
  vm: 'GVM — native protocol-integrated smart contract VM',
  privacy: 'ZK proofs — transparent by default, private on demand',
  upgradeMechanism: 'On-chain QIPs + versioned consensus modules (no hard forks)',
};

// 1% pre-mine of max supply, allocated to the genesis owner wallet
export const PREMINE = {
  pct: 0.01,
  amount: 10_000_000, // 1% of 1,000,000,000 GXM
  transparent: 9_500_000,
  shielded: 500_000,
};

// Fixed annual emission — no halvings — spread across 100,000 years
// (990,000,000 remaining after pre-mine ÷ 100,000 years = 9,900 GXM/year)
export const EMISSION = {
  annualGXM: 9_900,
  years: 100_000,
  genesisYear: 2026,
  mechanism: 'Fixed Annual Emission — no halvings',
};

// Genesis owner wallet (simulated keys for this chain — keep the private key secret)
export const OWNER_WALLET = {
  label: 'Genesis Owner Wallet',
  address: 'gxm1qk4w7v2x9d3f8h6j0c5b1n8m4s7t2y9e6r3u5a0p',
  privateKey: '8f4a1c9e2b7d6f0e3a5c8b1d4f7e0a2c9b6d3f8e1a4c7b0d2e5f8a1c4b7d0e3f',
};

// Proof-of-Work Rare Asset Mining — bonus coins mineable alongside GXM blocks
export const RARE_ASSETS = [
  { id: 'goldium', name: 'Goldium', ticker: 'GLD', tier: 'Rare', odds: 0.01, oddsText: '1 : 100', color: '#FFD700' },
  { id: 'palaxium', name: 'Palaxium', ticker: 'PLX', tier: 'Ultra Rare', odds: 0.001, oddsText: '1 : 1,000', color: '#7B2CBF' },
  { id: 'tortatium', name: 'Tortatium', ticker: 'TRT', tier: 'Mythic', odds: 0.0001, oddsText: '1 : 10,000', color: '#00F0FF' },
];

export const GENESIS_TS = Date.UTC(2026, 0, 1);
export const REWARD_PER_BLOCK = 0.05; // GXM per DAG block

export const fmt = (n, d = 0) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const shortAddr = (a) => (a ? `${a.slice(0, 12)}…${a.slice(-6)}` : '');