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
-   Unit-tested (run `typescript test`)

## Get started

```typescript

import { MajorityJudgmentDeliberator, IDeliberator, ITally, Tally, ProposalTally, IResult } from "majority-judgment";

const deliberator:IDeliberator = new MajorityJudgmentDeliberator();
const tally:ITally = new Tally([
        // Amounts of judgments received for each grade, from "worst" grade to "best" grade
        new ProposalTally([4n, 5n, 2n, 1n, 3n, 1n, 2n]),  // Proposal A
        new ProposalTally([3n, 6n, 2n, 1n, 3n, 1n, 2n]),  // Proposal B
        // …
}, 18);

const result:IResult = deliberator.deliberate(tally);

// Each proposal result has a rank, and results are returned by input order
console.assert(2 == result.proposalResults.length);
console.assert(2 == result.proposalResults[0].rank);  // Proposal A
console.assert(1 == result.proposalResults[1].rank);  // Proposal B
```

## Contribute

Usual git flow: clone, tinker, request a merge.

## Authors

This package was made by [MieuxVoter](https://mieuxvoter.fr/), a french nonprofit.
