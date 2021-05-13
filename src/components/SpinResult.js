import { Dialog, Box } from '@material-ui/core'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


export const SpinResult = ({ spinResultVisible, setSpinResultVisible, spinResult }) => {
  const { width, height } = useWindowSize()

  return (
    <>
    <Dialog onClose={() => setSpinResultVisible(false)} aria-labelledby="simple-dialog-title" open={spinResultVisible}>
      <Box padding="2rem 6rem" textAlign="center">
        <Box>Result</Box>
        <Box fontWeight="bold" fontSize="2rem">{spinResult}</Box>
        <Box marginTop="2rem">Your Prize</Box>
        <Box fontWeight="bold" fontSize="2rem">0</Box>
      </Box>
    </Dialog>
    {spinResultVisible && <Box position="fixed" top="0" left="0" zIndex="9000">
      <Confetti width={width} height={height} />
    </Box>}
    </>
  )
}