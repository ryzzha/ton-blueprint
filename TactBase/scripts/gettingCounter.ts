import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = await Counter.fromInit(152738n);

    const openedCounter = provider.open(counter);

    const counterValue = await openedCounter.getCounter()
    const id = await openedCounter.getId()

    console.log(`Counter - ${counterValue}; Id - ${id}`)
}