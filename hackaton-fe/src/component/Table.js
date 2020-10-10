import React from 'react';
import DataTable from 'react-data-table-component';

const Table = (props) => {
    return (
    <>
        <DataTable
            title={props.title || null}
            columns={props.columns || []}
            data={props.data || []}
            defaultSortField={props.defaultSortField || "title"}
            selectableRows={props.selectableRows || false}
            selectableRowsNoSelectAll={props.noSelectAll || false}
            selectableRowsHighlight={props.selectableRowsHighlight || false}
            selectableRowsVisibleOnly={props.selectableRowsVisibleOnly || false}
            expandableRows={props.expandableRows || false}
            expandOnRowClicked={props.expandOnRowClicked || false}
            pagination={props.pagination || false}
            highlightOnHover={props.highlightOnHover || false}
            striped={props.striped || false}
            pointerOnHover={props.pointerOnHover || false}
            dense={props.dense || false}
            noTableHead={props.tableHead || false}
            persistTableHead={props.persistTableHead || false}
            progressPending={props.progressPending || false}
            noHeader={props.title ? false : true}
            subHeader={props.subHeader || false}
            onRowClicked={props.onRowClicked || false}
            subHeaderComponent={
            (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <TextField id="outlined-basic" label="Search" variant="outlined" size="small" style={{ margin: '5px' }} /> */}
                    asdfdsfsad
                </div>
            ) || false
            }
            subHeaderAlign={props.subHeaderAlign || 'right'}
            fixedHeader={props.fixedHeader || true}
            fixedHeaderScrollHeight={ props.fixedHeaderScrollHeight ||"60vh"}
            direction={props.direction || 'auto'}
            style={{height: '70vh', overflow: 'auto'}}
      />    
    </>
    )
}

export default Table;