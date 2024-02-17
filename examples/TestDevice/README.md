# Test device
Containing all types of GateValues configured both as input and output,
with some logic to generate changes (can be started/stopped from UI using "Counter" switch)

### Remarks
Can be piped as follows: \
DTO Sender (ModeDTO) -> Test device (ModeDTO)

### Values
**Main**
- Small integer, Big integer, Unlimited integer - integer outputs with various ranges
- Counter direction (bool, select) - indicating if counter is being incremented or decremented
- Counter - boolean input to control if values are being altered
- Run counter - sets Counter to true when pressed, false when released

**Settings**
- Increment amount - amount to add/subtract each counter cycle
- Frequency - determines how often counter cycles
- Counted values - to select which outputs should be altered
- Test text - displays messages in some cases
- Test command - accepts some text commands. Typing unknown command will display explanation in "Test text" field

**Hidden**
- ModeDTO - accepts stringified dto object with values to set on "Increment amount" and "Frequency".
Meant to be supplied from "DtoSender" device (ModeDTO value) with pipe

### Setup
Open terminal under project's root directory and run "npm run device:test"