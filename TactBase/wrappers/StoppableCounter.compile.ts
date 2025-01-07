import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/stoppable_counter.tact',
    options: {
        debug: true,
    },
};
