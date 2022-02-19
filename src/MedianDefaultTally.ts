import { DefaultGradeTally } from "./DefaultGradeTally";
import { IProposal } from "./IProposal";
import { ITally } from "./ITally";
import { ProposalTallyAnalysis } from "./ProposalTallyAnalysis";

/**
 * Fill the missing judgments into the median grade of each proposal. Useful when the proposals have
 * not received the exact same amount of votes and the median grade is considered a sane default.
 */
export class MedianDefaultTally extends DefaultGradeTally implements ITally {
    public constructor(proposalsTallies: IProposal[], amountOfJudges: bigint) {
        super(proposalsTallies, amountOfJudges);
        this._fillWithDefaultGrade();
    }

    protected override _getDefaultGradeForProposal(proposalTally: IProposal): number {
        return new ProposalTallyAnalysis(proposalTally).medianGrade;
    }
}
