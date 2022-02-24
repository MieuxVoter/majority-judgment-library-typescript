import { IProposal } from "./IProposal";

/**
 * Interface to represent an election/poll
 */
export interface ITally {
    get proposals(): IProposal[];
    get voterAmount(): bigint;
    get proposalAmount(): number;
    get mentionAmount(): number;
}
