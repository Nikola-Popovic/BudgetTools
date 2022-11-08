export interface Card { 
    id?: number;
    deckId?: number;
    front: string;
    back: string;
}

export enum DeckType {
    FlashCard = 1,
    Language = 2
}

export interface Deck {
    id: number;
    name: string;
}