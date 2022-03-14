import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import {
  Transactions
} from '@store/types/AccountTypes';

import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import { displayDate } from '@utils/helpers';

if (typeof module !== "undefined") var xrpl = require('xrpl')

const columns: GridColDef[] = [
  { 
    field: 'id',
    headerName: 'ID',
    minWidth: 10
  },
  { 
    field: 'confirmed',
    headerName: 'Confirmed',
    minWidth: 160
  },
  { 
    field: 'type',
    headerName: 'Type',
    minWidth: 155
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

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const buildRow = (
  rowTx: Transactions,
  index: number,
  ownerName: string,
  ownerAddr: string) => {
  const name = ownerName ? ownerName : ownerAddr;
  const data = { 
    id: index,
    confirmed: displayDate(xrpl.rippleTimeToUnixTime(rowTx.tx.date), true),
    type: rowTx.tx.TransactionType,
    from: rowTx.tx.Account == ownerAddr ? name : rowTx.tx.Account,
    to: rowTx.tx.Owner ? rowTx.tx.Owner : name,
    amount: rowTx.tx.Amount ? xrpl.dropsToXrp(rowTx.tx.Amount) : '',
    fee: xrpl.dropsToXrp(rowTx.tx.Fee),
    id_hash: rowTx.tx.hash,
  };
  return data;
};

if (typeof module !== "undefined") var xrpl = require('xrpl')

type DataGridTxProps = {
	loading: boolean;
  transactions?: Transactions[];
  ownerAddr: string;
  ownerName: string;
}

const DataGridTx : React.FunctionComponent<DataGridTxProps> = (props) => {
	return (
		<div style={{ height: '400px', width: '100%' }}>
			<Typography variant="h6">Tx History:</Typography>
		  	{!props.loading && props.transactions && <DataGrid
		    	columns={columns}
		    	rows={
            props.transactions.map(
              (elt:Transactions, index: number) => buildRow(elt, index, props.ownerName, props.ownerAddr))}
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