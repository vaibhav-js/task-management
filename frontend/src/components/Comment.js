import React from 'react'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

function Comment({id, time, message, commenter}) {

    console.log(time, message, commenter)

    return (
        <div key={id}>
            <Card sx={{ minWidth: 275, width: 400, borderRadius: 4, margin: 5}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {message}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.primary">
                        {commenter}
                    </Typography>
                    <Typography variant="body2">
                        {time}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Reply</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default Comment