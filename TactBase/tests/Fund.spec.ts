import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Fund } from '../wrappers/Fund';
import { Company } from '../wrappers/Company';
import '@ton/test-utils';

describe('Fund', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let fund: SandboxContract<Fund>;
    let company: SandboxContract<Company>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        fund = blockchain.openContract(await Fund.fromInit());
        company = blockchain.openContract(await Company.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployFundResult = await fund.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployCompanyResult = await company.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployFundResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fund.address,
            deploy: true,
            success: true,
        });

        expect(deployCompanyResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: company.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {});

    it('should can deposit', async () => {
        const depositAmount = 5n;
        const balanceBeforeDeposit = await fund.getBalance();

        // console.log("balanceBeforeDeposit: " + balanceBeforeDeposit);

        await fund.send(
            deployer.getSender(),
            {
                value: toNano("0.05"),
            },
            {
                $$type: "Deposit",
                amount: depositAmount,
            }
        );

        const balanceAfterDeposit = await fund.getBalance();

        // console.log("balanceAfterDeposit: " + balanceAfterDeposit);

        expect(balanceBeforeDeposit).toEqual(11n);
        expect(balanceAfterDeposit).toEqual(balanceBeforeDeposit + depositAmount);
    });

    it('should can withdraw', async () => {
        const withdrawAmount = 7n;
        const fundBalanceBeforeWithdraw = await fund.getBalance();
        const companyBalanceBeforeWithdraw = await company.getBalance();

        console.log("fund balanceBeforeWithdraw: " + fundBalanceBeforeWithdraw);
        console.log("company balanceBeforeWithdraw: " + companyBalanceBeforeWithdraw);

        await fund.send(
            deployer.getSender(),
            {
                value: toNano("0.05"),
            },
            {
                $$type: "Withdraw",
                amount: withdrawAmount,
                target: company.address
            }
        );
        const fundBalanceAfterWithdraw = await fund.getBalance();
        const companyBalanceAfterWithdraw = await company.getBalance();

        console.log("fund balanceAfterWithdraw: " + fundBalanceAfterWithdraw);
        console.log("company balanceAfterWithdraw: " + companyBalanceAfterWithdraw);

        expect(fundBalanceBeforeWithdraw).toEqual(11n);
        expect(fundBalanceAfterWithdraw).toEqual(4n);
        expect(companyBalanceBeforeWithdraw).toEqual(11n);
        expect(companyBalanceAfterWithdraw).toEqual(18n);
    });
});
