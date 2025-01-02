import { mnemonicToWalletKey } from "ton-crypto";
import { fromNano, internal, TonClient, WalletContractV4 } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import dotenv from 'dotenv';

dotenv.config();

const seedPhrase = process.env.SEED_PHRASE;
console.log('seedPhrase:', seedPhrase);

async function main() {
    const mnemonic = seedPhrase;
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0  });

    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    if(!await client.isContractDeployed(wallet.address)) {
        console.log("wallet is not deployed");
    }

    console.log("wallet exist address: " + wallet.address);
    console.log("wallet balance: " + fromNano(await client.getBalance(wallet.address)));

    // EQAJu_Cc2RKOoRaRTFOat8XIMJ8OFpTEkY2SunELLP5V4PWF  EQA4u5b8h39SxZpbAO8I7lDfEwVKqb7mtZPRqqKqFeumrkh3

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: [
           internal({
            to: "EQAQlYCcZn_9_dizmW7KGvAyVgK6hcG8QQxIz3QiMp5BSGSX",
            value: "0.05",
            body: "hello",
            bounce: false
           })
        ]
    });

    console.log("wallet seqno: " + seqno);

    let currentSeqno = seqno;
    while(currentSeqno == seqno) {
        console.log("transaction waiting to confirm...");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed");
}

main();

async function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds));
}