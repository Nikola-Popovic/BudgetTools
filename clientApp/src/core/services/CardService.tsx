import React, { createContext, FC } from 'react';
import { ServiceProps } from '../../shared/services/Types';
import { Card } from '../models/Card';

export interface ICardService {
    getCards(): Promise<Card[]>;
    addCard(card: Card): Promise<void>;
}
export const CardServiceContext = createContext<ICardService | undefined>(undefined);

class CardServiceImpl implements ICardService {
  private _cards: Card[] = [];
  private _nextId = 1;

  async getCards(): Promise<Card[]> {
    console.log(`getCards {${this._cards.length}}`);
    return this._cards;
  }

  async addCard(card: Card): Promise<void> {
    console.log(`addCard ${this._nextId}`);
    card.id = this._nextId++;
    this._cards.push(card);
  }
}

const CardService: React.FC<ServiceProps> = ({children} : ServiceProps) => {  
  const impl = new CardServiceImpl();
  return <CardServiceContext.Provider value={impl}>
    {children}
  </CardServiceContext.Provider>;
};

export default CardService;

export const useCardService = () => {
  const context = React.useContext<ICardService | undefined>(CardServiceContext);
  if (context === undefined) {
    throw new Error('useCardService must be used within a CardServiceContext');
  }
  return context;
};