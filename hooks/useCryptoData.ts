"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// --- Types ---
export interface PricePoint {
  time: string
  price: number
  il: number
}

export interface Position {
  id: number
  pair: string
  value: string
  il: string
  ilPercent: string
  fees: string
  apr: string
  holdValue: string
  status: "active" | "hedged" | "unhedged" | "PROTECTED" | "UNPROTECTED"
}

export interface CryptoData {
  prices: {
    eth: number
    wbtc: number
    arb: number
  }
  changes24h: {
    eth: number
    wbtc: number
    arb: number
  }
  chartData: PricePoint[]
  positions: Position[]
  stats: {
    totalValue: string
    totalValueNum: number
    impermanentLoss: string
    impermanentLossNum: number
    feesEarned: string
    feesEarnedNum: number
    hodlValue: string
    hodlValueNum: number
    totalChange: string
    ilChange: string
    feesChange: string
  }
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

// --- Helpers ---
function formatUSD(n: number): string {
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  if (n < 0) return `-$${formatted}`
  if (n > 0) return `+$${formatted}`
  return `$${formatted}`
}

function formatUSD2(n: number): string {
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (n < 0) return `-$${formatted}`
  return `$${formatted}`
}

/**
 * Impermanent Loss formula:
 * IL = 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
 * where priceRatio = currentPrice / entryPrice
 */
function calculateIL(entryPrice: number, currentPrice: number): number {
  const ratio = currentPrice / entryPrice
  const il = 2 * Math.sqrt(ratio) / (1 + ratio) - 1
  return il // negative number representing % loss
}

// --- Entry prices (simulated "when the user entered the pool") ---
const ENTRY_PRICES = {
  eth: 2400,    // User entered ETH/USDC pool when ETH was $2400
  wbtc: 68000,  // User entered WBTC/ETH pool when WBTC was $68000
  arb: 1.10,    // User entered ARB/ETH pool when ARB was $1.10
}

// Simulated initial liquidity amounts in USD
const INITIAL_LIQUIDITY = {
  "ETH/USDC": 45000,
  "WBTC/ETH": 32000,
  "ARB/ETH": 12500,
}

// Simulated fee APR percentages (annual)
const FEE_APRS = {
  "ETH/USDC": 24.5,
  "WBTC/ETH": 18.2,
  "ARB/ETH": 32.1,
}

// Days in pool (simulated)
const DAYS_IN_POOL = 30

// --- CoinGecko API ---
const COINGECKO_BASE = "https://api.coingecko.com/api/v3"

async function fetchCurrentPrices(): Promise<{ eth: number; wbtc: number; arb: number; eth_24h: number; wbtc_24h: number; arb_24h: number }> {
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=ethereum,bitcoin,arbitrum&vs_currencies=usd&include_24hr_change=true`,
    { cache: "no-store" }
  )
  if (!res.ok) throw new Error(`CoinGecko price fetch failed: ${res.status}`)
  const data = await res.json()
  return {
    eth: data.ethereum?.usd ?? 0,
    wbtc: data.bitcoin?.usd ?? 0,
    arb: data.arbitrum?.usd ?? 0,
    eth_24h: data.ethereum?.usd_24h_change ?? 0,
    wbtc_24h: data.bitcoin?.usd_24h_change ?? 0,
    arb_24h: data.arbitrum?.usd_24h_change ?? 0,
  }
}

async function fetchEthChart24h(): Promise<PricePoint[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/ethereum/market_chart?vs_currency=usd&days=1`,
    { cache: "no-store" }
  )
  if (!res.ok) throw new Error(`CoinGecko chart fetch failed: ${res.status}`)
  const data = await res.json()

  const prices: [number, number][] = data.prices ?? []
  // Sample ~7-12 points from the full dataset for chart display
  const step = Math.max(1, Math.floor(prices.length / 12))
  const sampled = prices.filter((_, i) => i % step === 0 || i === prices.length - 1)

  return sampled.map(([timestamp, price]) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const il = calculateIL(ENTRY_PRICES.eth, price) * 100
    return {
      time: `${hours}:${minutes}`,
      price: Math.round(price * 100) / 100,
      il: Math.round(il * 100) / 100,
    }
  })
}

// --- Hook ---
export function useCryptoData(refreshIntervalMs: number = 60000): CryptoData {
  const [data, setData] = useState<CryptoData>({
    prices: { eth: 0, wbtc: 0, arb: 0 },
    changes24h: { eth: 0, wbtc: 0, arb: 0 },
    chartData: [],
    positions: [],
    stats: {
      totalValue: "$0",
      totalValueNum: 0,
      impermanentLoss: "$0",
      impermanentLossNum: 0,
      feesEarned: "$0",
      feesEarnedNum: 0,
      hodlValue: "$0",
      hodlValueNum: 0,
      totalChange: "0%",
      ilChange: "0%",
      feesChange: "0%",
    },
    loading: true,
    error: null,
    lastUpdated: null,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [priceResult, chartResult] = await Promise.all([
        fetchCurrentPrices(),
        fetchEthChart24h(),
      ])

      const { eth, wbtc, arb, eth_24h, wbtc_24h, arb_24h } = priceResult

      // Calculate IL for each position
      const ilEthUsdc = calculateIL(ENTRY_PRICES.eth, eth)
      const ilWbtcEth = calculateIL(ENTRY_PRICES.wbtc, wbtc)
      const ilArbEth = calculateIL(ENTRY_PRICES.arb, arb)

      // Calculate position values (initial + price appreciation of underlying)
      const ethPriceRatio = eth / ENTRY_PRICES.eth
      const wbtcPriceRatio = wbtc / ENTRY_PRICES.wbtc
      const arbPriceRatio = arb / ENTRY_PRICES.arb

      // LP value = initialLiquidity * (1 + IL) * sqrt(priceRatio) — simplified AMM model
      const ethLpValue = INITIAL_LIQUIDITY["ETH/USDC"] * (1 + ilEthUsdc) * (1 + (ethPriceRatio - 1) * 0.5)
      const wbtcLpValue = INITIAL_LIQUIDITY["WBTC/ETH"] * (1 + ilWbtcEth) * (1 + (wbtcPriceRatio - 1) * 0.5)
      const arbLpValue = INITIAL_LIQUIDITY["ARB/ETH"] * (1 + ilArbEth) * (1 + (arbPriceRatio - 1) * 0.5)

      // Fees earned (APR * days / 365 * initial liquidity)
      const feeEthUsdc = INITIAL_LIQUIDITY["ETH/USDC"] * (FEE_APRS["ETH/USDC"] / 100) * (DAYS_IN_POOL / 365)
      const feeWbtcEth = INITIAL_LIQUIDITY["WBTC/ETH"] * (FEE_APRS["WBTC/ETH"] / 100) * (DAYS_IN_POOL / 365)
      const feeArbEth = INITIAL_LIQUIDITY["ARB/ETH"] * (FEE_APRS["ARB/ETH"] / 100) * (DAYS_IN_POOL / 365)

      // HODL values (if just held the tokens)
      const holdEthUsdc = INITIAL_LIQUIDITY["ETH/USDC"] * (1 + (ethPriceRatio - 1) * 0.5)
      const holdWbtcEth = INITIAL_LIQUIDITY["WBTC/ETH"] * (1 + (wbtcPriceRatio - 1) * 0.5)
      const holdArbEth = INITIAL_LIQUIDITY["ARB/ETH"] * (1 + (arbPriceRatio - 1) * 0.5)

      // IL in dollar terms
      const ilDollarEth = ethLpValue - holdEthUsdc
      const ilDollarWbtc = wbtcLpValue - holdWbtcEth
      const ilDollarArb = arbLpValue - holdArbEth

      const totalLpValue = ethLpValue + wbtcLpValue + arbLpValue
      const totalIL = ilDollarEth + ilDollarWbtc + ilDollarArb
      const totalFees = feeEthUsdc + feeWbtcEth + feeArbEth
      const totalHodl = holdEthUsdc + holdWbtcEth + holdArbEth

      const positions: Position[] = [
        {
          id: 1,
          pair: "ETH/USDC",
          value: formatUSD2(ethLpValue),
          il: formatUSD(Math.round(ilDollarEth)),
          ilPercent: `${(ilEthUsdc * 100).toFixed(2)}%`,
          fees: formatUSD(Math.round(feeEthUsdc)),
          apr: `${FEE_APRS["ETH/USDC"]}%`,
          holdValue: formatUSD2(holdEthUsdc),
          status: "active",
        },
        {
          id: 2,
          pair: "WBTC/ETH",
          value: formatUSD2(wbtcLpValue),
          il: formatUSD(Math.round(ilDollarWbtc)),
          ilPercent: `${(ilWbtcEth * 100).toFixed(2)}%`,
          fees: formatUSD(Math.round(feeWbtcEth)),
          apr: `${FEE_APRS["WBTC/ETH"]}%`,
          holdValue: formatUSD2(holdWbtcEth),
          status: "hedged",
        },
        {
          id: 3,
          pair: "ARB/ETH",
          value: formatUSD2(arbLpValue),
          il: formatUSD(Math.round(ilDollarArb)),
          ilPercent: `${(ilArbEth * 100).toFixed(2)}%`,
          fees: formatUSD(Math.round(feeArbEth)),
          apr: `${FEE_APRS["ARB/ETH"]}%`,
          holdValue: formatUSD2(holdArbEth),
          status: "active",
        },
      ]

      // Compute total change percentages
      const totalInitial = INITIAL_LIQUIDITY["ETH/USDC"] + INITIAL_LIQUIDITY["WBTC/ETH"] + INITIAL_LIQUIDITY["ARB/ETH"]
      const totalChangePercent = ((totalLpValue - totalInitial) / totalInitial * 100)
      const ilChangePercent = (totalIL / totalInitial * 100)
      const feesChangePercent = (totalFees / totalInitial * 100)

      setData({
        prices: { eth, wbtc, arb },
        changes24h: { eth: eth_24h, wbtc: wbtc_24h, arb: arb_24h },
        chartData: chartResult,
        positions,
        stats: {
          totalValue: formatUSD2(totalLpValue),
          totalValueNum: totalLpValue,
          impermanentLoss: formatUSD(Math.round(totalIL)),
          impermanentLossNum: totalIL,
          feesEarned: formatUSD(Math.round(totalFees)),
          feesEarnedNum: totalFees,
          hodlValue: formatUSD2(totalHodl),
          hodlValueNum: totalHodl,
          totalChange: `${totalChangePercent >= 0 ? "+" : ""}${totalChangePercent.toFixed(1)}%`,
          ilChange: `${ilChangePercent.toFixed(1)}%`,
          feesChange: `+${feesChangePercent.toFixed(1)}%`,
        },
        loading: false,
        error: null,
        lastUpdated: new Date(),
      })
    } catch (err) {
      console.error("Error fetching crypto data:", err)
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()

    intervalRef.current = setInterval(fetchData, refreshIntervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData, refreshIntervalMs])

  return data
}
