import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from '../shared/lang/i18next';
import Button from '@mui/material/Button';
import CurrencyNumberFormat from '../shared/components/CurrencyNumberFormat';
import { contentXL, contentXs, contentXXL, spacingL, spacingM, spacingS } from '../shared/styling/StylingConstants';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import { Clear, Edit } from '@mui/icons-material';
import CurrencyFormat from '../shared/components/CurrencyFormat';
import { Payer } from '../core/models/ReceiptTracker/Payer';

const Amount = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: monospace;
  font-size: ${spacingM}
`;

const AmountDue = styled(Amount)<{amount: number}>`
  color: ${props => props.amount >= 0 ? 'green' : 'red'};
`;

const TotalContainer = styled(Amount)`
  align-self: center;
  font-size: ${contentXs};
`;

const AlignEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: ${spacingS};
`;

const PayerTotals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${spacingM};
  > * {
    width: 100%;
  }
`;

const PayersContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const PayerColumn = styled.div`
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
  display: flex;
  flex-direction: row;
  margin: ${spacingS};
`;

const ReceiptActions = styled.div`
  display: flex;
  flex-direction: column;
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

export function ReceiptTracker() {
  const { t } = useTranslation('translation', { i18n: i18next });
  const [total, setTotal] = useState(0);
  const [nextId, setNextId] = useState(0);
  const [players, setPayers] = useState(new Map<number, Payer>);
  
  useEffect(() => {
    const playersCopy = new Map(players);
    Array.from(playersCopy).forEach(([key, player]) => {
      player.amountDue = getAmountDue(key);
    });
    setPayers(playersCopy);
  }, [total, nextId]);

  const _addColumn = () => {
    const playersCopy = new Map(players);
    const newPayer = { name: `Payer ${nextId}`, receipts: [], amountDue: 0, id: nextId };
    playersCopy.set(nextId, newPayer);
    setPayers(playersCopy);
    setNextId(nextId + 1);
  };

  const _addReceipt = (key: number) => {
    const playersCopy = new Map(players);
    const player = playersCopy.get(key);
    if (player !== undefined) {
      player.receipts.push(0);
      playersCopy.set(key, player);
      setPayers(playersCopy);
    }
  };

  const _removeReceipt = (key: number, index: number) => {
    const playersCopy = new Map(players);
    const player = playersCopy.get(key);
    if (player !== undefined) {
      player.receipts.splice(index, 1);
      playersCopy.set(key, player);
      setPayers(playersCopy);
      recalculateTotal();
    }
  };

  const handleNameChange = (key: number, name : string) => {
    const playersCopy = new Map(players);
    const player = playersCopy.get(key);
    if (player !== undefined) {
      player.name = name;
      playersCopy.set(key, player);
      setPayers(playersCopy);
    }
  };

  const handleReceiptChange = (key: number, receiptIndex: number, receipt: number) => {
    const playersCopy = new Map(players);
    const player = playersCopy.get(key);
    if (player !== undefined) {
      player.receipts[receiptIndex] = receipt;
      playersCopy.set(key, player);
      setPayers(playersCopy);
      recalculateTotal();
    }
  };

  const getAmountDue = (key: number) : number => {
    const player = players.get(key);
    if (player === undefined) {
      return -1;
    }
    const totalPaid = player.receipts.reduce((a, b) => a + b, 0);
    const totalForEach = total / players.size;
    return totalPaid - totalForEach;
  };

  const recalculateTotal = () : void => {
    const newTotal = Array.from(players)
      .map(([key, player]) => player.receipts.reduce((acc, curr) => acc + curr, 0))
      .reduce((acc, curr) => acc + curr, 0);
    setTotal(newTotal);
  };

  return <>
    <TotalContainer>
      <span> Total :</span>
      <CurrencyFormat value={total}/> 
    </TotalContainer>
    <AlignEnd>
      <Button variant="contained" color="secondary" onClick={() => _addColumn()}> 
        {t('receipt.addPerson')}
      </Button>
    </AlignEnd>
    <PayersContainer>
      {Array.from(players).map(([key, value]) => 
        <PayerColumn key={key}>
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
                  <ReceiptActions>
                    <Edit />
                    <Clear onClick={() => _removeReceipt(key, index)}/>
                  </ReceiptActions>
                </Receipt>
              )}
            </ReceiptColumn>
          }
          <AlignEnd>
            <Button variant="contained" color="secondary" onClick={() => _addReceipt(key)}>
              <span>{t('receipt.addReceipt')}</span>
            </Button>
          </AlignEnd>
          <PayerTotals>
            <Amount>
              {t('receipt.contributedAmount')}: 
              <AlignEnd>
                <CurrencyFormat value={value.receipts.length > 0 ? 
                  value.receipts.reduce((acc, val) => acc + val) : 0} />
              </AlignEnd>
            </Amount>
            -
            <Amount style={{color: 'red'}}>{t('receipt.contributionAmount')}: 
              <AlignEnd> <CurrencyFormat value={total / players.size} /> </AlignEnd> 
            </Amount>
            --------------------------------
            <AmountDue amount={value.amountDue}> 
              {t('receipt.amountDue')}:
              <AlignEnd>
                {value.amountDue > 0 && '+'}
                <CurrencyFormat value={value.amountDue}/>
              </AlignEnd>
            </AmountDue>
          </PayerTotals>
        </PayerColumn>
      )}
    </PayersContainer>
  </>;
}
