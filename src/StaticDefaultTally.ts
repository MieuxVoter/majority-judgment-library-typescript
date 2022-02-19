import { DefaultGradeTally } from "./DefaultGradeTally";
import { IProposal } from "./IProposal";
import { ITally } from "./ITally";

export class StaticDefaultTally extends DefaultGradeTally implements ITally {
    /**
     * Grades are represented as numbers, as indices in a list. Grades start from 0 ("worst" grade,
     * most conservative) and go upwards. Values out of the range of grades defined in the tally
     * will yield errors.
     *
     * <p>Example:
     *
     * <p>0 == REJECT 1 == PASSABLE 2 == GOOD 3 == EXCELLENT
     */
    protected _defaultGrade: number = 0;

    public constructor(
        proposalsTallies: IProposal[],
        amountOfJudges: bigint,
        defaultGrade: number
    ) {
        super(proposalsTallies, amountOfJudges);
        this._defaultGrade = defaultGrade;
        this._fillWithDefaultGrade();
    }

    protected override _getDefaultGradeForProposal(_: IProposal): number {
        return this._defaultGrade;
    }
}
