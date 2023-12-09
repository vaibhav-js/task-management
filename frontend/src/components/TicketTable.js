import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'assigneename',
    headerName: 'Assignee',
    width: 100,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 150,
  },
  {
    field: 'createdat',
    headerName: 'Created At',
    width: 160,
  },
];

export default function DataGridDemo() {
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        getTickets();
    }, [rows]);

    async function getTickets() {
        const data = {
            "token": localStorage.getItem('token')
        }
        const response = await axios.get('http://localhost:8080/tickets', {params: data});
        console.log(response.data.list);
        setRows(response.data.list);
    }

    return (
        <div>
            {
                (Array.isArray(rows) && rows.length > 0) ? (
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                            paginationModel: {
                            pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
                ) : (
                <Box sx={{ height: 400, width: '100%' }}>
                    <p>No records to display</p>
                </Box>
                )
            }
        </div>
    );
}