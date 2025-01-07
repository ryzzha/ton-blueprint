import { toNano } from '@ton/core';
import { TrackableCounter } from '../wrappers/TrackableCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const trackableCounter = provider.open(await TrackableCounter.fromInit());

    await trackableCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(trackableCounter.address);

    // run methods on `trackableCounter`
}
