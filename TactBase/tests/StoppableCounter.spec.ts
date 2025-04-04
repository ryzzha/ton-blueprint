import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { StoppableCounter } from '../wrappers/StoppableCounter';
import '@ton/test-utils';

describe('StoppableCounter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let stoppableCounter: SandboxContract<StoppableCounter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        stoppableCounter = blockchain.openContract(await StoppableCounter.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await stoppableCounter.send(
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
            to: stoppableCounter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and stoppableCounter are ready to use
    });
});
