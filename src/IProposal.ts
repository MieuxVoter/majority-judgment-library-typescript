/**
 * Represent a proposal and its merit profile (holding the amounts of vote received per mention).
 */
export interface IProposal {
    /**
     * Per mention index, the amount of vote. Mention indexes are sorted from "worst" ("most conservative") to "best" mention.
     */
    get meritProfile(): bigint[];

    /**
     * The sum of all vote in {@see meritProfile}
     */
    get voteAmount(): bigint;

    /**
     * Amount of different mention
     */
    get mentionAmount(): number;

    /**
     * @returns a copy of this proposal
     */
    clone(): IProposal;

    /**
     * Move votes that were {@param fromMentionIndex} into {@param intoMentionIndex}. Used by the score calculus.
     * @param fromMentionIndex the amount at this index will be set to 0
     * @param intoMentionIndex the amount at {@param fromMentionIndex} will be added to the amount at {@param intoMentionIndex}
     */
    moveVotes(fromMentionIndex: number, intoMentionIndex: number): void;
}
