import { IProposalTally } from "./IProposalTally";
import { ITally } from "./ITally";
import { ProposalTally } from "./ProposalTally";
import { Tally } from "./Tally";
import { lcm } from "./BigintTools";

/**
 * The deliberator expects the proposals' tallies to hold the same amount of judgments. This
 * NormalizedTally accepts tallies with disparate amounts of judgments per proposal, and normalizes
 * them to their least common multiple, which amounts to using percentages, except we don't use
 * floating-point arithmetic.
 *
 * <p>This is useful when there are too many proposals for judges to be expected to judge them all,
 * and all the proposals received reasonably similar amounts of judgments.
 */
export class NormalizedTally extends Tally implements ITally {
    public constructor(proposalsTallies: IProposalTally[]) {
        super(proposalsTallies);
        this._initializeFromProposalsTallies(proposalsTallies);
    }

    protected _initializeFromProposalsTallies(proposalsTallies: IProposalTally[]): void {
        const amountOfProposals: number = this.amountOfProposals;
        let amountOfJudges: bigint = 1n;

        for (let i: number = proposalsTallies.length - 1; i > -1; --i) {
            amountOfJudges = lcm(amountOfJudges, proposalsTallies[i].amountOfJudgments);
        }

        if (amountOfJudges == 0n) {
            throw new Error("Cannot normalize: one or more proposals have no judgments.");
        }

        // Normalize proposals to the LCM
        let normalizedTallies: ProposalTally[] = new Array(amountOfProposals);
        let proposalTally: IProposalTally;
        let normalizedTally: ProposalTally;
        let factor: bigint;
        let amountOfGrades: number;
        let gradesTallies: bigint[];

        for (let i: number = 0; i < amountOfProposals; i++) {
            proposalTally = proposalsTallies[i];
            normalizedTally = new ProposalTally(proposalTally.tally);
            factor = amountOfJudges / proposalTally.amountOfJudgments;
            amountOfGrades = proposalTally.tally.length;
            gradesTallies = normalizedTally.tally;

            for (let j: number = 0; j < amountOfGrades; j++) {
                gradesTallies[j] *= factor;
            }

            normalizedTallies[i] = normalizedTally;
        }

        this._proposalsTallies = normalizedTallies;
        this._amountOfJudges = amountOfJudges;
    }
}
