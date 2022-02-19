import { IProposal } from "./IProposal";
import { ITally } from "./ITally";
import { Tally } from "./Tally";

/**
 * Fill the missing judgments into the grade defined by `getDefaultGrade()`. This is an abstract
 * class to dry code between static default grade and median default grade.
 */
export abstract class DefaultGradeTally extends Tally implements ITally {
    /** Override this to choose the default grade for a given proposal. */
    protected abstract _getDefaultMentionIndexForProposal(proposalTally: IProposal): number;

    // <domi41> /me is confused with why we need constructors in an abstract class?
    public constructor(proposalsTallies: IProposal[], amountOfJudges: bigint) {
        super(proposalsTallies, amountOfJudges);
    }

    protected _fillWithDefaultMention(): void {
        const proposalAmount: number = this.proposalAmount;
        const proposals = this.proposals;
        let proposal: IProposal;
        let defaultMentionIndex: number;
        let voteAmount: bigint;
        let missingVoteAmount: bigint;
        let rawTally: bigint[];

        for (let i: number = 0; i < proposalAmount; i++) {
            proposal = proposals[i];
            defaultMentionIndex = this._getDefaultMentionIndexForProposal(proposal);
            voteAmount = proposal.voteAmount;
            missingVoteAmount = this.voterAmount - voteAmount;
            console.assert(missingVoteAmount > 0, "More judgments than judges!");

            if (missingVoteAmount > 0) {
                rawTally = proposal.meritProfile;
                rawTally[defaultMentionIndex] = rawTally[defaultMentionIndex] + missingVoteAmount;
            }
        }
    }
}
