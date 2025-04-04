import { toNano } from '@ton/core';
import { OwnableCounter } from '../wrappers/OwnableCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ownableCounter = provider.open(await OwnableCounter.fromInit());

    await ownableCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(ownableCounter.address);

    // run methods on `ownableCounter`
}
