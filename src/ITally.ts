import { IProposalTally } from "./IProposalTally";

export interface ITally {
    get proposalsTallies(): IProposalTally[];
    get amountOfJudges(): bigint;
    get amountOfProposals(): number;
}
