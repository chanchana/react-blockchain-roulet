import { Box, TextField, Button } from '@material-ui/core'
import { useState } from 'react'



export const InputGroup = ({ label, buttonText, onEnter }) => {
  const [value, setValue] = useState(null)

  return (
    <Box>
      <TextField size="small" variant="filled" color="primary" label={label} onChange={(event) => setValue(event.target.value)} />
      <Button variant="contained" color="primary" onClick={() => onEnter(value)}>{buttonText}</Button>
    </Box>
  )
}



