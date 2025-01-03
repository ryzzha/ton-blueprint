import { Address, toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';
import 'dotenv/config';

export async function run(provider: NetworkProvider) {
    const counterContract = await Counter.fromInit(18723654n);

    const counter = provider.open(counterContract);

    await counter.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    console.log('Deployment transaction sent, waiting for deploy...');
    await provider.waitForDeploy(counter.address);

    console.log('Contract successfully deployed.');
    console.log('Contract id: ' + await counter.getId());

    // run methods on `counter`
}
