# Landing Radar Antenna Check - Apollo 11 AGC to JavaScript Translation

## Original AGC Assembly Code (Lines 239-250 from Luminary099/THE_LUNAR_LANDING.agc)

```assembly
P63SPOT3	CA	BIT6		# IS THE LR ANTENNA IN POSITION 1 YET
		EXTEND
		RAND	CHAN33
		EXTEND
		BZF	P63SPOT4	# BRANCH IF ANTENNA ALREADY IN POSITION 1

		CAF	CODE500		# ASTRONAUT:	PLEASE CRANK THE
		TC	BANKCALL	#		SILLY THING AROUND
		CADR	GOPERF1
		TCF	GOTOPOOH	# TERMINATE
		TCF	P63SPOT3	# PROCEED	SEE IF HE'S LYING
```

## Modern JavaScript Translation

```javascript
function checkLandingRadarAntenna(agc) {
    // LINE 239: CA BIT6 - "IS THE LR ANTENNA IN POSITION 1 YET"
    const positionCheckMask = BIT6;
    
    // LINES 240-241: EXTEND RAND CHAN33
    const channel33Value = agc.readChannel(CHAN33);
    const antennaStatus = channel33Value & positionCheckMask;
    
    // LINES 242-243: EXTEND BZF P63SPOT4 - "BRANCH IF ANTENNA ALREADY IN POSITION 1"
    if (antennaStatus === 0) {
        // Antenna is ready! Proceed to initialize landing radar.
        agc.initializeLandingRadar();
        return true;
    }
    
    // LINES 245-247: CAF CODE500 / TC BANKCALL / CADR GOPERF1
    // "ASTRONAUT: PLEASE CRANK THE SILLY THING AROUND"
    const astronautResponse = agc.displayCode500(
        "PLEASE CRANK THE SILLY THING AROUND"
    );
    
    // LINE 248: TCF GOTOPOOH - "TERMINATE"
    if (astronautResponse === 'TERMINATE') {
        agc.terminate();
        return false;
    }
    
    // LINE 249: TCF P63SPOT3 - "PROCEED SEE IF HE'S LYING"
    // Recursive call exactly matches original control flow
    return checkLandingRadarAntenna(agc);
}
```

## Line-by-Line Translation Guide

| AGC Assembly Line | JavaScript Equivalent | Original Comment |
|-------------------|----------------------|------------------|
| `CA BIT6` | `const positionCheckMask = BIT6;` | `# IS THE LR ANTENNA IN POSITION 1 YET` |
| `EXTEND RAND CHAN33` | `const channel33Value = agc.readChannel(CHAN33); const antennaStatus = channel33Value & positionCheckMask;` | (hardware operation) |
| `EXTEND BZF P63SPOT4` | `if (antennaStatus === 0) { ... }` | `# BRANCH IF ANTENNA ALREADY IN POSITION 1` |
| `CAF CODE500` | `const astronautResponse = agc.displayCode500(...);` | `# ASTRONAUT: PLEASE CRANK THE` |
| `TC BANKCALL CADR GOPERF1` | (included in displayCode500 call) | `# SILLY THING AROUND` |
| `TCF GOTOPOOH` | `if (astronautResponse === 'TERMINATE') { agc.terminate(); return false; }` | `# TERMINATE` |
| `TCF P63SPOT3` | `return checkLandingRadarAntenna(agc);` | `# PROCEED SEE IF HE'S LYING` |

## Key Implementation Details

### Bit Logic Explanation
- **BIT6** (0x20): Mask bit for antenna position check
- **CHAN33**: Hardware channel reading antenna position
- **Logic**: `(CHAN33 & BIT6) == 0` means antenna IS in position 1 (ready)
- **Counter-intuitive**: Zero result = GOOD, Non-zero = BAD

### Control Flow
1. Check antenna position
2. If ready → initialize landing radar (P63SPOT4)
3. If not ready → display CODE500 message to astronaut
4. Astronaut can:
   - TERMINATE: Abort operation
   - PROCEED: Claims to have fixed antenna, check again (recursive call)

### Historical Context
This code ran on the Apollo Guidance Computer (AGC) during the Apollo 11 lunar landing on July 20, 1969. The "silly thing" refers to the landing radar antenna that needed to be manually positioned by the astronauts.

## Files Created

1. **`landingRadarAntennaCheck.js`** - Comprehensive implementation with multiple versions
2. **`landingRadarCheckSimple.js`** - Simplified version with hardware simulator
3. **`landingRadarCheckAccurate.js`** - Most faithful translation with exact comments preserved

## How to Run
```bash
cd /Users/macbook/code/Apollo-11
node landingRadarCheckAccurate.js
```

## Output Example
```
[AGC DISPLAY CODE500]: PLEASE CRANK THE SILLY THING AROUND
Astronaut options: TERMINATE or PROCEED
Astronaut: "Working on it..."

[AGC DISPLAY CODE500]: PLEASE CRANK THE SILLY THING AROUND  
Astronaut options: TERMINATE or PROCEED
Astronaut: "Fixed it!"

>>> LANDING RADAR INITIALIZED <<<
>>> OFF TO SEE THE WIZARD... <<<
```

## Exported Values
- `checkLandingRadarAntenna` - Main function
- `AGCSimulator` - Hardware simulation class
- `BIT6`, `CODE500`, `CHAN33` - Original constants
- `COMMENTS` - Original comments preserved as JavaScript constants