import { IProposalTally } from "./IProposalTally";
import { ITally } from "./ITally";
import { Tally } from "./Tally";

/**
 * Fill the missing judgments into the grade defined by `getDefaultGrade()`. This is an abstract
 * class to dry code between static default grade and median default grade.
 */
export abstract class DefaultGradeTally extends Tally implements ITally {
    /** Override this to choose the default grade for a given proposal. */
    protected abstract _getDefaultGradeForProposal(proposalTally: IProposalTally): number;

    // <domi41> /me is confused with why we need constructors in an abstract class?
    public constructor(proposalsTallies: IProposalTally[], amountOfJudges: bigint) {
        super(proposalsTallies, amountOfJudges);
    }

    protected _fillWithDefaultGrade(): void {
        const amountOfProposals: number = this.amountOfProposals;
        const proposalsTallies = this.proposalsTallies;
        let proposalTally: IProposalTally;
        let defaultGrade: number;
        let amountOfJudgments: bigint;
        let missingAmount: bigint;
        let rawTally: bigint[];

        for (let i: number = 0; i < amountOfProposals; i++) {
            proposalTally = proposalsTallies[i];
            defaultGrade = this._getDefaultGradeForProposal(proposalTally);
            amountOfJudgments = proposalTally.amountOfJudgments;
            missingAmount = this.amountOfJudges - amountOfJudgments;
            console.assert(missingAmount > 0, "More judgments than judges!");

            if (missingAmount > 0) {
                rawTally = proposalTally.tally;
                rawTally[defaultGrade] = rawTally[defaultGrade] + missingAmount;
            }
        }
    }
}
