import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TimeAndRandom } from '../wrappers/TimeAndRandom';
import '@ton/test-utils';

describe('TimeAndRandom', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let timeAndRandom: SandboxContract<TimeAndRandom>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        timeAndRandom = blockchain.openContract(await TimeAndRandom.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await timeAndRandom.send(
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
            to: timeAndRandom.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {});

    it.skip('try time', async () => {
        const currentUnixTime = await timeAndRandom.getUnixTime();

        console.log(currentUnixTime);

        await timeAndRandom.send(
            deployer.getSender(),
            {
                value: toNano("0.02")
            },
            "wait 12s"
        );

        await sleep(15000);

        await timeAndRandom.send(
            deployer.getSender(),
            {
                value: toNano("0.02")
            },
            "wait 12s"
        );

    }, 21000);

    it('try random', async () => {});
});

async function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds));
}