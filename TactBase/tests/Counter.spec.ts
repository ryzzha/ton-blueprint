import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';

describe('Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(await Counter.fromInit(258n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.send(
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
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counter are ready to use
    });

    it('should increase counter', async () => {
        const counterBefore = await counter.getCounter();

        console.log("counter before - " + counterBefore);

        await counter.send(
            deployer.getSender(),
            {
                value: toNano("5")
            },
            "increment"
        );

        const counterAfter = await counter.getCounter();

        console.log("counter after - " + counterAfter);

        expect(counterBefore).toBeLessThan(counterAfter);
    });

    it('should increase counter with amount', async () => {
        const counterBefore = await counter.getCounter();

        const amount = 25n;

        console.log("counter before - " + counterBefore);

        await counter.send(
            deployer.getSender(),
            {
                value: toNano("5")
            },
            {
                $$type: "Add",
                amount: amount
            }
        );

        const counterAfter = await counter.getCounter();

        console.log("counter after - " + counterAfter);

        expect(counterBefore).toBeLessThan(counterAfter);
    });
});
