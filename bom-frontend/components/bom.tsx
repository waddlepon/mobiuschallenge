import { BomItem, getBomItems, addBomItem, deleteBomItem, putBomItem } from '../lib/bomapi';
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { DataTypeProvider, EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditRow, TableEditColumn } from '@devexpress/dx-react-grid-material-ui';

export default function Bom({ id, bom_items }: { id: string, bom_items: BomItem[] }) {
    const [columns] = useState([
        { name: 'specific_part', title: 'Specific Part' },
        { name: 'item_unit_cost', title: 'Item Unit Cost' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'updated_at', title: 'Updated At' },
        { name: 'created_at', title: 'Created At' },
    ]);

    const [dateColumns] = useState(['updated_at', 'created_at']);
    const DateFormatter = ({ value }) => {
        return new Date(value * 1000).toLocaleDateString('en-US');
    };
    const DateTypeProvider = props => (
        <DataTypeProvider
            formatterComponent={DateFormatter}
            {...props}
        />
    );

    const [rows, setRows] = useState(bom_items);
    const columnExtensions = [
        { columnName: 'updated_at', editingEnabled: false }, 
        { columnName: 'created_at', editingEnabled: false },
    ];
    const commitChanges = async ({ added, changed, deleted }) => {
        if (added) {
            for (let row of added) {
                await addBomItem(parseInt(id), row);
            }
        }
        if (changed) {
            for (let key in changed) {
                await putBomItem(parseInt(id), parseInt(rows[key].id), changed[key]);
            }
        }
        if (deleted) {
            for (let rowidx of deleted) {
                await deleteBomItem(parseInt(id), parseInt(rows[rowidx].id));
            }
        }
        setRows(await getBomItems(parseInt(id)));
    }
    return (
        <div className="container">
            <h1>BOM: {id}</h1>
            <Paper>
                <Grid
                    rows = {rows}
                    columns = {columns}
                >
                    <DateTypeProvider
                        for={dateColumns}
                    />
                    <EditingState
                        columnExtensions={columnExtensions}
                        onCommitChanges={commitChanges}
                    />
                    <Table />
                    <TableHeaderRow />
                    <TableEditRow />
                    <TableEditColumn
                        showAddCommand
                        showEditCommand
                        showDeleteCommand
                    />
                </Grid>
            </Paper>
        </div>
    );
}