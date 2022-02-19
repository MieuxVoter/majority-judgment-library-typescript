import { ITally } from "./ITally";
import { Proposal } from "./Proposal";

export class CollectedTally implements ITally {
    private _amountOfProposals: number = 0;
    private _amountOfGrades: number = 0;

    private _proposalsTallies: Proposal[] = [];

    public constructor(amountOfProposals: number, amountOfGrades: number) {
        this._amountOfProposals = amountOfProposals;
        this._amountOfGrades = amountOfGrades;
        let tally: bigint[];

        for (let i: number = 0; i < amountOfProposals; i++) {
            tally = [];

            for (let j: number = 0; j < amountOfGrades; j++) tally.push(0n);

            this._proposalsTallies.push(new Proposal(tally));
        }
    }

    public get proposalsTallies(): Proposal[] {
        return this._proposalsTallies;
    }

    public get amountOfJudges(): bigint {
        return this.guessAmountOfJudges();
    }

    public get amountOfProposals(): number {
        return this._amountOfProposals;
    }

    public get amountOfGrades(): number {
        return this._amountOfGrades;
    }

    protected guessAmountOfJudges(): bigint {
        let amountOfJudges: bigint = 0n;
        let tmp: bigint;
        const proposalTallies = this.proposalsTallies;

        for (let i: number = proposalTallies.length - 1; i > -1; --i) {
            tmp = proposalTallies[i].amountOfJudgments;

            if (tmp > amountOfJudges) amountOfJudges = tmp;
        }

        return amountOfJudges;
    }

    public collect(proposal: number, grade: number): void {
        console.assert(0 <= proposal);
        console.assert(this._amountOfProposals > proposal);
        console.assert(0 <= grade);
        console.assert(this._amountOfGrades > grade);

        const tally: bigint[] = this.proposalsTallies[proposal].meritProfile;
        tally[grade] = tally[grade] + 1n;
    }
}
