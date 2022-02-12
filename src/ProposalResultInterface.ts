import { ProposalTallyAnalysis } from "./ProposalTallyAnalysis";

export interface IProposalResult {
    /**
     * Rank starts at 1 ("best" proposal), and goes upwards. Multiple Proposals may receive the same
     * rank, in the extreme case where they received the exact same judgments, or the same judgment
     * repartition in normalized tallies.
     */
    get rank(): number;

    /**
     * This score was used to compute the rank. It is made of integer characters, with zeroes for
     * padding. Inverse lexicographical order: "higher" is "better". You're probably never going to
     * need this, but it's here anyway.
     */
    get score(): string;

    /** Get more data about the proposal tally, such as the median grade. */
    get analysis(): ProposalTallyAnalysis;
}
