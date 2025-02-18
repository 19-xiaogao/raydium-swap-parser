const { Connection, PublicKey } = require("@solana/web3.js");


function convertToDecimalAmount(rawAmount, decimals) {
  return rawAmount / Math.pow(10, decimals);
}


async function parseRaydiumSwapTransaction(txSignature) {
  const connection = new Connection(
    "RPC_URL",
  );

  try {
    const transaction = await connection.getTransaction(txSignature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction || !transaction.meta) {
      console.log("Transaction not found or invalid");
      return null;
    }

    const tokenTransfers = parseTokenTransfers(
      transaction.meta.preTokenBalances || [],
      transaction.meta.postTokenBalances || []
    );

    const innerInstructions = transaction.meta.innerInstructions;
    if (!innerInstructions || !innerInstructions.length) {
      console.log("No inner instructions found");
      return null;
    }

    const swapResults = [];

    innerInstructions.forEach((innerInstruction) => {
      if (!innerInstruction.instructions) return;

      innerInstruction.instructions.forEach((instruction) => {
        if (!instruction.data || !instruction.accounts) return;

        try {
          const data = Buffer.from(instruction.data, "base64");
          const swapData = parseSwapData(data, instruction.accounts);
          if (swapData) {
            swapResults.push({
              tokenTransfers: tokenTransfers,
            });
          }
        } catch (error) {
          console.log("Error parsing instruction:", error);
        }
      });
    });

    return {
      swapResults,
      tokenTransfers,
    };
  } catch (error) {
    console.error("Error parsing transaction:", error);
    throw error;
  }
}

function parseSwapData(data, accounts) {
  if (data.length < 24) return null;

  try {
    const discriminator = data.slice(0, 8);
    const amountIn = data.slice(8, 16).readBigUInt64LE(0);
    const minAmountOut = data.slice(16, 24).readBigUInt64LE(0);

    return {
      discriminator: discriminator.toString("hex"),
      amountIn: amountIn.toString(),
      minAmountOut: minAmountOut.toString(),
      accounts: accounts,
    };
  } catch (e) {
    console.error("Error parsing swap data:", e);
    return null;
  }
}

function parseTokenTransfers(preBalances, postBalances) {
  const transfers = [];

  const preBalanceMap = new Map(
    preBalances.map((balance) => [balance.accountIndex, balance])
  );

  postBalances.forEach((postBalance) => {
    const preBalance = preBalanceMap.get(postBalance.accountIndex);
    if (preBalance) {
      const uiTokenDelta =
        postBalance.uiTokenAmount.amount - preBalance.uiTokenAmount.amount;
      if (uiTokenDelta !== 0) {
        const decimals = postBalance.uiTokenAmount.decimals;
        const delta = convertToDecimalAmount(
          postBalance.uiTokenAmount.amount - preBalance.uiTokenAmount.amount,
          decimals
        );
        transfers.push({
          accountIndex: postBalance.accountIndex,
          mint: postBalance.mint,
          delta,
          decimals: postBalance.uiTokenAmount.decimals,
        });
      }
    }
  });

  return transfers;
}

function formatSwapMessage(tokenTransfers) {
  if (!tokenTransfers || tokenTransfers.length < 2) return null;
  const buyAndSell = tokenTransfers[0].delta > 0;
  return {
    type: buyAndSell ? "buy" : "sell",
    solToken: tokenTransfers[0].mint,
    token: tokenTransfers[1].mint,
    solAmount:   Math.abs(tokenTransfers[0].delta),
    amount: Math.abs(tokenTransfers[1].delta),
  };
}

async function example() {
  try {
    const txSignature =
      "8e2kfFnCmmoirpUiZpxsZHu5L7LLCMzRLZy9XAXL5tQo8DmqeHWqQRaMLUVtPPFzMdrpWDKHu1Mdu1QfY2U5uER";
    const result = await parseRaydiumSwapTransaction(txSignature);
    console.log(formatSwapMessage(result.tokenTransfers));
  } catch (error) {
    console.error("Error:", error);
  }
}

example();
