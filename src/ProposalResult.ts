import { IProposalResult } from "./IProposalResult";
import { ProposalAnalysis } from "./ProposalAnalysis";

export class ProposalResult implements IProposalResult {
    protected _rank: number;
    protected _score: string;
    protected _analysis: ProposalAnalysis;

    public constructor(analysis: ProposalAnalysis, score: string, rank: number = 0) {
        this._analysis = analysis;
        this._score = score;
        this._rank = rank;
    }

    public get rank(): number {
        return this._rank;
    }

    public set rank(pValue: number) {
        this._rank = pValue;
    }

    public get score(): string {
        return this._score;
    }

    public get analysis(): ProposalAnalysis {
        return this._analysis;
    }
}
