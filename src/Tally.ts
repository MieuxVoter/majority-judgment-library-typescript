import { IProposalTally } from "./IProposalTally";
import { ITally } from "./ITally";

/**
 * A Basic implementation of a TallyInterface that reads from an array of ProposalTallyInterface.
 */
export class Tally implements ITally {
    protected _proposalsTallies: IProposalTally[];
    protected _amountOfJudges: bigint;

    public constructor(
        proposalsTallies: IProposalTally[],
        amountOfJudges: bigint | undefined = undefined
    ) {
        this._proposalsTallies = proposalsTallies;

        if (!amountOfJudges) {
            this._guessAmountOfJudges();
        } else {
            this._amountOfJudges = amountOfJudges;
        }
    }

    public get proposalsTallies(): IProposalTally[] {
        return this._proposalsTallies;
    }

    public get amountOfProposals(): number {
        return this._proposalsTallies.length;
    }

    public get amountOfJudges(): bigint {
        return this._amountOfJudges;
    }

    protected _guessAmountOfJudges(): void {
        let amountOfJudges: bigint = 0n;
        let tmp: bigint;

        for (let i: number = this._proposalsTallies.length - 1; i > -1; --i) {
            tmp = this._proposalsTallies[i].amountOfJudgments;

            if (tmp > amountOfJudges) amountOfJudges = tmp;
        }

        this._amountOfJudges = amountOfJudges;
    }
}
