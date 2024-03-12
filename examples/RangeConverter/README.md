# Range converter
Example of middleware device to assist piping numeric values of different ranges.
Uses ServerStore to persist range settings.

### Remarks
Can be piped as follows (after setting relevant ranges): \
Any numeric value -> Range converter (Input) \
Range converter (Output) -> Any numeric input

### Values
**Main**
- Input - input value
- Output - converted value

**Settings**
- Input min, Input max - expected range of input
- Output min, Output max - desired range of output
- Invert - reversing output value

### Setup
Open terminal under project's root directory and run "npm run device:converter"