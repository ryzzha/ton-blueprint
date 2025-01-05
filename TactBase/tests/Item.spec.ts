import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import '@ton/test-utils';
import { Item1 } from '../build/Item/tact_Item1';
import { Item2 } from '../build/Item/tact_Item2';
import { Item3 } from '../build/Item/tact_Item3';

describe('Item', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let item1: SandboxContract<Item1>;
    let item2: SandboxContract<Item2>;
    let item3: SandboxContract<Item3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        item1 = blockchain.openContract(await Item1.fromInit());
        item2 = blockchain.openContract(await Item2.fromInit());
        item3 = blockchain.openContract(await Item3.fromInit(21n));

        deployer = await blockchain.treasury('deployer');

        const deployResult1 = await item1.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployResult2 = await item2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployResult3 = await item3.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult1.transactions).toHaveTransaction({
            from: deployer.address,
            to: item1.address,
            deploy: true,
            success: true,
        });

        expect(deployResult2.transactions).toHaveTransaction({
            from: deployer.address,
            to: item2.address,
            deploy: true,
            success: true,
        });

        expect(deployResult3.transactions).toHaveTransaction({
            from: deployer.address,
            to: item3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {});

    it('should be equal addresses', async () => {
        const firstItemFromIt = await item1.getMyAddress();
        const secondItemFromIt = await item2.getMyAddress();

        const secondItemFromFirst = await item1.getOtherAddress();
        const firstItemFromSecond = await item2.getOtherAddress();

        // console.log("firstItemFromIt: " + firstItemFromIt);
        // console.log("firstItemFromSecond: " + firstItemFromSecond);

        // console.log("secondItemFromIt: " + secondItemFromIt);
        // console.log("secondItemFromFirst: " + secondItemFromFirst);

        expect(firstItemFromIt).toEqualAddress(firstItemFromSecond);
        expect(secondItemFromIt).toEqualAddress(secondItemFromFirst);
    });

    it('contract can deploy another contract', async () => {
        const item3Id = await item3.getId();
        const item3Address = await item3.getMyAddress();
        const item3CalcAddress = await item3.getOtherAddress(item3Id);

        // console.log("item3Address: " + item3Address);
        // console.log("item3CalcAddress: " + item3CalcAddress);

        await item3.send(
            deployer.getSender(),
            {
                value: toNano("0.05")
            },
            {
                $$type: "DeployContract",
                id: 5n
            }
        );

        const newContract = blockchain.openContract(await Item3.fromInit(5n));
        const newContractAddress = await newContract.getMyAddress();
        const equalAddress = await item3.getOtherAddress(5n);

        console.log("newContractAddress: " + newContractAddress);
        console.log("equalAddress: " + equalAddress);
    });
});
