import { IProposal } from "./IProposal";
import { ITally } from "./ITally";
import { Proposal } from "./Proposal";
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
    public constructor(proposalsTallies: IProposal[]) {
        super(proposalsTallies);
        this._initializeFromProposalsTallies(proposalsTallies);
    }

    protected _initializeFromProposalsTallies(proposalsTallies: IProposal[]): void {
        const amountOfProposals: number = this.amountOfProposals;
        let amountOfJudges: bigint = 1n;

        for (let i: number = proposalsTallies.length - 1; i > -1; --i) {
            amountOfJudges = lcm(amountOfJudges, proposalsTallies[i].amountOfJudgments);
        }

        if (amountOfJudges == 0n) {
            throw new Error("Cannot normalize: one or more proposals have no judgments.");
        }

        // Normalize proposals to the LCM
        let normalizedTallies: Proposal[] = new Array(amountOfProposals);
        let proposalTally: IProposal;
        let normalizedTally: Proposal;
        let factor: bigint;
        let amountOfGrades: number;
        let meritProfile: bigint[];

        for (let i: number = 0; i < amountOfProposals; i++) {
            proposalTally = proposalsTallies[i];
            normalizedTally = new Proposal(proposalTally.meritProfile);
            factor = amountOfJudges / proposalTally.amountOfJudgments;
            amountOfGrades = proposalTally.meritProfile.length;
            meritProfile = normalizedTally.meritProfile;

            for (let j: number = 0; j < amountOfGrades; j++) {
                meritProfile[j] *= factor;
            }

            normalizedTallies[i] = normalizedTally;
        }

        this._proposalsTallies = normalizedTallies;
        this._amountOfJudges = amountOfJudges;
    }
}
