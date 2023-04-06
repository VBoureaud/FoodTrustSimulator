import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

import {
  Transactions
} from '@store/types/AccountTypes';

import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import { displayDate } from '@utils/helpers';

if (typeof module !== "undefined") var xrpl = require('xrpl')

import './DataGrid.less';

const defType: any = {
  'NFTokenBurn': {
    'fr': 'Destruction d\'un NFT.',
    'en': 'Destroy a non-fungible token (NFT) object.',
  },
  'NFTokenMint': {
    'fr': 'Création d\'un NFT.',
    'en': 'Mint a non-fungible token (NFT) object.',
  },
  'NFTokenAcceptOffer': {
    'fr': 'Offre acceptée pour ce NFT.',
    'en': 'Accepted offer for this NFT.',
  },
  'NFTokenCreateOffer': {
    'fr': 'Une offre a été créée.',
    'en': 'Offer created.',
  },
  'NFTokenCancelOffer': {
    'fr': 'Une offre a été annulée.',
    'en': 'Offer cancelled',
  },
}
const columns: GridColDef[] = [
  { 
    field: 'id',
    headerName: 'ID',
    width: 5,
  },
  { 
    field: 'confirmed',
    headerName: 'Confirmed',
    minWidth: 160
  },
  { 
    field: 'type',
    headerName: 'Type',
    minWidth: 155,
    renderCell: (params: GridRenderCellParams) => <div><Tooltip title={defType[params.formattedValue] ? defType[params.formattedValue].en : ''} placement="top-start"><span>{params.formattedValue}</span></Tooltip></div>
  },
  { 
    field: 'from',
    headerName: 'From',
    minWidth: 200
  },
  { 
    field: 'to',
    headerName: 'To',
    minWidth: 200
  },
  { 
    field: 'amount',
    headerName: 'Amount',
    minWidth: 80
  },
  { 
    field: 'fee',
    headerName: 'Fee',
    minWidth: 80
  },
  { 
    field: 'id_hash',
    headerName: 'Identifying Hash',
    minWidth: 170
  },
];

const buildRow = (
  rowTx: Transactions,
  index: number,
  ownerName: string,
  ownerAddr: string,
  names: {[key: string]: string}) => {
  const name = ownerName ? ownerName : ownerAddr;
  const to = rowTx.tx.Owner && names && names[rowTx.tx.Owner] ? names[rowTx.tx.Owner] : rowTx.tx.Owner ? rowTx.tx.Owner : name;
  const from = rowTx.tx.Account == ownerAddr ? name : names && names[rowTx.tx.Account] ? names[rowTx.tx.Account] : rowTx.tx.Account;
  const data = { 
    id: index,
    confirmed: displayDate(xrpl.rippleTimeToUnixTime(rowTx.tx.date), true),
    type: rowTx.tx.TransactionType,
    from,
    to,
    amount: rowTx.tx.Amount ? xrpl.dropsToXrp(rowTx.tx.Amount) : '',
    fee: xrpl.dropsToXrp(rowTx.tx.Fee),
    id_hash: rowTx.tx.hash,
  };
  return data;
};

type DataGridTxProps = {
	loading: boolean;
  transactions?: Transactions[];
  ownerAddr: string;
  ownerName: string;
  names?: {[key: string]: string};
}

const DataGridTx : React.FunctionComponent<DataGridTxProps> = (props) => {
	return (
		<div style={{ height: '400px', width: '100%' }}>
			<Typography variant="h6">Transactions</Typography>
		  	{!props.loading && props.transactions && <DataGrid
          style={{ border: 'none' }}
		    	columns={columns}
		    	rows={
            props.transactions.map(
              (elt:Transactions, index: number) => buildRow(elt, index, props.ownerName, props.ownerAddr, props.names))}
		    	pageSize={10}
		    	rowsPerPageOptions={[10]}
		    	disableSelectionOnClick
		  	/>}
		  	{props.loading && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
		    {!props.loading && !props.transactions && <Typography variant="h4">No transactions history</Typography>}
    </div>
	);
}


export default DataGridTx;