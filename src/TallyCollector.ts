import { ITally } from "./ITally";
import { Proposal } from "./Proposal";

export class TallyCollector implements ITally {
    private _proposals: Proposal[] = [];

    public constructor(proposalAmount: number, mentionAmount: number) {
        console.assert(proposalAmount > 0, "Proposal amount cannot be less than 1");
        console.assert(mentionAmount > 0, "Mention amount cannot be less than 1");

        let meritProfile: bigint[];

        for (let i: number = 0; i < proposalAmount; i++) {
            meritProfile = [];

            for (let j: number = 0; j < mentionAmount; j++) meritProfile.push(0n);

            this._proposals.push(new Proposal(meritProfile));
        }
    }

    public get proposals(): Proposal[] {
        return this._proposals;
    }

    public get voterAmount(): bigint {
        return this._guessVoterAmount();
    }

    public get proposalAmount(): number {
        return this._proposals.length;
    }

    public get mentionAmount(): number {
        return this._proposals[0].mentionAmount;
    }

    protected _guessVoterAmount(): bigint {
        let amountOfJudges: bigint = 0n;
        let tmp: bigint;
        const proposals = this.proposals;

        for (let i: number = proposals.length - 1; i > -1; --i) {
            tmp = proposals[i].voteAmount;

            if (tmp > amountOfJudges) amountOfJudges = tmp;
        }

        return amountOfJudges;
    }

    public collect(proposalIndex: number, mentionIndex: number): void {

        const tally: bigint[] = this.proposals[proposalIndex].meritProfile;
        tally[mentionIndex] = tally[mentionIndex] + 1n;
    }
}
