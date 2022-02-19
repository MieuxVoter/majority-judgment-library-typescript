import { IDeliberator } from "./IDeliberator";
import { IncoherentTallyError } from "./IncoherentTallyError";
import { IProposal } from "./IProposal";
import { IResult } from "./IResult";
import { ITally } from "./ITally";
import { ProposalResult } from "./ProposalResult";
import { IProposalResult } from "./IProposalResult";
import { ProposalAnalysis } from "./ProposalAnalysis";
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

        const proposals: IProposal[] = tally.proposals;
        const voterAmount: bigint = tally.voterAmount;
        const proposalAmount: number = tally.proposalAmount;
        const proposalResults: ProposalResult[] = [];

        let proposal: IProposal;
        let score: string;
        let proposalResult: ProposalResult;
        let analysis: ProposalAnalysis;

        // I. Compute the scores of each Proposal
        for (let proposalIndex: number = 0; proposalIndex < proposalAmount; proposalIndex++) {
            proposal = proposals[proposalIndex];
            score = this._computeScore(proposal, voterAmount);
            analysis = new ProposalAnalysis(proposal, this._favorContestation);
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

        for (let proposalIndex: number = 0; proposalIndex < proposalAmount; ++proposalIndex) {
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
        const proposals: IProposal[] = tally.proposals;
        let innerTally: bigint[];

        for (let i: number = proposals.length - 1; i > -1; --i) {
            innerTally = proposals[i].meritProfile;

            for (let j: number = innerTally.length - 1; j > -1; --j) {
                if (innerTally[j] < 0n) return false;
            }
        }

        return true;
    }

    protected _isTallyBalanced(tally: ITally): boolean {
        const proposals: IProposal[] = tally.proposals;
        let amountOfJudges: bigint = proposals[proposals.length - 1].voteAmount;

        for (let i: number = proposals.length - 2; i > -1; --i)
            if (proposals[i].voteAmount != amountOfJudges) return false;

        return true;
    }

    /**
     * A higher score means a better rank. Assumes that grades' tallies are provided from "worst"
     * grade to "best" grade.
     *
     * @param tally Holds the tallies of each Grade for a single Proposal
     * @param voterAmount
     * @param favorContestation Use the lower median, for example
     * @param onlyNumbers Do not use separation characters, match `^[0-9]+$`
     * @return the score of the proposal
     */
    protected _computeScore(
        proposal: IProposal,
        voterAmount: bigint,
        favorContestation: boolean | undefined = undefined,
        onlyNumbers: boolean | undefined = undefined
    ): string {
        favorContestation = favorContestation || this._favorContestation;
        onlyNumbers = onlyNumbers || this._numerizeScore;

        let analysis: ProposalAnalysis = new ProposalAnalysis();
        let mentionAmount: number = proposal.mentionAmount;
        let digitsForGrade: number = this._countDigits(mentionAmount);
        let digitsForGroup: number = this._countDigits(voterAmount) + 1;

        let currentProposal: IProposal = proposal.clone();

        let score: string = "";

        for (let i: number = 0; i < mentionAmount; i++) {
            analysis.update(currentProposal, favorContestation);

            if (0 < i && !onlyNumbers) {
                score += "/";
            }

            score += analysis.medianGrade.toString().padStart(digitsForGrade, "0");

            if (!onlyNumbers) {
                score += "_";
            }

            score += (
                voterAmount +
                analysis.secondMedianGroupSize * BigInt(analysis.secondMedianGroupSign)
            )
                .toString()
                .padStart(digitsForGroup, "0");

            currentProposal.moveVotes(analysis.medianGrade, analysis.secondMedianGrade);
        }

        return score;
    }

    protected _countDigits(number: number | bigint): number {
        return number.toString().length;
    }
}
