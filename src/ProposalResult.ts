import { IProposalResult } from "./ProposalResultInterface";
import { ProposalTallyAnalysis } from "./ProposalTallyAnalysis";

export class ProposalResult implements IProposalResult {
    protected _rank: number;
    protected _score: string;
    protected _analysis: ProposalTallyAnalysis;

    public constructor(analysis: ProposalTallyAnalysis, score: string, rank: number = 0) {
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

    public get analysis(): ProposalTallyAnalysis {
        return this._analysis;
    }
}
