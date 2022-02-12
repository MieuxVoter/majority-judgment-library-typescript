import { InvalidTallyError } from "./InvalidTallyError";

/**
 * Raised when the provided tally does not hold the same amount of judgments for each proposal, and
 * normalization is required.
 */
export class UnbalancedTallyError extends InvalidTallyError {
    public constructor() {
        super(
            "The provided tally is unbalanced, as some proposals received more judgments than" +
                " others. \n" +
                "You need to set a strategy for balancing tallies. To that effect, \n" +
                "you may use StaticDefaultTally, MedianDefaultTally, or NormalizedTally" +
                " instead of Tally. \n"
        );
    }
}
