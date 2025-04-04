import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Functions } from '../wrappers/Functions';
import '@ton/test-utils';

describe('Functions', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let functions: SandboxContract<Functions>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        functions = blockchain.openContract(await Functions.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await functions.send(
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
            to: functions.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and functions are ready to use
    });
});
