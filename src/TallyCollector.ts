import { ITally } from "./ITally";
import { Proposal } from "./Proposal";

export class TallyCollector implements ITally {
    private _proposals: Proposal[] = [];

    public constructor(proposalAmount: number, mentionAmount: number) {
        if (proposalAmount < 1) throw new Error("Proposal amount must be greater or equal to 1");
        if (mentionAmount < 2) throw new Error("Mention amount must be greater or equal to 2");

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

    /**
     * Add a vote to a mention of a proposal
     * @param proposalIndex
     * @param mentionIndex
     */
    public collect(proposalIndex: number, mentionIndex: number): void {
        if (proposalIndex < 0 && proposalIndex >= this.proposalAmount)
            throw new Error(
                `Proposal index must be between the min index (0) and the max index (${
                    this.proposalAmount - 1
                })`
            );

        if (mentionIndex < 0 && mentionIndex >= this.mentionAmount)
            throw new Error(
                `Mention index must be between the min index (0) and the max index (${
                    this.mentionAmount - 1
                })`
            );

        const meritProfile: bigint[] = this.proposals[proposalIndex].meritProfile;
        meritProfile[mentionIndex] += 1n;
    }
}
