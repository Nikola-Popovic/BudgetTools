import React, { createContext, FC } from 'react';
import { ServiceProps } from '../../shared/services/Types';
import { Payer, Receipt } from '../models/ReceiptTracker/Payer';

export interface IReceiptService {
  getPayers(): Promise<Map<number, Payer>>;
  getPayer(id: number): Promise<Payer | undefined>;
  addPayer(card: Payer): Promise<void>;
  changePlayerName(id: number, name: string): Promise<void>
  getReceipt(receiptId: number): Promise<Receipt | undefined>;
  addReceipt(payerId: number): Promise<void>;
  removeReceipt(payerId: number, receiptId: number): Promise<void>;
  updateReceiptTotal(payerId: number, receiptId: number, total: number): Promise<void>;
}
export const ReceiptServiceContext = createContext<IReceiptService | undefined>(undefined);

class ReceiptServiceImpl implements IReceiptService {
  private _players: Map<number, Payer> = new Map<number, Payer>;
  private _nextPlayerId = 0;
  private _nextReceiptId = 0;

  async getPayers(): Promise<Map<number, Payer>> {
    return this._players;
  }

  async getPayer(id: number): Promise<Payer | undefined> {
    return this._players.get(id);
  }

  async addPayer(payer: Payer): Promise<void> {
    payer.id = this._nextPlayerId++;
    this._players.set(payer.id, payer);
  }

  async changePlayerName(id: number, name: string): Promise<void> {
    const player = await this.getPayer(id);
    if (player !== undefined) {
      player.name = name;
    }
  }

  async addReceipt(payerId: number): Promise<void> {
    const player = await this.getPayer(payerId);
    if (player !== undefined) {
      player.receipts.push({ id: this._nextReceiptId, total: 0, items: [], name: `Receipt ${this._nextReceiptId}` });
      this._nextReceiptId++;
    }
  }

  async getReceipt(receiptId: number): Promise<Receipt | undefined> {
    let receipt: Receipt | undefined = undefined;
    this._players.forEach(player => {
      const found = player.receipts.find(r => r.id === receiptId);
      if (found !== undefined) {
        receipt = found;
      }
    });
    return receipt;
  }

  async updateReceiptTotal(payerId: number, receiptId: number, total: number): Promise<void> {
    const player = await this.getPayer(payerId);
    if (player !== undefined) {
      const receipt = player.receipts.find(r => r.id === receiptId);
      if (receipt !== undefined) {
        receipt.total = total;
      }
    }
  }

  async removeReceipt(payerId: number, receiptId: number): Promise<void> {
    const player = await this.getPayer(payerId);
    if (player !== undefined) {
      const receiptIndex = player.receipts.findIndex(r => r.id === receiptId);
      if (receiptIndex >= 0) {
        player.receipts.splice(receiptIndex, 1);
      }
    }
  }
}

const ReceiptService: React.FC<ServiceProps> = ({children} : ServiceProps) => {  
  const impl = new ReceiptServiceImpl();
  return <ReceiptServiceContext.Provider value={impl}>
    {children}
  </ReceiptServiceContext.Provider>;
};

export default ReceiptService;

export const useReceiptService = () => {
  const context = React.useContext<IReceiptService | undefined>(ReceiptServiceContext);
  if (context === undefined) {
    throw new Error('useCardService must be used within a CardServiceContext');
  }
  return context;
};