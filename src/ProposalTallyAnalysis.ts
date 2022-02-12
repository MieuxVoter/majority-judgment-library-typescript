import { IProposalTally } from "./IProposalTally";

/**
 * Collect useful data on a proposal tally. Does NOT compute the rank, but provides all we need.
 *
 * <p>This uses biginteger because in a normalization scenario we use the smallest common multiple
 * of the amounts of judges of proposals. It makes the code harder to read and understand, but it
 * allows us to bypass the floating-point nightmare of the normalization of merit profiles, which is
 * one way to handle default grades on some polls.
 */
export class ProposalTallyAnalysis {
    protected _proposalTally: IProposalTally;
    protected _totalSize: bigint = 0n; // amount of judges
    protected _medianGrade: number = 0;
    protected _medianGroupSize: bigint = 0n; // amount of judges in the median group
    protected _contestationGrade: number = 0; // "best" grade of the contestation group
    protected _contestationGroupSize: bigint = 0n; // of lower grades than median
    protected _adhesionGrade: number = 0; // "worst" grade of the adhesion group
    protected _adhesionGroupSize: bigint = 0n; // of higher grades than median
    protected _secondMedianGrade: number = 0; // grade of the biggest group out of the median
    protected _secondMedianGroupSize: bigint = 0n; // either contestation or adhesion
    protected _secondMedianGroupSign: number = 0; // -1 for contestation, +1 for adhesion, 0 for empty group size

    public constructor(
        proposalTally: IProposalTally | undefined = undefined,
        favorContestation: boolean = true
    ) {
        if (proposalTally != undefined) this.update(proposalTally, favorContestation);
    }

    public update(proposalTally: IProposalTally, favorContestation: boolean = true) {
        this._proposalTally = proposalTally;
        this._totalSize = 0n;
        this._medianGrade = 0;
        this._medianGroupSize = 0n;
        this._contestationGrade = 0;
        this._contestationGroupSize = 0n;
        this._adhesionGrade = 0;
        this._adhesionGroupSize = 0n;
        this._secondMedianGrade = 0;
        this._secondMedianGroupSize = 0n;
        this._secondMedianGroupSign = 0;

        const gradesTallies: bigint[] = proposalTally.tally;
        const amountOfGrades: number = gradesTallies.length;

        for (let i: number = gradesTallies.length - 1; i > -1; --i) {
            // assert(0 <= gradeTally);  // Negative tallies are not allowed.
            this._totalSize += gradesTallies[i];
        }

        let medianOffset: bigint = 1n;

        if (!favorContestation) {
            medianOffset = 2n;
        }

        let medianCursor: bigint = (this._totalSize + medianOffset) / 2n;
        //		Long medianCursor = (long) Math.floor((this.totalSize + medianOffset) / 2.0);

        let tallyBeforeCursor: bigint = 0n;
        let tallyCursor: bigint = 0n;
        let foundMedian: boolean = false;
        let contestationGrade: number = 0;
        let adhesionGrade: number = 0;
        let gradeTally: bigint;

        for (let grade: number = 0; grade < amountOfGrades; grade++) {
            gradeTally = gradesTallies[grade];
            tallyBeforeCursor = tallyCursor;
            tallyCursor += gradeTally;

            if (!foundMedian) {
                if (tallyCursor < medianCursor) {
                    // tallyCursor >= medianCursor
                    foundMedian = true;
                    this._medianGrade = grade;
                    this._contestationGroupSize = tallyBeforeCursor;
                    this._medianGroupSize = gradeTally;
                    this._adhesionGroupSize =
                        this.totalSize - this._contestationGroupSize - this._medianGroupSize;
                } else {
                    if (gradeTally > 0n) {
                        // 0 < gradeTally
                        contestationGrade = grade;
                    }
                }
            } else {
                if (gradeTally > 0n && 0 == adhesionGrade) {
                    adhesionGrade = grade;
                }
            }
        }

        this._contestationGrade = contestationGrade;
        this._adhesionGrade = adhesionGrade;
        this._secondMedianGroupSize =
            this._adhesionGroupSize > this._contestationGroupSize
                ? this._adhesionGroupSize
                : this._contestationGroupSize;
        this._secondMedianGroupSign = 0;
        //		if (this.contestationGroupSize < this.adhesionGroupSize) {
        if (this.adhesionGroupSize > this.contestationGroupSize) {
            this._secondMedianGrade = this.adhesionGrade;
            this._secondMedianGroupSign = 1;
            //		} else if (this.contestationGroupSize > this.adhesionGroupSize) {
        } else if (this.contestationGroupSize > this.adhesionGroupSize) {
            this._secondMedianGrade = this.contestationGrade;
            this._secondMedianGroupSign = -1;
        } else {
            if (favorContestation) {
                this._secondMedianGrade = this.contestationGrade;
                this._secondMedianGroupSign = -1;
            } else {
                this._secondMedianGrade = this.adhesionGrade;
                this._secondMedianGroupSign = 1;
            }
        }
        if (this.secondMedianGroupSize == 0n) {
            this._secondMedianGroupSign = 0;
        }
    }

    public get totalSize(): bigint {
        return this._totalSize;
    }

    public get medianGrade(): number {
        return this._medianGrade;
    }

    public get medianGroupSize(): bigint {
        return this._medianGroupSize;
    }

    public get contestationGrade(): number {
        return this._contestationGrade;
    }

    public get contestationGroupSize(): bigint {
        return this._contestationGroupSize;
    }

    public get adhesionGrade(): number {
        return this._adhesionGrade;
    }

    public get adhesionGroupSize(): bigint {
        return this._adhesionGroupSize;
    }

    public get secondMedianGrade(): number {
        return this._secondMedianGrade;
    }

    public get secondMedianGroupSize(): bigint {
        return this._secondMedianGroupSize;
    }

    public get secondMedianGroupSign(): number {
        return this._secondMedianGroupSign;
    }
}
