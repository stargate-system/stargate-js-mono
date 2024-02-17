# DTO Sender
Intended as test for sharing custom data like DTO object with use of GateString.

### Remarks
Can be piped as follows: \
DTO Sender (ModeDTO) -> Test device (ModeDTO)

### Values
**Main**
- Mode - select with various predefined sets of frequency and increment
- Set - button that sends selected DTO

**Hidden**
- ModeDTO - simple DTO object to be piped to "Test device" (ModeDTO value)

### Setup
Open terminal under project's root directory and run "npm run device:dto"