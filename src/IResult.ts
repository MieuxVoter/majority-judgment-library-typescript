import { IProposalResult } from "./ProposalResultInterface";

export interface IResult {
    /**
     * ProposalResults are not ordered by rank, they are in the order the proposals' tallies were
     * submitted.
     *
     * @return an array of `ProposalResult`, in the order the `ProposalTally`s were submitted.
     */
    get proposalResults(): IProposalResult[];
}
