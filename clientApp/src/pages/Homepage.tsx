import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from '../shared/lang/i18next';
import Button from '@mui/material/Button';
import CurrencyNumberFormat from '../shared/components/CurrencyNumberFormat';
import { contentL, contentXL, contentXXL, spacingL, spacingM, spacingS } from '../shared/styling/StylingConstants';
import styled from 'styled-components';
import { TextField } from '@mui/material';

const AlignEndContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const AlignEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${spacingM};
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const PlayerColumn = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: ${spacingM};
  width: ${contentXL};
  height: ${contentXXL};
  padding: ${spacingL};
  margin: ${spacingM};
  border: 1px solid;
`;

const Receipt = styled.div`
  margin: ${spacingS};
`;

const ReceiptColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${spacingM};
  margin: ${spacingM};
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: ${spacingM};
  border: 2px dashed;
`;

interface Player {
  name: string;
  receipts: number[];
}

export function Homepage() {
  const { t } = useTranslation('translation', { i18n: i18next });
  const [total, setTotal] = useState(0);
  const [nextId, setNextId] = useState(0);
  const [receipts, setReceipts] = useState(new Map<number, Player>);

  const _addColumn = () => {
    const receiptCopy = new Map(receipts);
    const newPlayer = { name: `Player ${nextId}`, receipts: [] };
    receiptCopy.set(nextId, newPlayer);
    setReceipts(receiptCopy);
    setNextId(nextId + 1);
  };

  const _addReceipt = (key: number) => {
    const receiptCopy = new Map(receipts);
    const player = receiptCopy.get(key);
    if (player !== undefined) {
      player.receipts.push(0);
      receiptCopy.set(key, player);
      setReceipts(receiptCopy);
    }
  };

  const handleNameChange = (key: number, name : string) => {
    const receiptCopy = new Map(receipts);
    const player = receiptCopy.get(key);
    if (player !== undefined) {
      player.name = name;
      receiptCopy.set(key, player);
      setReceipts(receiptCopy);
    }
  };

  const handleReceiptChange = (key: number, receiptIndex: number, receipt: number) => {
    const receiptCopy = new Map(receipts);
    const player = receiptCopy.get(key);
    if (player !== undefined) {
      player.receipts[receiptIndex] = receipt;
      receiptCopy.set(key, player);
      setReceipts(receiptCopy);
      recalculateTotal();
    }
  };

  const recalculateTotal = () => {
    const newTotal = Array.from(receipts)
      .map(([key, player]) => player.receipts.reduce((acc, curr) => acc + curr, 0))
      .reduce((acc, curr) => acc + curr, 0);
    setTotal(newTotal);
  };

  return <>
    <CenterContainer>
      <span> Total : {total} </span>
    </CenterContainer>
    <AlignEndContainer>
      <Button variant="contained" color="secondary" onClick={() => _addColumn()}> 
        {t('receipt.addPerson')}
      </Button>
    </AlignEndContainer>
    <PlayersContainer>
      {Array.from(receipts).map(([key, value]) => 
        <PlayerColumn key={key}>
          <TextField
            id={`playerName${key}`}
            key={key}
            label={t('receipt.playerName')}
            variant="outlined"
            value={value.name}
            onChange={(e) => handleNameChange(key, e.target.value)}
          />
          { value.receipts.length > 0 && 
            <ReceiptColumn>
              {value.receipts.map((receipt, index) => 
                <Receipt key={index}>
                  <TextField 
                    id={`receipt${key}-${index}`}
                    key={index}
                    label={t('receipt.receiptNumber') + index}
                    variant="outlined"
                    value={receipt}
                    InputProps={{ inputComponent: CurrencyNumberFormat as any }}
                    onChange={(e) => handleReceiptChange(key, index, parseFloat(e.target.value))}
                  />
                </Receipt>
              )}
              <span> Total : {value.receipts.reduce( (acc, val) => acc + val)}</span>
            </ReceiptColumn>
          }
          <AlignEnd>
            <Button variant="contained" color="secondary" onClick={() => _addReceipt(key)}>
              <span>{t('receipt.addReceipt')}</span>
            </Button>
          </AlignEnd>
        </PlayerColumn>
      )}
    </PlayersContainer>
  </>;
}
