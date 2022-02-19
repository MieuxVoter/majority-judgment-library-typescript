import { IDeliberator } from "./IDeliberator";
import { IncoherentTallyError } from "./IncoherentTallyError";
import { IProposal } from "./IProposal";
import { IResult } from "./IResult";
import { ITally } from "./ITally";
import { ProposalResult } from "./ProposalResult";
import { IProposalResult } from "./ProposalResultInterface";
import { ProposalTallyAnalysis } from "./ProposalTallyAnalysis";
import { Result } from "./Result";
import { UnbalancedTallyError } from "./UnbalancedTallyError";

/**
 * Deliberate using Majority Judgment.
 *
 * <p>Sorts Proposals by their median Grade. When two proposals share the same median Grade, give
 * reason to the largest group of people that did not give the median Grade.
 *
 * <p>This algorithm is score-based, for performance (and possible parallelization). Each Proposal
 * gets a score, higher (lexicographically) is "better" (depends of the meaning of the Grades). We
 * use Strings instead of Integers or raw Bits for the score. Improve if you feel like it and can
 * benchmark things.
 *
 * <p>https://en.wikipedia.org/wiki/Majority_judgment
 * https://fr.wikipedia.org/wiki/Jugement_majoritaire
 *
 * <p>Should this class be `final`?
 */
export class MajorityJudgmentDeliberator implements IDeliberator {
    protected _favorContestation: boolean;
    protected _numerizeScore: boolean;

    public constructor(
        favorContestation: boolean | undefined = undefined,
        numericScore: boolean | undefined = undefined
    ) {
        this._favorContestation = favorContestation === undefined ? true : favorContestation;
        this._numerizeScore = numericScore || false;
    }

    /**
     *
     * @param TallyInterface
     * @param tally
     * @returns
     * @throws {InvalidTallyException}
     */
    public deliberate(tally: ITally): IResult {
        this._checkTally(tally);

        const tallies: IProposal[] = tally.proposals;
        const amountOfJudges: bigint = tally.voterAmount;
        const amountOfProposals: number = tally.proposalAmount;
        const proposalResults: ProposalResult[] = [];

        let proposalTally: IProposal;
        let score: string;
        let proposalResult: ProposalResult;
        let analysis: ProposalTallyAnalysis;

        // I. Compute the scores of each Proposal
        for (let proposalIndex: number = 0; proposalIndex < amountOfProposals; proposalIndex++) {
            proposalTally = tallies[proposalIndex];
            score = this._computeScore(proposalTally, amountOfJudges);
            analysis = new ProposalTallyAnalysis(proposalTally, this._favorContestation);
            proposalResult = new ProposalResult(analysis, score);
            // proposalResult.setRank(???); // rank is computed below, AFTER the score pass
            proposalResults[proposalIndex] = proposalResult;
        }

        // II. Sort Proposals by score (lexicographical inverse)
        const proposalResultsSorted: ProposalResult[] = proposalResults.slice();
        /*console.assert (proposalResultsSorted[0].hashCode()
                == proposalResults[0].hashCode()); // we need a shallow clone*/

        proposalResultsSorted.sort((pA: IProposalResult, pB: IProposalResult) => {
            if (pB.score > pA.score) return 1;
            else if (pB.score < pA.score) return -1;

            return 0;
        });

        // III. Attribute a rank to each Proposal
        let rank: number = 1;
        let actualRank: number;
        let proposalResultBefore: ProposalResult;

        for (let proposalIndex: number = 0; proposalIndex < amountOfProposals; ++proposalIndex) {
            proposalResult = proposalResultsSorted[proposalIndex];
            actualRank = rank;

            if (proposalIndex > 0) {
                proposalResultBefore = proposalResultsSorted[proposalIndex - 1];

                if (proposalResult.score == proposalResultBefore.score) {
                    actualRank = proposalResultBefore.rank;
                }
            }

            proposalResult.rank = actualRank;
            rank += 1;
        }

        return new Result(proposalResults);
    }

    /**
     *
     * @param tally
     * @throws {UnbalancedTallyError}
     */
    protected _checkTally(tally: ITally): void {
        if (!this._isTallyCoherent(tally)) {
            throw new IncoherentTallyError();
        }
        if (!this._isTallyBalanced(tally)) {
            throw new UnbalancedTallyError();
        }
    }

    protected _isTallyCoherent(tally: ITally): boolean {
        const proposalsTallies: IProposal[] = tally.proposals;
        let innerTally: bigint[];

        for (let i: number = proposalsTallies.length - 1; i > -1; --i) {
            innerTally = proposalsTallies[i].meritProfile;

            for (let j: number = innerTally.length - 1; j > -1; --j) {
                if (innerTally[j] < 0n) return false;
            }
        }

        return true;
    }

    protected _isTallyBalanced(tally: ITally): boolean {
        const proposalsTallies: IProposal[] = tally.proposals;
        let amountOfJudges: bigint = proposalsTallies[proposalsTallies.length - 1].voteAmount;

        for (let i: number = proposalsTallies.length - 2; i > -1; --i)
            if (proposalsTallies[i].voteAmount != amountOfJudges) return false;

        return true;
    }

    /**
     * A higher score means a better rank. Assumes that grades' tallies are provided from "worst"
     * grade to "best" grade.
     *
     * @param tally Holds the tallies of each Grade for a single Proposal
     * @param amountOfJudges
     * @param favorContestation Use the lower median, for example
     * @param onlyNumbers Do not use separation characters, match `^[0-9]+$`
     * @return the score of the proposal
     */
    protected _computeScore(
        proposalTally: IProposal,
        amountOfJudges: bigint,
        favorContestation: boolean | undefined = undefined,
        onlyNumbers: boolean | undefined = undefined
    ): string {
        favorContestation = favorContestation || this._favorContestation;
        onlyNumbers = onlyNumbers || this._numerizeScore;

        let analysis: ProposalTallyAnalysis = new ProposalTallyAnalysis();
        let amountOfGrades: number = proposalTally.meritProfile.length;
        let digitsForGrade: number = this._countDigits(amountOfGrades);
        let digitsForGroup: number = this._countDigits(amountOfJudges) + 1;

        let currentTally: IProposal = proposalTally.clone();

        let score: string = "";

        for (let i: number = 0; i < amountOfGrades; i++) {
            analysis.update(currentTally, favorContestation);

            if (0 < i && !onlyNumbers) {
                score += "/";
            }

            score += analysis.medianGrade.toString().padStart(digitsForGrade, "0");

            if (!onlyNumbers) {
                score += "_";
            }

            score += (
                amountOfJudges +
                analysis.secondMedianGroupSize * BigInt(analysis.secondMedianGroupSign)
            )
                .toString()
                .padStart(digitsForGroup, "0");

            currentTally.moveVotes(analysis.medianGrade, analysis.secondMedianGrade);
        }

        return score;
    }

    protected _countDigits(number: number | bigint): number {
        return number.toString().length;
    }
}
