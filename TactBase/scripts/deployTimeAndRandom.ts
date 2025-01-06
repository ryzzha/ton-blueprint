import { toNano } from '@ton/core';
import { TimeAndRandom } from '../wrappers/TimeAndRandom';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const timeAndRandom = provider.open(await TimeAndRandom.fromInit());

    await timeAndRandom.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(timeAndRandom.address);

    // run methods on `timeAndRandom`
}
