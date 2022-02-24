import { InvalidTallyError } from "./InvalidTallyError";

/** Raised when the provided tally holds negative values, or infinity. */
export class IncoherentTallyError extends InvalidTallyError {
    public constructor() {
        super("The provided tally holds negative values, or infinity. ");
    }
}
