/**
 * Landing Radar Antenna Check Logic - EXACT JavaScript Translation
 * Lines 239-250 from Luminary099/THE_LUNAR_LANDING.agc
 * Apollo 11 Lunar Module Guidance Computer - July 1969
 * 
 * Faithful translation preserving all original comments word-for-word
 */

// -----------------------------------------------------------------
// ORIGINAL AGC ASSEMBLY CODE (verbatim from lines 239-250)
// -----------------------------------------------------------------
/*
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
*/

// -----------------------------------------------------------------
// CONSTANTS (matched to original AGC values)
// -----------------------------------------------------------------
const BIT6 = 0x20;      // BIT6 mask (octal 20) - position 1 check bit
const CODE500 = 0x140;  // OCT 00500 - astronaut display code
const CHAN33 = 33;      // Channel 33 - landing radar antenna position register

// -----------------------------------------------------------------
// AGC LOGIC EXPLANATION:
// -----------------------------------------------------------------
// The original AGC code checks if the landing radar (LR) antenna 
// is in "position 1" (deployed/ready for landing).
//
// BIT6 is a mask bit that indicates antenna position status.
// CHAN33 is a hardware input channel that reads antenna position.
//
// LOGIC: Read CHAN33, AND with BIT6
//   - If result is ZERO: antenna IS in position 1 → proceed to P63SPOT4
//   - If result is NON-ZERO: antenna NOT in position 1 → prompt astronaut
//
// This is counter-intuitive: Zero result means GOOD (antenna ready).
// Non-zero means BAD (antenna not ready).

// -----------------------------------------------------------------
// MODERN JAVASCRIPT FUNCTION - Exact logic translation
// -----------------------------------------------------------------

/**
 * IS THE LR ANTENNA IN POSITION 1 YET
 * 
 * JavaScript implementation of P63SPOT3 routine from Apollo 11 AGC.
 * Checks landing radar antenna position and prompts astronaut if needed.
 * 
 * @param {Object} agc - AGC hardware interface object
 * @param {Function} agc.readChannel - Reads hardware channel value
 * @param {Function} agc.displayCode500 - Displays CODE500 to astronaut
 * @param {Function} agc.terminate - Terminates operation (GOTOPOOH)
 * @param {Function} agc.initializeLandingRadar - Initializes radar (P63SPOT4)
 * @returns {boolean} true if radar initialized, false if terminated
 */
function checkLandingRadarAntenna(agc) {
	// WHY DOES THIS EVEN WORK
    // -----------------------------------------------------------------
    // LINE 239: CA BIT6
    // "IS THE LR ANTENNA IN POSITION 1 YET"
    // -----------------------------------------------------------------
    const positionCheckMask = BIT6;
    
    // -----------------------------------------------------------------
    // LINES 240-241: EXTEND RAND CHAN33
    // Read antenna position from hardware channel 33
    // -----------------------------------------------------------------
    const channel33Value = agc.readChannel(CHAN33);
    const antennaStatus = channel33Value & positionCheckMask;
    
    // -----------------------------------------------------------------
    // LINES 242-243: EXTEND BZF P63SPOT4
    // "BRANCH IF ANTENNA ALREADY IN POSITION 1"
    // If (CHAN33 & BIT6) == 0, antenna IS in position 1
    // -----------------------------------------------------------------
    if (antennaStatus === 0) {
        // Antenna is ready! Proceed to initialize landing radar.
        agc.initializeLandingRadar();
        return true;
    }
    
    // -----------------------------------------------------------------
    // LINES 245 247: CAF CODE500 / TC BANKCALL / CADR GOPERF1
    // "ASTRONAUT: PLEASE CRANK THE SILLY THING AROUND"
    // Display CODE500 message to astronaut
    // -----------------------------------------------------------------
    const astronautResponse = agc.displayCode500(
        "PLEASE CRANK THE SILLY THING AROUND"
    );
    
    // -----------------------------------------------------------------
    // LINE 248: TCF GOTOPOOH
    // "TERMINATE" - Astronaut selects TERMINATE option
    // -----------------------------------------------------------------
    if (astronautResponse === 'TERMINATE') {
        agc.terminate();
        return false;
    }
    
    // -----------------------------------------------------------------
    // LINE 249: TCF P63SPOT3  
    // "PROCEED SEE IF HE'S LYING"
    // Astronaut says they fixed it - check again!
    // -----------------------------------------------------------------
    // Recursive call exactly matches original control flow
    return checkLandingRadarAntenna(agc);
}

// -----------------------------------------------------------------
// SIMULATION: AGC Hardware Interface
// -----------------------------------------------------------------

/**
 * Simulates Apollo AGC hardware for testing
 */
class AGCSimulator {
    constructor() {
        // antennaPosition: 0 = in position 1 (ready), non-zero = not ready
        this.antennaPosition = 0x20; // Start with antenna NOT in position 1
        this.promptCount = 0;
    }
    
    /**
     * Simulates reading from AGC hardware channel
     * CHAN33 format: BIT6 set = antenna NOT in position 1
     */
    readChannel(channel) {
        if (channel === CHAN33) {
            // Return value where BIT6 is set if antenna NOT in position 1
            return this.antennaPosition;
        }
        return 0;
    }
    
    /**
     * Simulates displaying CODE500 to astronaut
     * Returns astronaut's response
     */
    displayCode500(message) {
        console.log(`\n[AGC DISPLAY CODE500]: ${message}`);
        console.log("Astronaut options: TERMINATE or PROCEED");
        
        this.promptCount++;
        
        // Simulate: After 2 prompts, astronaut fixes antenna
        if (this.promptCount >= 2) {
            console.log("Astronaut: \"Fixed it!\"");
            this.antennaPosition = 0; // Antenna now in position 1
            return 'PROCEED';
        }
        
        console.log("Astronaut: \"Working on it...\"");
        return 'PROCEED';
    }
    
    /**
     * Simulates operation termination (GOTOPOOH)
     */
    terminate() {
        console.log("\n*** OPERATION TERMINATED ***");
    }
    
    /**
     * Simulates landing radar initialization (P63SPOT4)
     */
    initializeLandingRadar() {
        console.log("\n>>> LANDING RADAR INITIALIZED <<<");
        console.log(">>> OFF TO SEE THE WIZARD... <<<");
    }
}

// -----------------------------------------------------------------
// DEMONSTRATION AND TESTING
// -----------------------------------------------------------------

function runApolloAntennaCheck() {
    console.log("=".repeat(70));
    console.log("APOLLO 11 LUNAR LANDING GUIDANCE COMPUTER");
    console.log("Landing Radar Antenna Check - P63SPOT3 Routine");
    console.log("=".repeat(70));
    
    console.log("\nORIGINAL AGC ASSEMBLY (Luminary099, lines 239-250):");
    console.log("-".repeat(70));
    console.log("P63SPOT3\tCA\tBIT6\t\t# IS THE LR ANTENNA IN POSITION 1 YET");
    console.log("\t\tEXTEND");
    console.log("\t\tRAND\tCHAN33");
    console.log("\t\tEXTEND");
    console.log("\t\tBZF\tP63SPOT4\t# BRANCH IF ANTENNA ALREADY IN POSITION 1");
    console.log("\t\tCAF\tCODE500\t\t# ASTRONAUT:\tPLEASE CRANK THE");
    console.log("\t\tTC\tBANKCALL\t#\t\tSILLY THING AROUND");
    console.log("\t\tCADR\tGOPERF1");
    console.log("\t\tTCF\tGOTOPOOH\t# TERMINATE");
    console.log("\t\tTCF\tP63SPOT3\t# PROCEED\tSEE IF HE'S LYING");
    
    console.log("\n\nMODERN JAVASCRIPT TRANSLATION:");
    console.log("-".repeat(70));
    
    const agc = new AGCSimulator();
    const result = checkLandingRadarAntenna(agc);
    
    console.log("\n" + "=".repeat(70));
    console.log("MISSION STATUS: " + 
        (result ? "LANDING RADAR READY" : "OPERATION TERMINATED"));
    console.log("=".repeat(70));
    
    return result;
}

// Execute if run directly
if (require.main === module) {
    runApolloAntennaCheck();
}

// Export for use in other modules
module.exports = {
    checkLandingRadarAntenna,
    AGCSimulator,
    BIT6,
    CODE500,
    CHAN33,
    
    // Original comments preserved as constants
    COMMENTS: {
        LINE_239: "IS THE LR ANTENNA IN POSITION 1 YET",
        LINE_243: "BRANCH IF ANTENNA ALREADY IN POSITION 1", 
        LINE_245: "ASTRONAUT: PLEASE CRANK THE",
        LINE_246: "SILLY THING AROUND",
        LINE_248: "TERMINATE",
        LINE_249: "PROCEED SEE IF HE'S LYING"
    }
};