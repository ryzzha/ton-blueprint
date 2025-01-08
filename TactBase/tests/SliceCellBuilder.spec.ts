import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address  } from '@ton/core';
import { SliceCellBuilder } from '../wrappers/SliceCellBuilder';
import '@ton/test-utils';

describe('SliceCellBuilder', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sliceCellBuilder: SandboxContract<SliceCellBuilder>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sliceCellBuilder = blockchain.openContract(await SliceCellBuilder.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sliceCellBuilder.send(
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
            to: sliceCellBuilder.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {});

    it('should can get data and change', async () => {
        console.log("SliceCellBuilder one of the tests work")

        const addressBefore = await sliceCellBuilder.getCoinAddress();
        const numberBefore = await sliceCellBuilder.getCoinNumber();

        console.log("addressBefore: " + addressBefore);
        console.log("numberBefore: " + numberBefore);

        await sliceCellBuilder.send(
            deployer.getSender(),
            {
                value: toNano("0.05")
            },
            {
                $$type: "ChangeAddressAndCoins",
                newAddress: Address.parse("0:4f9c1c3b8f5e4de46e90bdfb8727b25f472f204e5a66b8f420b8a2ec3bda000f"),
                newCoinsNumber: 500000n
            }
        )

        const addressAfter = await sliceCellBuilder.getCoinAddress();
        const numberAfter = await sliceCellBuilder.getCoinNumber();

        console.log("addressAfter: " + addressAfter);
        console.log("numberAfter: " + numberAfter);

        expect(addressBefore).not.toEqual(addressAfter);
        expect(numberBefore).not.toEqual(numberAfter);
    });
});
