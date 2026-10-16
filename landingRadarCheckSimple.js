/**
 * Landing Radar Antenna Check Logic - Modern JavaScript Translation
 * Based EXACTLY on lines 239-250 from Luminary099/THE_LUNAR_LANDING.agc
 * Original 1969 Apollo 11 Guidance Computer Code
 * 
 * Line-by-line translation preserving original comments verbatim
 */

// Constants from the original AGC code
const BIT6 = 0x20;           // BIT6 constant used in antenna position check
const CODE500 = 0x140;       // OCT 00500 - Display code for astronaut message
const CHAN33 = 33;           // Channel 33 - Antenna position hardware register

/**
 * IS THE LR ANTENNA IN POSITION 1 YET
 * Modern JavaScript translation of P63SPOT3 routine
 * 
 * This function implements the exact logic from lines 239-250:
 * 1. Check if landing radar antenna is in position 1
 * 2. If yes, branch to initialize landing radar (P63SPOT4)
 * 3. If no, display CODE500 message to astronaut
 * 4. Handle TERMINATE or PROCEED astronaut response
 * 
 * @param {Object} context - Execution context with hardware interface
 * @returns {boolean} true if proceeding to radar initialization, false if terminated
 */
function p63spot3LandingRadarCheck(context) {
    // CA BIT6                        # IS THE LR ANTENNA IN POSITION 1 YET
    const bitMask = BIT6;
    
    // EXTEND
    // RAND CHAN33
    const channelValue = context.readChannel(CHAN33);
    const antennaStatus = channelValue & bitMask;
    
    // EXTEND
    // BZF P63SPOT4                   # BRANCH IF ANTENNA ALREADY IN POSITION 1
    if (antennaStatus === 0) {
        // Branch target: P63SPOT4 - Initialize landing radar
        context.initializeLandingRadar();
        return true;
    }
    
    // CAF CODE500                    # ASTRONAUT: PLEASE CRANK THE
    const errorCode = CODE500;
    
    // TC BANKCALL                    #        SILLY THING AROUND
    // CADR GOPERF1
    const astronautResponse = context.displayAstronautPrompt(
        errorCode,
        "PLEASE CRANK THE SILLY THING AROUND"
    );
    
    // TCF GOTOPOOH                   # TERMINATE
    if (astronautResponse === 'TERMINATE') {
        context.terminateOperation();
        return false;
    }
    
    // TCF P63SPOT3                   # PROCEED  SEE IF HE'S LYING
    // Recursive call to check again (faithful to original loop structure)
    return p63spot3LandingRadarCheck(context);
}

/**
 * Example hardware interface simulating AGC components
 */
class AGCHardwareSimulator {
    constructor() {
        this.antennaPosition = 0; // 0 = not in position 1, non-zero = in position 1
        this.operationActive = true;
    }
    
    /**
     * Simulate reading from a hardware channel
     * CHAN33 contains antenna position status
     */
    readChannel(channel) {
        if (channel === CHAN33) {
            // BIT6 mask: if antennaPosition has BIT6 set, antenna is NOT in position 1
            // In AGC logic: antennaStatus = 0 means antenna IS in position 1
            return this.antennaPosition === 0 ? BIT6 : 0;
        }
        return 0;
    }
    
    /**
     * Simulate astronaut display prompt
     * Returns astronaut's response
     */
    displayAstronautPrompt(code, message) {
        console.log(`\nAGC Display: Code ${code.toString(8)}`);
        console.log(`Astronaut Message: "${message}"`);
        console.log("Options: [TERMINATE] [PROCEED]");
        
        // Simulate astronaut eventually fixing antenna after a few prompts
        this.promptCount = (this.promptCount || 0) + 1;
        
        if (this.promptCount >= 3) {
            console.log("Astronaut: \"Okay, I cranked it around!\"");
            this.antennaPosition = 0; // Antenna now in position 1
            return 'PROCEED';
        }
        
        // Random response for simulation
        return Math.random() > 0.3 ? 'PROCEED' : 'TERMINATE';
    }
    
    /**
     * Simulate operation termination
     */
    terminateOperation() {
        console.log("\n*** OPERATION TERMINATED ***");
        this.operationActive = false;
    }
    
    /**
     * Simulate landing radar initialization (P63SPOT4)
     */
    initializeLandingRadar() {
        console.log("\n>>> LANDING RADAR INITIALIZED <<<");
        console.log(">>> OFF TO SEE THE WIZARD... <<<");
        this.operationActive = true;
    }
}

/**
 * Demonstration of the landing radar check logic
 */
function demonstrateLandingRadarCheck() {
    console.log("=".repeat(60));
    console.log("APOLLO 11 LUNAR LANDING - LANDING RADAR ANTENNA CHECK");
    console.log("=".repeat(60));
    console.log("Translating AGC Assembly lines 239-250 to JavaScript\n");
    
    console.log("Original AGC Code (lines 239-250):");
    console.log("P63SPOT3\tCA\tBIT6\t\t# IS THE LR ANTENNA IN POSITION 1 YET");
    console.log("\t\tEXTEND");
    console.log("\t\tRAND\tCHAN33");
    console.log("\t\tEXTEND");
    console.log("\t\tBZF\tP63SPOT4\t# BRANCH IF ANTENNA ALREADY IN POSITION 1");
    console.log("\t\tCAF\tCODE500\t\t# ASTRONAUT:\tPLEASE CRANK THE");
    console.log("\t\tTC\tBANKCALL\t#\t\tSILLY THING AROUND");
    console.log("\t\tCADR\tGOPERF1");
    console.log("\t\tTCF\tGOTOPOOH\t# TERMINATE");
    console.log("\t\tTCF\tP63SPOT3\t# PROCEED\tSEE IF HE'S LYING\n");
    
    console.log("Modern JavaScript Implementation:");
    console.log("-".repeat(60));
    
    const simulator = new AGCHardwareSimulator();
    
    // Initial state: antenna not in position 1
    simulator.antennaPosition = BIT6;
    
    try {
        const result = p63spot3LandingRadarCheck(simulator);
        
        console.log("\n" + "=".repeat(60));
        console.log("RESULT: " + (result ? 
            "Landing radar initialized successfully" : 
            "Operation terminated by astronaut"));
        console.log("=".repeat(60));
        
        return result;
    } catch (error) {
        console.error("Error in landing radar check:", error);
        return false;
    }
}

// Run demonstration
if (require.main === module) {
    demonstrateLandingRadarCheck();
}

module.exports = {
    p63spot3LandingRadarCheck,
    AGCHardwareSimulator,
    BIT6,
    CODE500,
    CHAN33
};