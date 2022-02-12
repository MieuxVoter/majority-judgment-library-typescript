import { IProposalTally } from "./IProposalTally";

export class ProposalTally implements IProposalTally {
    /**
     * Amounts of judgments received per grade, from "worst" grade to "best" grade. Those are
     * bigintegers because of our LCM-based normalization shenanigans.
     */
    protected _tally: bigint[];

    public get tally(): bigint[] {
        return this._tally;
    }

    public constructor(tally: bigint[]) {
        this._tally = tally.slice(0);
    }

    public clone(): IProposalTally {
        return new ProposalTally(this._tally.slice());
    }

    public moveJudgments(fromGrade: number, intoGrade: number): void {
        this._tally[intoGrade] = this._tally[intoGrade] + this._tally[fromGrade];
        this._tally[fromGrade] = 0n;
    }

    public get amountOfJudgments(): bigint {
        let sum: bigint = 0n;

        for (let i: number = this._tally.length - 1; i > -1; --i) sum += this._tally[i];

        return sum;
    }
}
