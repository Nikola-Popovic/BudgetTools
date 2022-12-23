import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Receipt, ReceiptItem } from '../../core/models/ReceiptTracker/Payer';
import { useReceiptService } from '../../core/services/ReceiptService';
import i18next from '../../shared/lang/i18next';
import { contentM, contentXL, contentXXL, spacingM, spacingXs } from '../../shared/styling/StylingConstants';
import Button from '@mui/material/Button';
import { CurrencyFormat } from '../../shared/components/CurrencyFormat';
import CurrencyNumberFormat from '../../shared/components/CurrencyNumberFormat';
import { TextField } from '@mui/material';

const UpdateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ReceiptContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(${contentXL} + 2*${spacingM});
    padding: ${spacingM};
    margin: ${spacingM};
    font-family: monospace;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px;
`;

const BottomActionsContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: ${contentXXL};
    flex-direction: row;
    padding: ${spacingM};
    justify-content: space-between;
`;

const ReceiptTitle = styled.div`
    font-size: 1.5em;
    font-family: inherit;
`;

const ReceiptSubContainer = styled.div`
    width: 100%;
    padding: 0 ${spacingM} 0;
    margin: ${spacingXs};
    max-width: ${contentXL};
    display: flex;
    justify-content: space-between;
`;

const LineDivider = styled(ReceiptSubContainer)`
    height: 1px;
    padding-bottom: ${spacingM};
    border-bottom: 1px dashed black;
`;

const ReceiptBodyTotal = styled(ReceiptSubContainer)`
  font-weight: bold;
  font-size: 1.3em;
`;

const ReceiptBodyItem = styled(ReceiptSubContainer)`
`;

const tps = 0.05;
const tvq = 0.09975;
const calculateTotalWithTaxes = (total: number) => {
  return total*(1+tps)+total*tvq;
};

export function ModifyReceiptPage() {
  const { t } = useTranslation('translation', { i18n: i18next });
  const receiptService = useReceiptService();
  const params = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt>({ id: 0, payerId: 0, name: 'Receipt', total: 0, items: []});
  const [subTotal, setSubTotal] =useState(0);

  useEffect(() => {
    const getReceipt = async () => {
      const data = await receiptService.getReceipt(parseInt(params?.id ?? '-1'));
      if (data === undefined) {
        return;
      }
      setSubTotal(data.items.reduce((total, item) => total + item.price, 0));
      setReceipt(data);
    };
    getReceipt();
  }, []);

  
  useEffect(() => {
    const sub = receipt.items.reduce((total, item) => isNaN(item.price)? total : total + item.price, 0);
    setSubTotal(sub);
    const total = calculateTotalWithTaxes(sub);
    setReceipt({ ...receipt, total: total});
  }, [receipt.items]);

  const _cancelUpdate = () => {
    navigate(-1);
  };

  const _completeUpdate = () => {
    receiptService.updateReceipt(receipt);
    navigate(-1);
  };

  const _addReceiptItem = () => {
    const itemsCopy = Array.from(receipt.items);
    itemsCopy.push({
      id: `${receipt.id}__${receipt.items.length++}`,
      name: `Item #${receipt.items.length++}`,
      price: 0
    });
    setReceipt({ ...receipt, items: itemsCopy});
  };

  const changeReceiptName = (name: string) => {
    const newReceipt : Receipt = { ...receipt, name: name};
    setReceipt(newReceipt);
  };

  const changeReceiptItem = (id: string, itemCost: number) => {
    const items = Array.from(receipt.items);
    items.find(item => item.id === id)!.price = itemCost;
    const newReceipt : Receipt = { ...receipt, items: items};
    setReceipt(newReceipt);
  };

  const changeReceiptItemName = (id: string, name: string) => {
    const items = Array.from(receipt.items);
    items.find(item => item.id === id)!.name = name;
    const newReceipt : Receipt = { ...receipt, items: items};
    setReceipt(newReceipt);
  };

  return <React.Suspense fallback="loading...">
    <UpdateContainer>
      <ReceiptContainer>
        <ReceiptTitle>
          <TextField
            id={`${receipt.id}-name`}
            key={`${receipt.id}-name`}
            variant='outlined'
            value={receipt.name}
            onChange={(e) => changeReceiptName(e.target.value)}
          />
        </ReceiptTitle>
        <LineDivider />
        { receipt.items.map(item => 
          <ReceiptBodyItem key={item.id}>
            <TextField
              id={`${item.id}-name`}
              key={`${item.id}-name`}
              style={{width: '100px'}}
              value={item.name}
              onChange={(e) => changeReceiptItemName(item.id, e.target.value)}
            />
            <TextField 
              id={item.id}
              key={item.id}
              value={item.price}
              InputProps={{ inputComponent: CurrencyNumberFormat as any }}
              onChange={(e) => changeReceiptItem(item.id, parseFloat(e.target.value))}
            />
          </ReceiptBodyItem>
        )}
        <BottomActionsContainer>
          <div></div>
          <Button variant="contained" color="secondary" onClick={() => _addReceiptItem()}> 
            {t('receipt.addReceiptItem')}
          </Button>
        </BottomActionsContainer>
        <LineDivider />
        <ReceiptBodyItem>
          <div> Subtotal : </div>
          <CurrencyFormat value={subTotal} />
        </ReceiptBodyItem>
        <ReceiptBodyItem>
          <div> TPS(5%) : </div>
          <CurrencyFormat value={subTotal*tps} />
        </ReceiptBodyItem>
        <ReceiptBodyItem>
          <div> TVQ(9.75%) : </div>
          <CurrencyFormat value={subTotal*tvq} />
        </ReceiptBodyItem>
        <ReceiptBodyTotal>
          <div> Total : </div>
          <CurrencyFormat value={receipt.total} />
        </ReceiptBodyTotal>
      </ReceiptContainer>
      <BottomActionsContainer>
        <Button variant="outlined" onClick={() => _cancelUpdate()}> 
          {t('general.cancel')}
        </Button>
        <Button variant="contained" color="secondary" onClick={() => _completeUpdate()}> 
          {t('general.update')}
        </Button>
      </BottomActionsContainer>
    </UpdateContainer>
  </React.Suspense>;
}
