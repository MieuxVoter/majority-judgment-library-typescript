import { IProposalResult } from "./IProposalResult";

/**
 * The result return by a {@link IDeliberator}
 */
export interface IResult {
    /**
     * {@link IProposalResult} are not ordered by rank, they are in the order the proposals' tallies were
     * submitted.
     *
     * @return an array of {@link IProposalResult}, in the order the {@link IProposal} were submitted.
     */
    get proposalResults(): IProposalResult[];
}
