import { KeggyProps } from "../constants/quotes";

export interface QuoteState {
  randomisedQuotes: KeggyProps[];
  displayedQuotes: Set<number>;
  currentIndex: number;
}

export const randomiseQuotes = (quotes: KeggyProps[]): KeggyProps[] => {
  return [...quotes].sort(() => Math.random() - 0.5);
};

export const getNextQuotes = (
  allQuotes: KeggyProps[],
  displayedQuotes: Set<number>,
  setRandomisedQuotes: (quotes: KeggyProps[]) => void,
  setDisplayedQuotes: (quotes: Set<number>) => void
): KeggyProps[] => {
  const unseenQuotes = allQuotes.filter(
    (quote) => !displayedQuotes.has(quote.id)
  );

  if (unseenQuotes.length === 0) {
    // All quotes have been shown, reset and shuffle again
    const shuffled = randomiseQuotes(allQuotes);
    setDisplayedQuotes(new Set());
    setRandomisedQuotes(shuffled);
    return shuffled;
  }

  // Shuffle unseen quotes and add some already seen quotes to fill the list
  const shuffledUnseen = randomiseQuotes(unseenQuotes);
  const seenQuotes = allQuotes.filter((quote) => displayedQuotes.has(quote.id));
  const shuffledSeen = randomiseQuotes(seenQuotes);

  // Combine unseen quotes first, then some seen quotes
  const combined = [
    ...shuffledUnseen,
    ...shuffledSeen.slice(0, Math.min(10, shuffledSeen.length)),
  ];
  setRandomisedQuotes(combined);
  return combined;
};

export const handleQuoteScroll = (
  event: any,
  width: number,
  currentIndex: number,
  randomisedQuotes: KeggyProps[],
  setCurrentIndex: (index: number) => void,
  setDisplayedQuotes: (fn: (prev: Set<number>) => Set<number>) => void,
  getNextQuotes: () => void
) => {
  const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
  if (newIndex !== currentIndex) {
    setCurrentIndex(newIndex);

    // Mark the current quote as displayed
    if (randomisedQuotes[newIndex]) {
      setDisplayedQuotes(
        (prev) => new Set([...prev, randomisedQuotes[newIndex].id])
      );
    }

    // Check if we need to load more quotes
    if (newIndex >= randomisedQuotes.length - 3) {
      getNextQuotes();
    }
  }
};
