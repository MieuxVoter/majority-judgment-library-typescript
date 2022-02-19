import { IProposal } from "./IProposal";

export interface ITally {
    get proposalsTallies(): IProposal[];
    get amountOfJudges(): bigint;
    get amountOfProposals(): number;
}
