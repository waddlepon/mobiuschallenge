import { BomItem, getBomItems, addBomItem, deleteBomItem, putBomItem } from '../lib/bomapi';
import React, { useState, ReactNode } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import { ChangeSet, DataTypeProvider, EditingState, TableColumn, TableRow } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditColumn, TableEditRow } from '@devexpress/dx-react-grid-material-ui';
import _ from 'lodash';

const Title = ({ children }) => {
    return (
        <Box fontWeight="fontWeightBold">{children}</Box>
    );
}

const EditCell = ({ errors, ...props }: { errors: any, row: any, tableRow: TableRow, tableColumn: TableColumn, children?: ReactNode }) => {
    const { children } = props;
    return (
        <TableEditColumn.Cell {...props}>
            {React.Children.map(children, child => {
                //@ts-ignore
                return child?.props.id === 'commit'
                    //@ts-ignore
                    ? React.cloneElement(child, { disabled: errors[props.tableRow.rowId] })
                    : child
            })}
        </TableEditColumn.Cell>
    );
};

const validate = (rows, columns) => Object.entries(rows).reduce(
    (acc, [rowId, row]) => ({
        ...acc,
        [rowId]: columns.some(column => (column.required && row[column.name] === '') || (column.isNum && isNaN(row[column.name]))),
    }), {},
);

export default function Bom({ id, bom_items }: { id: string, bom_items: BomItem[] }) {
    const [columns] = useState([
        { name: 'specific_part', title: 'Specific Part', required: true, isNum: true },
        { name: 'item_unit_cost', title: 'Item Unit Cost', required: true, isNum: true },
        { name: 'quantity', title: 'Quantity', required: true, isNum: true },
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
    const [errors, setErrors] = useState({});
    const columnExtensions = [
        { columnName: 'updated_at', editingEnabled: false },
        { columnName: 'created_at', editingEnabled: false },
    ];
    const commitChanges = async ({ added, changed, deleted }: ChangeSet) => {
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

    const onEdited = _.debounce(edited => setErrors(validate(edited, columns)), 250);
    const onAdded = _.debounce(added => setErrors(validate(added, columns)), 250);

    return (
        <div className="container">
            <Typography component="h1">BOM: {id}</Typography>
            <Paper>
                <Grid
                    rows={rows}
                    columns={columns}
                >
                    <DateTypeProvider
                        for={dateColumns}
                    />
                    <EditingState
                        onRowChangesChange={onEdited}
                        onAddedRowsChange={onAdded}
                        columnExtensions={columnExtensions}
                        onCommitChanges={commitChanges}
                    />
                    <Table />
                    <TableHeaderRow
                        titleComponent={Title}
                    />
                    <TableEditRow />
                    <TableEditColumn
                        showAddCommand
                        showEditCommand
                        showDeleteCommand
                        cellComponent={props => <EditCell {...props} errors={errors} />}
                    />
                </Grid>
            </Paper>
        </div>
    );
}