import { IProposal } from "./IProposal";
import { ITally } from "./ITally";

/**
 * A Basic implementation of a {@link ITally} that reads from an array of {@link IProposal}.
 */
export class Tally implements ITally {
    protected _proposals: IProposal[];
    protected _voterAmount: bigint;

    public constructor(proposals: IProposal[], amountOfJudges: bigint | undefined = undefined) {
        if (proposals.length == 0)
            throw new Error("Cannot obtain result if the proposals param is empty");

        this._proposals = proposals;

        if (!amountOfJudges) {
            this._guessAmountOfJudges();
        } else {
            this._voterAmount = amountOfJudges;
        }
    }

    public get mentionAmount(): number {
        return this._proposals[0].mentionAmount;
    }

    public get proposals(): IProposal[] {
        return this._proposals;
    }

    public get proposalAmount(): number {
        return this._proposals.length;
    }

    public get voterAmount(): bigint {
        return this._voterAmount;
    }

    protected _guessAmountOfJudges(): void {
        let voterAmount: bigint = 0n;
        let tmp: bigint;

        for (let i: number = this._proposals.length - 1; i > -1; --i) {
            tmp = this._proposals[i].voteAmount;

            if (tmp > voterAmount) voterAmount = tmp;
        }

        this._voterAmount = voterAmount;
    }
}
