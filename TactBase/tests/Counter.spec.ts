import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { BulkAdder } from '../wrappers/BulkAdder';
import '@ton/test-utils';

describe('Counter and BulkAdder', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;
    let bulkAdder: SandboxContract<BulkAdder>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(await Counter.fromInit(258n));
        bulkAdder = blockchain.openContract(await BulkAdder.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployCounterResult = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployBulkAdderResult = await bulkAdder.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployCounterResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });

        expect(deployBulkAdderResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: bulkAdder.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {});

    it('should increase counter', async () => {
        const counterBefore = await counter.getCounter();

        // console.log("counter before - " + counterBefore);

        await counter.send(
            deployer.getSender(),
            {
                value: toNano("5")
            },
            "increment"
        );

        const counterAfter = await counter.getCounter();

        // console.log("counter after - " + counterAfter);

        expect(counterBefore).toBeLessThan(counterAfter);
    });

    it('should increase to target througth proxy bulk', async () => {
        const counterBefore = await counter.getCounter();

        const target = 3n;

        // console.log("counter before - " + counterBefore);

        const res = await bulkAdder.send(
            deployer.getSender(),
            {
                value: toNano("0.1")
            },
            {
                $$type: "Reach",
                counter: counter.address,
                target
            }
        );

        // console.log(res);
        // console.log("events" + res.events.length);

        const counterAfter = await counter.getCounter();

        // console.log("counter after - " + counterAfter);

        expect(counterAfter).toEqual(target);
    });


});
