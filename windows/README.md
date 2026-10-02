# Galaxium Windows Apps

- `wallet/` → builds **Galaxium-Wallet-Setup.exe** (opens the Galaxium Wallet)
- `miner/` → builds **Galaxium-Miner-Setup.exe** (opens the Galaxium Mining dashboard)

## Build on a Windows PC (requires Node.js 20+)

```
cd windows/wallet
npm install
npm run dist
```

```
cd windows/miner
npm install
npm run dist
```

Each installer appears in that folder's `dist/` directory.