import { IProposal } from "./IProposal";

/**
 * Collect useful data on a proposal tally. Does NOT compute the rank, but provides all we need.
 *
 * <p>This uses biginteger because in a normalization scenario we use the smallest common multiple
 * of the amounts of judges of proposals. It makes the code harder to read and understand, but it
 * allows us to bypass the floating-point nightmare of the normalization of merit profiles, which is
 * one way to handle default grades on some polls.
 */
export class ProposalAnalysis {
    protected _proposal: IProposal;
    protected _medianMentionIndex: number = 0;
    protected _medianGroupSize: bigint = 0n; // amount of judges in the median group
    protected _contestationMentionIndex: number = 0; // "best" grade of the contestation group
    protected _contestationGroupSize: bigint = 0n; // of lower grades than median
    protected _adhesionMentionIndex: number = 0; // "worst" grade of the adhesion group
    protected _adhesionGroupSize: bigint = 0n; // of higher grades than median
    protected _secondMedianMentionIndex: number = 0; // grade of the biggest group out of the median
    protected _secondMedianGroupSize: bigint = 0n; // either contestation or adhesion
    protected _secondMedianGroupSign: number = 0; // -1 for contestation, +1 for adhesion, 0 for empty group size

    public constructor(
        proposal: IProposal | undefined = undefined,
        favorContestation: boolean = true
    ) {
        if (proposal != undefined) this.update(proposal, favorContestation);
    }

    public update(proposal: IProposal, favorContestation: boolean = true) {
        this._proposal = proposal;
        this._medianMentionIndex = 0;
        this._medianGroupSize = 0n;
        this._contestationMentionIndex = 0;
        this._contestationGroupSize = 0n;
        this._adhesionMentionIndex = 0;
        this._adhesionGroupSize = 0n;
        this._secondMedianMentionIndex = 0;
        this._secondMedianGroupSize = 0n;
        this._secondMedianGroupSign = 0;

        const gradesTallies: bigint[] = proposal.meritProfile;
        const voteAmount: bigint = proposal.voteAmount;

        const adjustedTotal: bigint = favorContestation ? voteAmount - 1n : voteAmount;
        const medianIndex: bigint = adjustedTotal / 2n;

        let startIndex: bigint = 0n;
        let cursorIndex: bigint = 0n;
        const mentionAmont: number = gradesTallies.length;
        let mentionVoteAmount: bigint;

        for (let mentionIndex: number = 0; mentionIndex < mentionAmont; mentionIndex++) {
            mentionVoteAmount = proposal.meritProfile[mentionIndex];

            if (mentionVoteAmount == 0n) {
                continue;
            }

            startIndex = cursorIndex;
            cursorIndex += mentionVoteAmount;

            if (startIndex < medianIndex && cursorIndex <= medianIndex) {
                this._contestationGroupSize += mentionVoteAmount;
                this._contestationMentionIndex = mentionIndex;
            } else if (startIndex <= medianIndex && medianIndex < cursorIndex) {
                this._medianGroupSize = mentionVoteAmount;
                this._medianMentionIndex = mentionIndex;
            } else if (startIndex > medianIndex && medianIndex < cursorIndex) {
                this._adhesionGroupSize += mentionVoteAmount;
                if (0 == this._adhesionMentionIndex) {
                    this._adhesionMentionIndex = mentionIndex;
                }
            }
        }

        const contestationIsBiggest: boolean = favorContestation
            ? this.adhesionGroupSize <= this.contestationGroupSize
            : this.adhesionGroupSize < this.contestationGroupSize;

        if (contestationIsBiggest) {
            this._secondMedianMentionIndex = this._contestationMentionIndex;
            this._secondMedianGroupSize = this._contestationGroupSize;

            if (0 < this._secondMedianGroupSize) {
                this._secondMedianGroupSign = -1;
            }
        } else {
            this._secondMedianMentionIndex = this._adhesionMentionIndex;
            this._secondMedianGroupSize = this._adhesionGroupSize;

            if (0 < this._secondMedianGroupSize) {
                this._secondMedianGroupSign = 1;
            }
        }
    }

    public get proposal(): IProposal {
        return this._proposal;
    }

    public get medianMentionIndex(): number {
        return this._medianMentionIndex;
    }

    public get medianGroupSize(): bigint {
        return this._medianGroupSize;
    }

    public get contestationMentionIndex(): number {
        return this._contestationMentionIndex;
    }

    public get contestationGroupSize(): bigint {
        return this._contestationGroupSize;
    }

    public get adhesionMentionIndex(): number {
        return this._adhesionMentionIndex;
    }

    public get adhesionGroupSize(): bigint {
        return this._adhesionGroupSize;
    }

    public get secondMedianMentionIndex(): number {
        return this._secondMedianMentionIndex;
    }

    public get secondMedianGroupSize(): bigint {
        return this._secondMedianGroupSize;
    }

    public get secondMedianGroupSign(): number {
        return this._secondMedianGroupSign;
    }
}
