/**
 * Also known as the merit profile of a proposal (aka. candidate), this holds the amounts of
 * judgments received per grade.
 */
export interface IProposal {
    /**
     * The tallies of each Grade, that is the amount of judgments received for each Grade by the
     * Proposal, from "worst" ("most conservative") Grade to "best" Grade.
     */
    get meritProfile(): bigint[];

    /**
     * Should be the sum of getTally()
     *
     * @return The total amount of judgments received by this proposal.
     */
    get amountOfJudgments(): bigint;

    /** Homemade factory to skip the clone() shenanigans. Used by the score calculus. */
    clone(): IProposal;

    /** Move judgments that were fromGrade into intoGrade. Used by the score calculus. */
    moveJudgments(fromGrade: number, intoGrade: number): void;
}
