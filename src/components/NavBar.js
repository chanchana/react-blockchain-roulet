import { AppBar, Toolbar, IconButton, Button, Typography, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Menu as MenuIcon } from '@material-ui/icons'
import { ExchangeToken } from './ExchangeToken'

export const NavBar = ({ accountAddress }) => {
  return (
    <Box display="flex">
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Box fontWeight="bold" >
            <Typography variant="h6" fontWeight="bold" >
              Rouhee
            </Typography>
          </Box>
          <div style={{marginLeft: 'auto'}}>
            <ExchangeToken/>
            <Button variant="outlined" color="inherit" marginLeft="auto" style={{marginLeft: '16px'}}>Account: {accountAddress.slice(0, 6)}...</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}