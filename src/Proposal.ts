import { IProposal } from "./IProposal";

export class Proposal implements IProposal {
    protected _meritProfile: bigint[];

    /**
     * Per mention index, the amount of vote. Mention indexes are sorted from "worst" ("most conservative") to "best" mention.
     */
    public get meritProfile(): bigint[] {
        return this._meritProfile;
    }

    public get mentionAmount(): number {
        return this._meritProfile.length;
    }

    public constructor(meritProfile: bigint[]) {
        this._meritProfile = meritProfile.slice(0);
    }

    public clone(): IProposal {
        return new Proposal(this._meritProfile.slice());
    }

    /**
     * Move votes that were {@link fromMentionIndex} into {@link intoMentionIndex}. Used by the score calculus.
     * @param fromMentionIndex the amount at this index will be set to 0
     * @param intoMentionIndex the amount at {@param fromMentionIndex} will be added to the amount at {@param intoMentionIndex}
     */
    public moveVotes(fromMentionIndex: number, intoMentionIndex: number): void {
        const maxIndex = this.mentionAmount - 1;

        if (fromMentionIndex < 0 || fromMentionIndex > maxIndex)
            throw new Error(`fromMentionIndex out of range. Min index:0, Max index:${maxIndex}`);

        if (intoMentionIndex < 0 || intoMentionIndex > maxIndex)
            throw new Error(`intoMentionIndex out of range. Min index:0, Max index:${maxIndex}`);

        this._meritProfile[intoMentionIndex] =
            this._meritProfile[intoMentionIndex] + this._meritProfile[fromMentionIndex];
        this._meritProfile[fromMentionIndex] = 0n;
    }

    public get voteAmount(): bigint {
        let sum: bigint = 0n;

        for (let i: number = this._meritProfile.length - 1; i > -1; --i)
            sum += this._meritProfile[i];

        return sum;
    }
}
