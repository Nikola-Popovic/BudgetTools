import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Receipt } from '../../core/models/ReceiptTracker/Payer';
import { useReceiptService } from '../../core/services/ReceiptService';
import i18next from '../../shared/lang/i18next';
import { contentM, contentXL, contentXXL, spacingM, spacingXs } from '../../shared/styling/StylingConstants';
import Button from '@mui/material/Button';

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

export function ModifyReceiptPage() {
  const { t } = useTranslation('translation', { i18n: i18next });
  const receiptService = useReceiptService();
  const params = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt>({ id: 0, name: 'Top Text', total: 0, items: []});

  useEffect(() => {
    const getReceipt = async () => {
      const data = await receiptService.getReceipt(parseInt(params?.id ?? '-1'));
      if (data === undefined) {
        return;
      }
      setReceipt(data);
    };
    getReceipt();
  }, []);

  const _cancelUpdate = () => {
    navigate(-1);
  };

  const _completeUpdate = () => {
    console.log('complete update');
  };

  return <React.Suspense fallback="loading...">
    <UpdateContainer>
      <ReceiptContainer>
        <ReceiptTitle>
          {receipt.name}
        </ReceiptTitle>
        <LineDivider />
        <ReceiptBodyItem>
          <div>Product 1</div>
          <div>$10.00</div>
        </ReceiptBodyItem>
        <ReceiptBodyItem>
          <div>Product 2</div>
          <div>$10.00</div>
        </ReceiptBodyItem>
        <LineDivider />
        <ReceiptBodyItem>
          <div> Subtotal : </div>
          <div> ${receipt.total} </div>
        </ReceiptBodyItem>
        <ReceiptBodyItem>
          <div> TPS(5%) : </div>
          <div> ${receipt.total*0.05} </div>
        </ReceiptBodyItem>
        <ReceiptBodyItem>
          <div> TVQ(9.75%) : </div>
          <div> ${receipt.total*0.0975} </div>
        </ReceiptBodyItem>
        <ReceiptBodyTotal>
          <div> Total : </div>
          <div> ${receipt.total*1.05+receipt.total*0.0975} </div>
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
