import { IProposal } from "./IProposal";
import { ITally } from "./ITally";
import { Proposal } from "./Proposal";
import { Tally } from "./Tally";
import { lcm } from "./BigintTools";

/**
 * The deliberator expects the proposals' tallies to hold the same amount of vote. This
 * NormalizedTally accepts proposals with disparate amounts of vote per proposal, and normalizes
 * them to their least common multiple, which amounts to using percentages, except we don't use
 * floating-point arithmetic.
 *
 * <p>This is useful when there are too many proposals for voter to be expected to vote them all,
 * and all the proposals received reasonably similar amounts of votes.
 */
export class NormalizedTally extends Tally implements ITally {
    public constructor(proposals: IProposal[]) {
        super(proposals);
        this._initializeFromProposalsTallies(proposals);
    }

    protected _initializeFromProposalsTallies(proposals: IProposal[]): void {
        const proposalAmount: number = this.proposalAmount;
        let voterAmount: bigint = 1n;

        for (let i: number = proposals.length - 1; i > -1; --i) {
            voterAmount = lcm(voterAmount, proposals[i].voteAmount);
        }

        if (voterAmount == 0n) {
            throw new Error("Cannot normalize: one or more proposals have no vote.");
        }

        // Normalize proposals to the LCM
        let normalizedTallies: Proposal[] = new Array(proposalAmount);
        let proposal: IProposal;
        let normalizedProposal: Proposal;
        let factor: bigint;
        let mentionAmount: number;
        let meritProfile: bigint[];

        for (let i: number = 0; i < proposalAmount; i++) {
            proposal = proposals[i];
            normalizedProposal = new Proposal(proposal.meritProfile);
            factor = voterAmount / proposal.voteAmount;
            mentionAmount = proposal.meritProfile.length;
            meritProfile = normalizedProposal.meritProfile;

            for (let j: number = 0; j < mentionAmount; j++) {
                meritProfile[j] *= factor;
            }

            normalizedTallies[i] = normalizedProposal;
        }

        this._proposals = normalizedTallies;
        this._voterAmount = voterAmount;
    }
}
