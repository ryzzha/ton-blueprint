import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { fromNano, toNano } from '@ton/core';
import { SendTon } from '../wrappers/SendTon';
import '@ton/test-utils';

describe('Send Ton', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let sendTon: SandboxContract<SendTon>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sendTon = blockchain.openContract(await SendTon.fromInit());

        deployer = await blockchain.treasury('deployer');
        user = await blockchain.treasury('user');

        const deploySendTonResult = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        await sendTon.send(
            user.getSender(),
            {
                value: toNano("11000")
            },
            null
        );

        expect(deploySendTonResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendTon.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {});

    it('should can deposit ton', async () => {
        const sendTonBalanceBefore = (await sendTon.getBalance());

        await sendTon.send(
            user.getSender(),
            {
                value: toNano("800")
            },
            null
        );

        const sendTonBalanceAfter = await sendTon.getBalance();

        expect(Number(sendTonBalanceBefore)).toBeLessThan(Number(sendTonBalanceAfter));
    });

    it('should can only contract owner to withdraw all', async () => {
        const sendTonBalanceBefore = await sendTon.getBalance();

        const res = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano("0.05")
            },
            "withdraw all"
        );

        const sendTonBalanceAfter = await sendTon.getBalance();

        expect(Number(sendTonBalanceBefore)).toBeGreaterThan(Number(sendTonBalanceAfter));
    });

    it('should can to withdraw safe', async () => {
        const sendTonBalanceBefore = await sendTon.getBalance();

        const res = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano("500")
            },
            "withdraw safe"
        );

        const sendTonBalanceAfter = await sendTon.getBalance();

        expect(Number(sendTonBalanceAfter)).toBeGreaterThan(0n)
    });

    it('should can contract owner to withdraw', async () => {
        const sendTonBalanceBefore = await sendTon.getBalance();

        // console.log("sendTonBalanceBefore - " + sendTonBalanceBefore);
        // console.log("owner balance before - " +  fromNano(await deployer.getBalance()));

        const res = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano("3000")
            },
            { 
                $$type: "Withdraw",
                amount: toNano("7500") 
            }
        );

        const sendTonBalanceAfter = await sendTon.getBalance();

        // console.log("sendTonBalanceAfter - " + sendTonBalanceAfter);
        // console.log("owner balance after - " + fromNano(await deployer.getBalance()));

        expect(Number(sendTonBalanceAfter)).toBeLessThan(Number(sendTonBalanceBefore));
    });
});
