import { Proposal } from "./Proposal";
import { ProposalAnalysis } from "./ProposalAnalysis";

type Test = {
    name: string;
    rawTally: bigint[];
    medianGrade: number;
    medianGroupSize: bigint;
    contestationGrade: number;
    contestationGroupSize: bigint;
    adhesionGrade: number;
    adhesionGroupSize: bigint;
    secondMedianGrade: number;
    secondMedianGroupSize: bigint;
    secondMedianGroupSign: number;
};

const allTests: Test[] = [
    {
        name: "Very empty tallies yield zeroes",
        rawTally: [0n],
        medianGrade: 0,
        medianGroupSize: 0n,
        contestationGrade: 0,
        contestationGroupSize: 0n,
        adhesionGrade: 0,
        adhesionGroupSize: 0n,
        secondMedianGrade: 0,
        secondMedianGroupSize: 0n,
        secondMedianGroupSign: 0,
    },
    {
        name: "Empty tallies yield zeroes",
        rawTally: [0n, 0n, 0n, 0n],
        medianGrade: 0,
        medianGroupSize: 0n,
        contestationGrade: 0,
        contestationGroupSize: 0n,
        adhesionGrade: 0,
        adhesionGroupSize: 0n,
        secondMedianGrade: 0,
        secondMedianGroupSize: 0n,
        secondMedianGroupSign: 0,
    },
    {
        name: "Absurd tally of 1 Grade",
        rawTally: [7n],
        medianGrade: 0,
        medianGroupSize: 7n,
        contestationGrade: 0,
        contestationGroupSize: 0n,
        adhesionGrade: 0,
        adhesionGroupSize: 0n,
        secondMedianGrade: 0,
        secondMedianGroupSize: 0n,
        secondMedianGroupSign: 0,
    },
    {
        name: "Approbation",
        rawTally: [31n, 72n],
        medianGrade: 1,
        medianGroupSize: 72n,
        contestationGrade: 0,
        contestationGroupSize: 31n,
        adhesionGrade: 0,
        adhesionGroupSize: 0n,
        secondMedianGrade: 0,
        secondMedianGroupSize: 31n,
        secondMedianGroupSign: -1,
    },
    {
        name: "Equality favors contestation",
        rawTally: [42n, 42n],
        medianGrade: 0,
        medianGroupSize: 42n,
        contestationGrade: 0,
        contestationGroupSize: 0n,
        adhesionGrade: 1,
        adhesionGroupSize: 42n,
        secondMedianGrade: 1,
        secondMedianGroupSize: 42n,
        secondMedianGroupSign: 1,
    },
    {
        name: "Example with seven grades",
        rawTally: [4n, 2n, 0n, 1n, 2n, 2n, 3n],
        medianGrade: 3,
        medianGroupSize: 1n,
        contestationGrade: 1,
        contestationGroupSize: 6n,
        adhesionGrade: 4,
        adhesionGroupSize: 7n,
        secondMedianGrade: 4,
        secondMedianGroupSize: 7n,
        secondMedianGroupSign: 1,
    },
    {
        name: "Works even if multiple grades are at zero",
        rawTally: [4n, 0n, 0n, 1n, 0n, 0n, 4n],
        medianGrade: 3,
        medianGroupSize: 1n,
        contestationGrade: 0,
        contestationGroupSize: 4n,
        adhesionGrade: 6,
        adhesionGroupSize: 4n,
        secondMedianGrade: 0,
        secondMedianGroupSize: 4n,
        secondMedianGroupSign: -1,
    },
    {
        name: "Weird tally",
        rawTally: [1n, 1n, 1n, 1n, 1n, 1n, 1n],
        medianGrade: 3,
        medianGroupSize: 1n,
        contestationGrade: 2,
        contestationGroupSize: 3n,
        adhesionGrade: 4,
        adhesionGroupSize: 3n,
        secondMedianGrade: 2,
        secondMedianGroupSize: 3n,
        secondMedianGroupSign: -1,
    },
];

describe("ProposalTallyAnalysis", () => {
    for (let i: number = allTests.length - 1; i > -1; --i) {
        const test: Test = allTests[i];
        describe(test.name, () => {
            const tally: Proposal = new Proposal(test.rawTally);
            const pta: ProposalAnalysis = new ProposalAnalysis(tally);

            it("Median Grade", () => {
                expect(pta.medianGrade).toBe(test.medianGrade);
            });

            it("Median Group Size", () => {
                expect(pta.medianGroupSize).toBe(test.medianGroupSize);
            });

            it("Contestation Grade", () => {
                expect(pta.contestationGrade).toBe(test.contestationGrade);
            });

            it("Contestation Group Size", () => {
                expect(pta.contestationGroupSize).toBe(test.contestationGroupSize);
            });

            it("Adhesion Grade", () => {
                expect(pta.adhesionGrade).toBe(test.adhesionGrade);
            });

            it("Adhesion Group Size", () => {
                expect(pta.adhesionGroupSize).toBe(test.adhesionGroupSize);
            });

            it("Second Median Grade", () => {
                expect(pta.secondMedianGrade).toBe(test.secondMedianGrade);
            });

            it("Second Median Group Size", () => {
                expect(pta.secondMedianGroupSize).toBe(test.secondMedianGroupSize);
            });

            it("Second Median Group Sign", () => {
                expect(pta.secondMedianGroupSign).toBe(test.secondMedianGroupSign);
            });
        });
    }
});
