# Majority Judgment for Typescript

[![MIT](https://img.shields.io/github/license/MieuxVoter/majority-judgment-library-typescript?style=for-the-badge)](LICENSE)
[![Release](https://img.shields.io/github/v/release/MieuxVoter/majority-judgment-library-typescript?include_prereleases&style=for-the-badge)](https://github.com/MieuxVoter/majority-judgment-library-typescript/releases)
[![Build Status](https://img.shields.io/github/workflow/status/MieuxVoter/majority-judgment-library-typescript/typescript?style=for-the-badge)](https://github.com/MieuxVoter/majority-judgment-library-typescript/actions/workflows/typescript.yml)
[![Code Quality](https://img.shields.io/codefactor/grade/github/MieuxVoter/majority-judgment-library-typescript?style=for-the-badge)](https://www.codefactor.io/repository/github/mieuxvoter/majority-judgment-library-typescript)
![LoC](https://img.shields.io/tokei/lines/github/MieuxVoter/majority-judgment-library-typescript?style=for-the-badge)
[![Discord Chat](https://img.shields.io/discord/705322981102190593.svg?style=for-the-badge)](https://discord.gg/rAAQG9S)

This typescript package helps to resolve polls using [Majority Judgment](https://fr.wikipedia.org/wiki/Jugement_majoritaire).

## Features

-   Efficient Majority Judgment algorithm, scales well to billions of participants
-   Configure whether to favor _adhesion_ or _contestation_ (default)
-   Balance proposal tallies using a static default grade or the median grade
-   Room for Central Judgment and Usual Judgment
-   Unit-tested (run `npm run converage`)

## Install

`npm install scalable-majority-judgment`

## Get started

### Majority judgment from ballots

```typescript
import {
    TallyCollector,
    MajorityJudgmentDeliberator,
    IDeliberator,
    IResult,
} from "majority-judgment";

const proposalAmount: number = 5;
const mentionAmount: number = 7;
const voterAmount: number = 1000;
const tally: TallyCollector = new TallyCollector(proposalAmount, mentionAmount);
fillTallyCollectorWithRandomVote(tally, voterAmount);

const deliberator: IDeliberator = new MajorityJudgmentDeliberator();
const result: IResult = deliberator.deliberate(tally);

for (let i: number = 0; i < proposalAmount; i++)
    console.log(
        `Proposal at index ${i} obtains the rank ${result.proposalResults[i].rank} with the majority mention at index ${result.proposalResults[i].analysis.medianMentionIndex}`
    );

function fillTallyCollectorWithRandomVote(tally: TallyCollector, voterAmount: number): void {
    const applyRandomVoteForEachProposal = () => {
        let randomProposalIndex: number;
        let randomMentionIndex: number;

        for (let i: number = 0; i < proposalAmount; i++) {
            randomProposalIndex = Math.floor(Math.random() * proposalAmount);
            randomMentionIndex = Math.floor(Math.random() * mentionAmount);
            tally.collect(randomProposalIndex, randomMentionIndex);
        }
    };

    for (let i: number = 0; i < voterAmount; i++) applyRandomVoteForEachProposal();
}
```

### Known datas

```typescript
import {
    MajorityJudgmentDeliberator,
    IDeliberator,
    IResult,
    ITally,
    Tally,
    Proposal,
} from "majority-judgment";

const meritProfileSample: bigint[] = [4n, 0n, 2n, 1n];
// index 0 = worst mention, 4 vote
// max index (3) = best mention, 1 vote

const tally: ITally = new Tally([
    new Proposal(meritProfileSample),
    new Proposal([2n, 1n, 0n, 4n]),
    new Proposal([3n, 2n, 1n, 1n]),
]);

const deliberator: IDeliberator = new MajorityJudgmentDeliberator();
const result: IResult = deliberator.deliberate(tally);
const proposalAmount: number = tally.proposalAmount;

for (let i: number = 0; i < proposalAmount; i++)
    console.log(
        `Proposal at index ${i} obtains the rank ${result.proposalResults[i].rank} with the majority mention at index ${result.proposalResults[i].analysis.medianMentionIndex}`
    );

// Note: the sum vote in proposal must be equal. If not, the deliberator will throw an error.
```

### Majority judgment where voters did not vote for every proposal

```typescript
import { ITally, Proposal, NormalizedTally } from "majority-judgment";

// If the sum vote in proposal are not equal. You can use NormalizedTally.
const tally: ITally = new NormalizedTally([
    new Proposal([4n, 0n, 2n, 10n]),
    new Proposal([20n, 10n, 0n, 4n]),
    new Proposal([3n, 200n, 100n, 1n]),
]);

// (...) Same logic
```

## Contribute

Usual git flow: clone, tinker, request a merge.

## Authors

This package was made by [MieuxVoter](https://mieuxvoter.fr/), a French nonprofit.
