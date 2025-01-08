import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TrackableCounter } from '../wrappers/TrackableCounter';
import '@ton/test-utils';

describe('TrackableCounter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let trackableCounter: SandboxContract<TrackableCounter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        trackableCounter = blockchain.openContract(await TrackableCounter.fromInit(5n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await trackableCounter.send(
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
            to: trackableCounter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and trackableCounter are ready to use
    });
});
