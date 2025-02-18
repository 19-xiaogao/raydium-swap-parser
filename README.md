Solana Raydium Swap Transaction Parser

Overview

A comprehensive JavaScript utility for parsing and analyzing Raydium Decentralized Exchange (DEX) transactions on the Solana blockchain. This tool provides deep insights into token swap transactions, extracting detailed transaction information.


Key Features

Parse Raydium transaction signatures
Extract token transfer details
Identify buy/sell transaction types
Calculate token swap amounts
Support analysis for major token pairs

Technical Capabilities

Decode complex Solana transaction structures
Retrieve precise token exchange details
Analyze liquidity pool changes
Provide comprehensive transaction metadata

Dependencies

@solana/web3.js

Installation

```
npm install @solana/web3.js
```

Quick Start

```
// Basic usage example
const txSignature = "YOUR_TRANSACTION_SIGNATURE";
const result = await parseRaydiumSwapTransaction(txSignature);
console.log(formatSwapMessage(result.tokenTransfers));

```
