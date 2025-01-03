import { toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = await Counter.fromInit(152738n);
    const openedCounter = provider.open(counter);

    await openedCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            amount: 10n,
        }
    );

    // run methods on `firstContract`
}