import { DefaultGradeTally } from "./DefaultGradeTally";
import { IProposal } from "./IProposal";
import { ITally } from "./ITally";
import { ProposalAnalysis } from "./ProposalAnalysis";

/**
 * Fill the missing judgments into the median grade of each proposal. Useful when the proposals have
 * not received the exact same amount of votes and the median grade is considered a sane default.
 */
export class MedianDefaultTally extends DefaultGradeTally implements ITally {
    public constructor(proposals: IProposal[], voterAmount: bigint) {
        super(proposals, voterAmount);
        this._fillWithDefaultMention();
    }

    protected override _getDefaultMentionIndexForProposal(proposal: IProposal): number {
        return new ProposalAnalysis(proposal).medianGrade;
    }
}
