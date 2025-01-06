import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/time_and_random.tact',
    options: {
        debug: true,
    },
};
