import React, { createContext, FC } from 'react';
import { ServiceProps } from '../../shared/services/Types';
import { Payer } from '../models/ReceiptTracker/Payer';

export interface IReceiptService {
  getPlayers(): Promise<Payer[]>;
  addPlayer(card: Payer): Promise<void>;
}
export const ReceiptServiceContext = createContext<IReceiptService | undefined>(undefined);

class ReceiptServiceImpl implements IReceiptService {
  private _players: Payer[] = [];
  private _nextId = 1;

  async getPlayers(): Promise<Payer[]> {
    console.log(`getCards {${this._players.length}}`);
    return this._players;
  }

  async addPlayer(card: Payer): Promise<void> {
    console.log(`addCard ${this._nextId}`);
    card.id = this._nextId++;
    this._players.push(card);
  }
}

const ReceiptService: React.FC<ServiceProps> = ({children} : ServiceProps) => {  
  const impl = new ReceiptServiceImpl();
  return <ReceiptServiceContext.Provider value={impl}>
    {children}
  </ReceiptServiceContext.Provider>;
};

export default ReceiptServiceContext;

export const useReceiptService = () => {
  const context = React.useContext<IReceiptService | undefined>(ReceiptServiceContext);
  if (context === undefined) {
    throw new Error('useCardService must be used within a CardServiceContext');
  }
  return context;
};