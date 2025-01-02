import { mnemonicToWalletKey } from "ton-crypto";
import { fromNano, internal, TonClient, WalletContractV4 } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import dotenv from 'dotenv';

dotenv.config();

const seedPhrase = process.env.SEED_PHRASE;

async function main() {
    const key = await mnemonicToWalletKey(seedPhrase.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0  });

    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    if(!await client.isContractDeployed(wallet.address)) {
        console.log("wallet is not deployed");
    }

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    console.log(JSON.stringify(walletContract, null, 2));

    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: [
           internal({
            to: "EQAQlYCcZn_9_dizmW7KGvAyVgK6hcG8QQxIz3QiMp5BSGSX",
            value: "0.05",
            body: ":)",
            bounce: false
           })
        ]
    });

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