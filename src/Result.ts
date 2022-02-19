import { IResult } from "./IResult";
import { IProposalResult } from "./IProposalResult";

export class Result implements IResult {
    protected _proposalResults: IProposalResult[];

    public get proposalResults(): IProposalResult[] {
        return this._proposalResults;
    }

    public constructor(proposalResults: IProposalResult[]) {
        this._proposalResults = proposalResults;
    }
}
