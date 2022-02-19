import { IProposal } from "./IProposal";

export interface ITally {
    get proposals(): IProposal[];
    get voterAmount(): bigint;
    get proposalAmount(): number;
    get mentionAmount(): number;
}
