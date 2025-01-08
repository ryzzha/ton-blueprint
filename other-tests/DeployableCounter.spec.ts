import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { DeployableCounter } from '../wrappers/DeployableCounter';
import '@ton/test-utils';

describe('DeployableCounter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let deployableCounter: SandboxContract<DeployableCounter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployableCounter = blockchain.openContract(await DeployableCounter.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await deployableCounter.send(
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
            to: deployableCounter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and deployableCounter are ready to use
    });
});
