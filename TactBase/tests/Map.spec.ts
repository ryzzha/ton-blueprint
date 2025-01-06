import { Blockchain, SandboxContract, Treasury, TreasuryContract } from '@ton/sandbox';
import { toNano, Dictionary, Address, fromNano } from '@ton/core';
import { Map } from '../wrappers/Map';
import '@ton/test-utils';
import { randomBytes } from 'crypto';

describe('Map', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let map: SandboxContract<Map>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const dict = Dictionary.empty(Dictionary.Keys.BigInt(32), Dictionary.Values.Bool());
        dict.set(1n, true)

        map = blockchain.openContract(await Map.fromInit(dict));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await map.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: map.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {});

    it('work with map', async () => {
        const gasUsedValues = []
        console.log("work with map WORK")
        await map.send(
            deployer.getSender(),
            {
                value: toNano("0.02")
            },
            "set keys"
        );

        const nullAddrs = await map.getOneItem(123n);
        console.log("nullAddrs: " + nullAddrs);

        const dict = Dictionary.empty(Dictionary.Keys.BigInt(32), Dictionary.Values.Address());
        const randomAddress1 = generateRandomTonAddress();
        const randomAddress2 = generateRandomTonAddress();
        const randomAddress3 = generateRandomTonAddress();
        dict.set(1n, randomAddress1);
        dict.set(2n, randomAddress2);
        dict.set(3n, randomAddress3);

        console.log("second random generated addrs: " + randomAddress2);

        await map.send(
            deployer.getSender(),
            {
                value: toNano("0.02")
            },
            {
                $$type: "Replace",
                items: dict 
            }
        );

        const secondAddrreceivedFromMap = await map.getOneItem(2n);

        console.log("second address received from Map: " + secondAddrreceivedFromMap);
    
        for(let i = 0n; i < 250; i++) {
            const gasUsed = await getGasUsed(deployer, async () => {
                await map.send(
                    deployer.getSender(),
                    {
                        value: toNano("0.05")
                    },
                    {
                        $$type: "Add",
                        key: i,
                        value: i
                    }
                )
            })
            gasUsedValues.push(gasUsed);
        }

        console.log("first gasUsedValue: " + fromNano(gasUsedValues[0]));
        console.log("last gasUsedValue: " + fromNano(gasUsedValues[gasUsedValues.length - 1]));
    
        console.log("GasUsedValues: ");
        console.log(gasUsedValues)
    });
});

function generateRandomTonAddress() {
    const workchain = 0; 
    const hashPart = randomBytes(32); 
    return new Address(workchain, hashPart);
}

async function getGasUsed(sender: SandboxContract<TreasuryContract>, messageCallback: any) {  
    const balance = await sender.getBalance();
    await messageCallback();
    return balance - await sender.getBalance();
}