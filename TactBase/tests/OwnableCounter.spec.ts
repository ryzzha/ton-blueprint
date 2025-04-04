import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { OwnableCounter } from '../wrappers/OwnableCounter';
import '@ton/test-utils';

describe('OwnableCounter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let ownableCounter: SandboxContract<OwnableCounter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        ownableCounter = blockchain.openContract(await OwnableCounter.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await ownableCounter.send(
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
            to: ownableCounter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and ownableCounter are ready to use
    });
});
