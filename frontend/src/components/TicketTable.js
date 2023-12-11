import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'reportername',
    headerName: 'Client',
    width: 100,
  },
  {
    field: 'assigneename',
    headerName: 'Provider',
    width: 100,
  },
  {
    field: 'description',
    headerName: 'Service',
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
    }, []);

    async function getTickets() {
        try {
            const data = {
                "token": localStorage.getItem('token')
            }
            const response = await axios.get('http://localhost:8080/tickets', {params: data});
            setRows(() => [...response.data.list]);
        } catch (error) {
            console.error(error);
        }
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