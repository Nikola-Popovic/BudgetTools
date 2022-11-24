import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from '../shared/lang/i18next';
import Button from '@mui/material/Button';
import CurrencyNumberFormat from '../shared/components/CurrencyNumberFormat';
import { contentL, contentS, contentXL, contentXs, contentXXL, spacingL, spacingM, spacingS } from '../shared/styling/StylingConstants';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import CurrencyFormat from '../shared/components/CurrencyFormat';

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

const PlayerTotals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${spacingM};
  > * {
    width: 100%;
  }
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
  amountDue: number;
  receipts: number[];
}

export function ReceiptTracker() {
  const { t } = useTranslation('translation', { i18n: i18next });
  const [total, setTotal] = useState(0);
  const [nextId, setNextId] = useState(0);
  const [players, setPlayers] = useState(new Map<number, Player>);
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });
  
  useEffect(() => {
    const playersCopy = new Map(players);
    Array.from(playersCopy).forEach(([key, player]) => {
      player.amountDue = getAmountDue(key);
    });
    setPlayers(playersCopy);
  }, [total, nextId]);

  const _addColumn = () => {
    const playersCopy = new Map(players);
    const newPlayer = { name: `Payer ${nextId}`, receipts: [], amountDue: 0 };
    playersCopy.set(nextId, newPlayer);
    setPlayers(playersCopy);
    setNextId(nextId + 1);
  };

  const _addReceipt = (key: number) => {
    const playersCopy = new Map(players);
    const player = playersCopy.get(key);
    if (player !== undefined) {
      player.receipts.push(0);
      playersCopy.set(key, player);
      setPlayers(playersCopy);
    }
  };

  const handleNameChange = (key: number, name : string) => {
    const playersCopy = new Map(players);
    const player = playersCopy.get(key);
    if (player !== undefined) {
      player.name = name;
      playersCopy.set(key, player);
      setPlayers(playersCopy);
    }
  };

  const handleReceiptChange = (key: number, receiptIndex: number, receipt: number) => {
    const playersCopy = new Map(players);
    const player = playersCopy.get(key);
    if (player !== undefined) {
      player.receipts[receiptIndex] = receipt;
      playersCopy.set(key, player);
      setPlayers(playersCopy);
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
    <PlayersContainer>
      {Array.from(players).map(([key, value]) => 
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
            </ReceiptColumn>
          }
          <AlignEnd>
            <Button variant="contained" color="secondary" onClick={() => _addReceipt(key)}>
              <span>{t('receipt.addReceipt')}</span>
            </Button>
          </AlignEnd>
          <PlayerTotals>
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
          </PlayerTotals>
        </PlayerColumn>
      )}
    </PlayersContainer>
  </>;
}
