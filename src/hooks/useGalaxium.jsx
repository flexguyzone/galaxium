import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { OWNER_WALLET, PREMINE, RARE_ASSETS, REWARD_PER_BLOCK, GENESIS_TS } from '@/lib/galaxium';

const GalaxiumContext = createContext(null);

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const seedBlocks = () => {
  const blocks = [];
  for (let i = 0; i < 14; i++) {
    const parents = i === 0 ? [] : [blocks[i - 1].id, ...(i > 2 && Math.random() < 0.6 ? [blocks[i - 2].id] : [])];
    blocks.push({ id: i, lane: Math.floor(Math.random() * 3), parents, private: Math.random() < 0.25 });
  }
  return blocks;
};

export function GalaxiumProvider({ children }) {
  const [isMining, setIsMining] = useState(false);
  const [hashrate, setHashrate] = useState(0);
  const [hashHistory, setHashHistory] = useState(() => Array(40).fill(0));
  const [blocks, setBlocks] = useState(seedBlocks);
  const [blockCount, setBlockCount] = useState(0);
  const [lastTickBlocks, setLastTickBlocks] = useState(0);
  const [minedGXM, setMinedGXM] = useState(0);
  const [drops, setDrops] = useState({ goldium: 0, palaxium: 0, tortatium: 0 });
  const [lastDrop, setLastDrop] = useState(null);
  const [balance, setBalance] = useState({ transparent: PREMINE.transparent, private: PREMINE.shielded });
  const [txs, setTxs] = useState([
    {
      id: 'genesis-premine',
      type: 'premine',
      to: OWNER_WALLET.address,
      amount: PREMINE.amount,
      ts: GENESIS_TS,
      status: 'confirmed',
      note: 'Genesis pre-mine — 1.00% of max supply to owner wallet',
    },
  ]);
  const [miningSince, setMiningSince] = useState(null);
  const nextIdRef = useRef(14);

  const start = useCallback(() => {
    setIsMining(true);
    setMiningSince(Date.now());
  }, []);

  const stop = useCallback(() => {
    setIsMining(false);
    setHashrate(0);
    setHashHistory((h) => [...h.slice(1), 0]);
  }, []);

  const toggleMining = useCallback(() => (isMining ? stop() : start()), [isMining, start, stop]);

  useEffect(() => {
    if (!isMining) return;
    const iv = setInterval(() => {
      // hashrate: ramp toward ~480 MH/s with jitter
      setHashrate((h) => clamp(h + (480 - h) * 0.25 + (Math.random() * 44 - 22), 0, 540));
      setHashHistory((hist) => [...hist.slice(1), clamp(hist[hist.length - 1] + (480 - hist[hist.length - 1]) * 0.25 + (Math.random() * 44 - 22), 0, 540)]);

      // Kaspa-style parallel block production: 1–3 blocks per tick
      const produced = 1 + Math.floor(Math.random() * 3);
      setLastTickBlocks(produced);
      setBlocks((prev) => {
        const next = [...prev];
        let id = nextIdRef.current;
        for (let i = 0; i < produced; i++) {
          const parents = [prev[prev.length - 1]?.id, prev[prev.length - 2]?.id].filter((p) => p !== undefined);
          next.push({ id: id++, lane: Math.floor(Math.random() * 3), parents, private: Math.random() < 0.25 });
        }
        nextIdRef.current = id;
        return next.slice(-24);
      });
      setBlockCount((c) => c + produced);
      setMinedGXM((m) => m + produced * REWARD_PER_BLOCK);
      setBalance((b) => ({ ...b, transparent: b.transparent + produced * REWARD_PER_BLOCK }));

      // Rare asset drop roll — one roll per produced block
      let rolled = null;
      for (let i = 0; i < produced; i++) {
        const r = Math.random();
        if (r < 0.0001) rolled = 'tortatium';
        else if (r < 0.0011) rolled = 'palaxium';
        else if (r < 0.011) rolled = 'goldium';
        if (rolled) break;
      }
      if (rolled) {
        setDrops((d) => ({ ...d, [rolled]: d[rolled] + 1 }));
        setLastDrop({ asset: rolled, ts: Date.now() });
      }
    }, 900);
    return () => clearInterval(iv);
  }, [isMining]);

  const sendTx = useCallback((to, amount, isPrivate) => {
    const amt = Number(amount);
    if (!to || !(amt > 0)) return { ok: false, error: 'Enter a valid recipient address and amount.' };
    let insufficient = false;
    setBalance((b) => {
      if (isPrivate && amt > b.private) { insufficient = true; return b; }
      if (!isPrivate && amt > b.transparent) { insufficient = true; return b; }
      return isPrivate ? { ...b, private: b.private - amt } : { ...b, transparent: b.transparent - amt };
    });
    if (insufficient) return { ok: false, error: 'Insufficient balance for this transaction.' };
    setTxs((t) => [
      {
        id: `tx-${Date.now()}`,
        type: 'send',
        to,
        amount: amt,
        private: isPrivate,
        ts: Date.now(),
        status: 'confirmed',
        note: isPrivate ? 'zk-shielded transfer — recipient & amount hidden' : 'Transparent transfer',
      },
      ...t,
    ]);
    return { ok: true };
  }, []);

  return (
    <GalaxiumContext.Provider
      value={{
        isMining, start, stop, toggleMining,
        hashrate, hashHistory,
        blocks, blockCount, lastTickBlocks,
        minedGXM, drops, lastDrop,
        miningSince,
        gpuThreads: 8, cpuThreads: 16,
        balance, txs, sendTx,
      }}
    >
      {children}
    </GalaxiumContext.Provider>
  );
}

export const useGalaxium = () => {
  const ctx = useContext(GalaxiumContext);
  if (!ctx) throw new Error('useGalaxium must be used within GalaxiumProvider');
  return ctx;
};