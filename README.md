# Solana Raydium Swap Transaction Parser

## 🚀 Project Overview

The Solana Raydium Swap Transaction Parser is a powerful JavaScript utility designed to decode and analyze token swap transactions on the Raydium Decentralized Exchange (DEX) within the Solana blockchain ecosystem.

## ✨ Features

- 🔍 Parse complex Raydium swap transaction signatures
- 📊 Extract detailed token transfer information
- 🔄 Identify transaction types (buy/sell)
- 💱 Calculate precise token swap amounts
- 🛡️ Robust error handling and transaction validation

## 📦 Prerequisites

- Node.js (v14+ recommended)
- `@solana/web3.js` library

## 🛠️ Installation

```bash
# Install dependencies
npm install @solana/web3.js

# Clone the repository
git clone https://github.com/19-xiaogao/raydium-swap-parser.git
cd raydium-swap-parser
```
## 💻 Usage Example

```js
async function main() {
  const txSignature = "YOUR_TRANSACTION_SIGNATURE";
  try {
    const result = await parseRaydiumSwapTransaction(txSignature);
    const swapDetails = formatSwapMessage(result.tokenTransfers);
    console.log(swapDetails);
  } catch (error) {
    console.error("Transaction parsing failed:", error);
  }
}

```
## 🔬 Core Functions

### parseRaydiumSwapTransaction(txSignature)

- Parses Solana transaction details
- Extracts token transfer information
- Supports confirmed transactions

### formatSwapMessage(tokenTransfers)

- Identifies transaction type (buy/sell)
- Calculates swap amounts
- Provides token mint addresses

## 🔧 Configuration
```js
// Configure Solana RPC endpoint
const connection = new Connection("YOUR_SOLANA_RPC_ENDPOINT", {
  commitment: "confirmed"
});
```
