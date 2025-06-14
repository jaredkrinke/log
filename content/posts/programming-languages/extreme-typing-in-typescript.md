---
title: Extreme Typing in TypeScript
description: Here's how to compare poker hands entirely within TypeScript's type system.
date: 2024-06-05
keywords: [100-languages]
---
**TypeScript brought sanity to the JavaScript world**, standardizing how JavaScript APIs are documented. TypeScript's gradual typing system has shown that **a little bit of typing can go a long way** towards increasing productivity.

So if *a little bit* of typing is a good thing, then *more* must be better, right?

Welcome to **Extreme Typing**.

# Extreme Typing
Extreme Typing is about **using the type system available to you *to the fullest extent permitted by law***. In fact, it's about *only* using the type system. For everything.

In the context of TypeScript, this means that you can finally enjoy the modern wonder of TypeScript **without ever having to deal with that crusty, clumsy, old language called JavaScript**. Yes, today in TypeScript, it is possible to do the following *without ever having to touch JavaScript*:

* Perform arithmetic
* Apply logic
* Parse strings

# Extremely typed poker
For my most recent [programming language experiment](100-languages.md), I tackled [Project Euler problem 54](https://projecteuler.net/problem=54) ("Poker Hands"), entirely from the comfort of TypeScript's type system.

The problem encodes 1,000 rounds of Poker and the goal is to determine how many hands the first player wins (following the rules of Poker). Here's a line of sample input:

```
2D 9C AS AH AC 3D 6D 7D TD QD
```

Separating the two hands and moving the cards around, this yields `AS AH AC 9C 2D` vs. `QD TD 7D 6D 3D`, i.e. the first player has 3 aces and the second player has a flush. The second player wins.

**So how can we decode and evaluate 1,000 rounds of Poker using only types?**

## Overview
I settled on the following process:

1. Split text into lines
1. Parse all 10 cards on each line
1. Group cards by rank and suit
1. Determine the (ahem) type (and tie-breakers) of each poker hand
1. Compare the two hands to identify the winner
1. Count the number of first player wins
1. Finally, batch the input to avoid tripping TypeScript's recursion depth limits

Details follow.

## Splitting lines
Apparently, **it is now possible to parse strings within TypeScript's type system**. Given that it's [mentioned in the official docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types), I assume it's supported. Note that I don't fully understand the limitations of this approach. It's certainly not magic.

In my case, I knew ahead of time the set of all possible characters in the input file, so I was able to define a type that is the union of all possible characters:

```typescript
type RanksDescending = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
type Rank = RanksDescending[number];
type Suit = "C" | "D" | "H" | "S";

type NonNewline = Rank | Suit | " ";
type Character = "\n" | NonNewline;
```

Armed with these types, it's possible to **accumulate strings character-by-character, breaking on `\n`** (and using tail calls, as described in the previous link):

```typescript
type SplitLines<Input extends string, Line extends string, Output extends string[]> =
    Input extends ""
        ? [...Output, Line] // Done reading input; add final line
        : Input extends `${infer C extends Character}${infer Rest}`
            ? C extends NonNewline
                ? SplitLines<Rest, `${Line}${C}`, Output> // Not a newline: accumulate into Line
                : SplitLines<Rest, "", [...Output, Line]> // Newline: reset accumulator; add Line to Output
            : never;
```

Each line can then be processed individually.

## Parsing cards
Parsing cards **arguably uses TypeScript features as intended** (to read in two characters):

```typescript
type Card = { rank: Rank, suit: Suit };
...
type ParseCard<S extends string> =
    S extends `${infer CardRank extends Rank}${infer CardSuit extends Suit}`
        ? { rank: CardRank, suit: CardSuit }
        : never;
```

I let the next two steps leak into my "parse lines" code, so ignore `DataFromHand` and `EvaluationFromData` in this code to read 10 cards (5 for each hand):

```typescript
type ProcessLine<L extends string> =
    L extends `${infer A1} ${infer A2} ${infer A3} ${infer A4} ${infer A5} ${infer B1} ${infer B2} ${infer B3} ${infer B4} ${infer B5}`
        ? [
            EvaluationFromData<DataFromHand<[ParseCard<A1>, ParseCard<A2>, ParseCard<A3>, ParseCard<A4>, ParseCard<A5>]>>,
            EvaluationFromData<DataFromHand<[ParseCard<B1>, ParseCard<B2>, ParseCard<B3>, ParseCard<B4>, ParseCard<B5>]>>,
        ]
        : never;
```

With that, parsing is complete: each line is now two hands of five cards.

## Grouping cards
**Grouping cards by rank and suit got a bit hairy**. In fact, I had to rewrite the "is this a flush?" check a few times because certain approaches would silently fail when referenced from other types (it's possible these are bugs in the TypeScript compiler, but opening an "I can't run poker in the type system" bug would likely be a waste of everyone's time).

Regardless, my approach was to **walk an ordered array of ranks and then count cards matching that rank**, removing "empty" (count of zero) ranks at the end. This involved a few utility types for selecting ("keeping") items from an array and counting the number of items in an array (ignore the unary number part--I'll get to that in due time).

Using the examples hands from earlier, the result is something like:

* First player: 3 aces, 1 nine, 1 two
* Second player: 1 queen, 1 ten, 1 seven, 1 six, 1 three

Relevant code:

```typescript
type Equal<A, B> = A extends B ? B extends A ? true : false : false;
...
type ArrayLength<A extends any[]> = UnaryToNumber<A>;
type ArrayKeep<A extends any[], Item> =
    A extends [infer First, ...infer Rest]
        ? First extends Item
            ? [First, ...ArrayKeep<Rest, Item>]
            : ArrayKeep<Rest, Item>
        : [];
...
type Hand = Card[];
type RankCount = { rank: Rank, count: number };
type Data = { counts: RankCount[], flush: boolean };

type CountRank<H extends Hand, R extends Rank> = { rank: R, count: ArrayLength<ArrayKeep<H, CardOfRank<R>>> };
type CountRanksRecursive<H extends Hand, R extends Rank[], Result extends RankCount[]> = R extends [infer First extends Rank, ...infer Rest extends Rank[]] ? CountRanksRecursive<H, Rest, [...Result, CountRank<H, First>]> : Result;
type CountRanks<H extends Hand> = CountRanksRecursive<H, RanksDescending, []>;
type SortedRankCounts<H extends Hand> = ArrayKeep<CountRanks<H>, { count: (1 | 2 | 3 | 4) }>;
```

Why "keep" counts of 1 through 4 instead of removing counts of 0? Because this approach worked and removing zeroes didn't. **I don't know why** (especially since it worked when used directly--just not when referenced transitively).

Next, I also needed to track whether a hand was a flush or not (N.B. checking all five cards' suits for equality also didn't work unless directly referenced--still no idea why):

```typescript
type Or<A, B> = A extends true ? true : B extends true ? true : false;
type Or4<A, B, C, D> = Or<A, Or<B, Or<C, D>>>;
...
type FlushOfSuit<H extends Hand, S extends Suit> = Equal<5, ArrayLength<ArrayKeep<H, { suit: S }>>>;
type Flush<H extends Hand> = Or4<FlushOfSuit<H, "C">, FlushOfSuit<H, "S">, FlushOfSuit<H, "H">, FlushOfSuit<H, "D">>;
```

Final output type for this stage:

```typescript
type DataFromHand<H extends Hand> = { counts: SortedRankCounts<H>, flush: Flush<H> };
```

## Analyzing hands
Armed with the sorted ranks and counts of cards (along with a flag indicating a flush), it was possible to start identifying the "types" (pun intended) of poker hands.

Here are a few simple examples that just see how many ranks have a count of N:

```typescript
type And<A, B> = A extends true ? B extends true ? true : false : false;
...
type RankCountOfCount<C> = { count: C };

type IsFourOfAKind<D extends Data> = Equal<1, ArrayLength<ArrayKeep<RankCountsFromData<D>, RankCountOfCount<4>>>>;
type IsTwoPair<D extends Data> = Equal<2, ArrayLength<ArrayKeep<RankCountsFromData<D>, RankCountOfCount<2>>>>;

type HasThreeOfAKind<D extends Data> = Equal<1, ArrayLength<ArrayKeep<RankCountsFromData<D>, RankCountOfCount<3>>>>;
type HasOnePair<D extends Data> = Equal<1, ArrayLength<ArrayKeep<RankCountsFromData<D>, RankCountOfCount<2>>>>;

type IsFullHouse<D extends Data> = And<HasThreeOfAKind<D>, HasOnePair<D>>;
```

Identifying straights seemed tricky, so I just hard-coded them all:

```typescript
type IsStraight<D extends Data> =
    D extends { counts: infer DataCounts }
        ? DataCounts extends [{ rank: "A" }, { rank: "5" }, { rank: "4" }, { rank: "3" }, { rank: "2" }] ? true
        : DataCounts extends [{ rank: "6" }, { rank: "5" }, { rank: "4" }, { rank: "3" }, { rank: "2" }] ? true
        : DataCounts extends [{ rank: "7" }, { rank: "6" }, { rank: "5" }, { rank: "4" }, { rank: "3" }] ? true
        : DataCounts extends [{ rank: "8" }, { rank: "7" }, { rank: "6" }, { rank: "5" }, { rank: "4" }] ? true
        : DataCounts extends [{ rank: "9" }, { rank: "8" }, { rank: "7" }, { rank: "6" }, { rank: "5" }] ? true
        : DataCounts extends [{ rank: "T" }, { rank: "9" }, { rank: "8" }, { rank: "7" }, { rank: "6" }] ? true
        : DataCounts extends [{ rank: "J" }, { rank: "T" }, { rank: "9" }, { rank: "8" }, { rank: "7" }] ? true
        : DataCounts extends [{ rank: "Q" }, { rank: "J" }, { rank: "T" }, { rank: "9" }, { rank: "8" }] ? true
        : DataCounts extends [{ rank: "K" }, { rank: "Q" }, { rank: "J" }, { rank: "T" }, { rank: "9" }] ? true
        : DataCounts extends [{ rank: "A" }, { rank: "K" }, { rank: "Q" }, { rank: "J" }, { rank: "T" }] ? true
        : false
    : false;
```

But I also needed to supply tie-breakers, so here are some utilities for retrieving the (previously sorted) rank(s) of cardinality N:

```typescript
type RankForNOfAKind<D extends Data, N extends number> = ArrayKeep<RankCountsFromData<D>, RankCountOfCount<N>> extends [{ rank: infer R extends Rank }] ? R : never;
type RanksForNsOfAKind<D extends Data, N extends number> = RanksFromRankCounts<ArrayKeep<RankCountsFromData<D>, RankCountOfCount<N>>>;
```

And I needed to handle the fact that aces can be low *or* high in a straight:

```typescript
type If<C, T, F> = C extends true ? T : F;
...
type RankForStraight<D extends Data> =
    D extends { counts: [{ rank: infer FirstRank extends Rank }, { rank: infer SecondRank }, ...infer Rest] }
        // Note the special case for straights that *begin* with an ace
        ? If<And<Equal<FirstRank, "A">, Equal<SecondRank, "5">>, "5", FirstRank>
        : never;
```

Finally, here's the closest to a lookup table I was able to create:

```typescript
type EvaluationFromData<D extends Data> =
    If<IsStraightFlush<D>,  { handType: "straightFlush",    tieBreakers: [RankForStraight<D>] },
    If<IsFourOfAKind<D>,    { handType: "fourOfAKind",      tieBreakers: [RankForNOfAKind<D, 4>] },
    If<IsFullHouse<D>,      { handType: "fullHouse",        tieBreakers: [RankForNOfAKind<D, 3>, RankForNOfAKind<D, 2>] },
    If<IsFlush<D>,          { handType: "flush",            tieBreakers: RanksForNsOfAKind<D, 1> },
    If<IsStraight<D>,       { handType: "straight",         tieBreakers: [RankForStraight<D>] },
    If<HasThreeOfAKind<D>,  { handType: "threeOfAKind",     tieBreakers: [RankForNOfAKind<D, 3>] },
    If<IsTwoPair<D>,        { handType: "twoPair",          tieBreakers: [...RanksForNsOfAKind<D, 2>, RankForNOfAKind<D, 1>] },
    If<HasOnePair<D>,       { handType: "pair",             tieBreakers: [RankForNOfAKind<D, 2>, ...RanksForNsOfAKind<D, 1>] },
    /* High card */         { handType: "highCard",         tieBreakers: RanksForNsOfAKind<D, 1> }>>>>>>>>;
```

The output of this stage is the "type" of the hand (two pair, flush, high card, etc.) and any tie-breakers that might be needed.

## Comparing hands
Similar to sorting ranks, both ranks and poker hand "types" are compared relatively by walking the ordered array until a "winner" is found. **Despite sounding very simple, it took an entire page of code**:

```typescript
type GreaterRankRecursive<A extends Rank, B extends Rank, R extends Rank[]> =
    R extends [infer First, ...infer Rest extends Rank[]]
        ? A extends First
            ? B extends First
                ? false     // A = B
                : true      // A > B
            : B extends First
                ? false     // A < B
                : GreaterRankRecursive<A, B, Rest> // Neither A nor B match; try next lower rank
        : false; // Probably should have used `never` here

type GreaterRank<A extends Rank, B extends Rank> = GreaterRankRecursive<A, B, RanksDescending>;
type GreaterRanks<A extends Rank[], B extends Rank[]> =
    A extends [infer ARank extends Rank, ...infer ARest extends Rank[]]
        ? B extends [infer BRank extends Rank, ...infer BRest extends Rank[]]
            ? If<GreaterRank<ARank, BRank>,
                true,       // A > B
                If<GreaterRank<BRank, ARank>,
                    false,  // A < B
                    GreaterRanks<ARest, BRest>>> // A = B
            : never
        : false; // No more tie-breakers; treat as "not a win for A"

// Basically the same as GreaterRankRecursive
type BetterHandType<A extends HandType, B extends HandType, H extends HandType[]> =
    H extends [infer First, ...infer Rest extends HandType[]]
        ? A extends First
            ? B extends First
                ? false
                : true
            : B extends First
                ? false
                : BetterHandType<A, B, Rest>
        : false;

type BetterEvaluation<A extends Evaluation, B extends Evaluation> =
    A extends { handType: infer AH extends HandType, tieBreakers: infer AT extends Rank[] }
        ? B extends { handType: infer BH extends HandType, tieBreakers: infer BT extends Rank[] }
            ? If<BetterHandType<AH, BH, HandTypesDescending>,
                true,       // A has the better hand type
                If<BetterHandType<BH, AH, HandTypesDescending>,
                    false,  // B has the better hand type
                    GreaterRanks<AT, BT>>> // Same hand types; compare tie-breakers
            : never
        : never;
```

## Counting wins
Counting involves numbers, and **I didn't see an obvious way to perform arithmetic in TypeScript's type system**. So I had to ([once again](100-languages-2.md)) implement my own arithmetic. Fortunately, I was able to simply use a unary encoding based on array length (this works for values up to ~500):

```typescript
type UnaryZero = [];
type UnaryNumber = any[];
type UnaryToNumber<T extends UnaryNumber> = T extends { length: infer L extends number } ? L : never;

type UnaryIncrement<T extends UnaryNumber> = [...T, any];
type UnaryOne = UnaryIncrement<UnaryZero>;
```

I tracked wins in an array of (unary) zeroes (losses) or ones (wins):

```typescript
type ScoreRound<A extends Evaluation[]> =
    A extends [infer First extends Evaluation, infer Second extends Evaluation]
        ? If<BetterEvaluation<First, Second>,
            UnaryOne,
            UnaryZero>
        : never;

type ScoreRoundsRecursive<A extends Evaluation[][], S extends UnaryNumber[]> =
    A extends [infer Line extends Evaluation[], ...infer Rest extends Evaluation[][]]
        ? ScoreRoundsRecursive<Rest, [...S, ScoreRound<Line>]>
        : S;

type ScoreRounds<A extends Evaluation[][]> = ScoreRoundsRecursive<A, []>;
```

## Batching
Sadly, I wasn't able to solve the entire problem in one go because **TypeScript (even with tail call elimination) has limits on recursion depth**. My solution was to process batches of 25 lines at a time (40 batches in total), and then simply sum the sub-scores from each batch.

N.B. I used JavaScript to split the input file into batches. Sorry! I am a fraud.

```typescript
type UnarySumRecursive<A extends UnaryNumber[], S extends UnaryNumber> =
    A extends [infer T extends UnaryNumber, ...infer Rest extends UnaryNumber[]]
        ? UnarySumRecursive<Rest, [...T, ...S]>
        : S;

type UnarySum<A extends UnaryNumber[]> = UnarySumRecursive<A, UnaryZero>;
...
type ScoreBlock<S extends string> = UnarySum<ScoreRounds<ProcessLines<SplitLines<S, "", []>>>>;

type t1 = ScoreBlock<"8C TS KC 9H 4S 7D 2S 5D 3S AC\n5C AD 5D AC 9C 7C 5H 8D TD KS\n ...">;
type t2 = ScoreBlock<"5H 6H 2S KS 3D 5D JD 7H JS 8H\nKH 4H AS JS QS QC TC 6D 7C KS\n ...">;
...
type CorrectAnswer = UnaryToNumber<UnarySum<[t1, t2, ..., t40]>>;
```

In the end, I just needed to hover over the `CorrectAnswer` type in my editor and (eventually), it showed me the correct answer.

## On the command line
It's also possible to have `tsc` emit the answer by forcing a type-checking error by supplying a known-incorrect value:

```typescript
const guess: CorrectAnswer = 42; // Definitely not correct!
```

Running `tsc` produces the following output (**spoiler alert!**):

```
error TS2322: Type '42' is not assignable to type '376'.
```

# Conclusion
**Extreme Typing: it's a thing!**

Resources:

* [Source code for my solution](https://github.com/jaredkrinke/100-languages/blob/main/src/p54.ts)
* [Extreme Explorations of TypeScript's Type System](https://www.learningtypescript.com/articles/extreme-explorations-of-typescripts-type-system)
* [Type Level Arithmetic](https://github.com/arielhs/ts-arithmetic)
