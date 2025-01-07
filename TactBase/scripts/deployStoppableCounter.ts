import { toNano } from '@ton/core';
import { StoppableCounter } from '../wrappers/StoppableCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const stoppableCounter = provider.open(await StoppableCounter.fromInit());

    await stoppableCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(stoppableCounter.address);

    // run methods on `stoppableCounter`
}
