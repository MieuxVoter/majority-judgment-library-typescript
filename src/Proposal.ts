import { IProposal } from "./IProposal";

export class Proposal implements IProposal {
    protected _meritProfile: bigint[];

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

    public moveVotes(fromMentionIndex: number, intoMentionIndex: number): void {
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
