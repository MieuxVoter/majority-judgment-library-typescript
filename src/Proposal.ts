import { IProposal } from "./IProposal";

/**
 * Represent one proposal and its profil merit
 */
export class Proposal implements IProposal {
    /**
     * Amounts of judgments received per grade, from "worst" grade to "best" grade. Those are
     * bigintegers because of our LCM-based normalization shenanigans.
     */
    protected _meritProfile: bigint[];

    public get meritProfile(): bigint[] {
        return this._meritProfile;
    }

    public constructor(meritProfile: bigint[]) {
        this._meritProfile = meritProfile.slice(0);
    }

    public clone(): IProposal {
        return new Proposal(this._meritProfile.slice());
    }

    public moveJudgments(fromGrade: number, intoGrade: number): void {
        this._meritProfile[intoGrade] =
            this._meritProfile[intoGrade] + this._meritProfile[fromGrade];
        this._meritProfile[fromGrade] = 0n;
    }

    public get amountOfJudgments(): bigint {
        let sum: bigint = 0n;

        for (let i: number = this._meritProfile.length - 1; i > -1; --i)
            sum += this._meritProfile[i];

        return sum;
    }
}
