/**
 * Landing Radar Antenna Check Logic - Modern JavaScript Translation
 * Based on lines 239-250 from Luminary099/THE_LUNAR_LANDING.agc
 * Original 1969 Apollo 11 Guidance Computer Code
 */

// Constants matching the original AGC code
const BIT6 = 0x20; // BIT6 in octal is 20 (decimal 16), but exact value depends on AGC architecture
const CODE500 = 0x140; // OCT 00500 = decimal 320, but 500 in display code
const CHAN33 = 33; // Channel 33 for antenna position check

// Original AGC assembly code comments preserved verbatim
/**
 * IS THE LR ANTENNA IN POSITION 1 YET
 * BRANCH IF ANTENNA ALREADY IN POSITION 1
 * ASTRONAUT:  PLEASE CRANK THE
 *             SILLY THING AROUND
 * TERMINATE
 * PROCEED    SEE IF HE'S LYING
 */

/**
 * Modern JavaScript implementation of the landing radar antenna check logic
 * This function checks if the landing radar antenna is in position 1.
 * If not, it prompts the astronaut to adjust it and re-checks.
 * 
 * @param {Object} hardware - Simulated hardware interface
 * @param {Function} hardware.readChannel - Function to read from hardware channel
 * @param {Function} hardware.displayMessage - Function to display messages to astronaut
 * @param {Function} hardware.terminate - Function to terminate operation
 * @param {Function} hardware.initializeLandingRadar - Function to initialize landing radar
 * @returns {boolean} True if antenna is in position 1 and radar initialized, false if terminated
 */
function landingRadarAntennaCheck(hardware) {
    // P63SPOT3: Check if LR antenna is in position 1
    const checkAntennaPosition = () => {
        // CA BIT6 - Load BIT6 mask
        const bitMask = BIT6;
        
        // EXTEND RAND CHAN33 - Read channel 33 and AND with BIT6
        const channelValue = hardware.readChannel(CHAN33);
        const antennaStatus = channelValue & bitMask;
        
        // EXTEND BZF P63SPOT4 - Branch if zero (antenna already in position 1)
        if (antennaStatus === 0) {
            // Antenna is in position 1, proceed to initialize landing radar
            hardware.initializeLandingRadar();
            return true;
        }
        
        // Antenna not in position 1, prompt astronaut
        // CAF CODE500 - Load error code 500
        const errorCode = CODE500;
        
        // TC BANKCALL CADR GOPERF1 - Call astronaut prompt routine
        const astronautResponse = hardware.displayMessage(
            errorCode, 
            "PLEASE CRANK THE SILLY THING AROUND"
        );
        
        // TCF GOTOPOOH - Terminate option
        // TCF P63SPOT3 - Proceed option (check again)
        if (astronautResponse === 'TERMINATE') {
            hardware.terminate();
            return false;
        } else if (astronautResponse === 'PROCEED') {
            // Recursive call to check again - "SEE IF HE'S LYING"
            return checkAntennaPosition();
        }
        
        // ENTER option would initialize landing radar directly
        hardware.initializeLandingRadar();
        return true;
    };
    
    return checkAntennaPosition();
}

/**
 * Alternative implementation with loop instead of recursion
 * More closely matches the original control flow
 */
function landingRadarAntennaCheckLoop(hardware) {
    while (true) {
        // CA BIT6 - IS THE LR ANTENNA IN POSITION 1 YET
        const bitMask = BIT6;
        
        // EXTEND RAND CHAN33
        const channelValue = hardware.readChannel(CHAN33);
        const antennaStatus = channelValue & bitMask;
        
        // EXTEND BZF P63SPOT4 - BRANCH IF ANTENNA ALREADY IN POSITION 1
        if (antennaStatus === 0) {
            // P63SPOT4: ENTER - INITIALIZE LANDING RADAR
            hardware.initializeLandingRadar();
            return true;
        }
        
        // CAF CODE500 - ASTRONAUT: PLEASE CRANK THE
        const errorCode = CODE500;
        
        // TC BANKCALL CADR GOPERF1 - SILLY THING AROUND
        const astronautResponse = hardware.displayMessage(
            errorCode,
            "PLEASE CRANK THE SILLY THING AROUND"
        );
        
        // TCF GOTOPOOH - TERMINATE
        if (astronautResponse === 'TERMINATE') {
            hardware.terminate();
            return false;
        }
        
        // TCF P63SPOT3 - PROCEED - SEE IF HE'S LYING
        // Loop continues to check again
    }
}

/**
 * Simplified version that returns a Promise for async operations
 * Useful for modern JavaScript applications
 */
async function landingRadarAntennaCheckAsync(hardware) {
    while (true) {
        // Check antenna position
        const bitMask = BIT6;
        const channelValue = await hardware.readChannelAsync(CHAN33);
        const antennaStatus = channelValue & bitMask;
        
        // BRANCH IF ANTENNA ALREADY IN POSITION 1
        if (antennaStatus === 0) {
            await hardware.initializeLandingRadarAsync();
            return true;
        }
        
        // ASTRONAUT: PLEASE CRANK THE SILLY THING AROUND
        const errorCode = CODE500;
        const astronautResponse = await hardware.displayMessageAsync(
            errorCode,
            "PLEASE CRANK THE SILLY THING AROUND"
        );
        
        // TERMINATE
        if (astronautResponse === 'TERMINATE') {
            await hardware.terminateAsync();
            return false;
        }
        
        // PROCEED - SEE IF HE'S LYING
        // Loop continues
    }
}

// Example usage with mock hardware
const mockHardware = {
    readChannel: (channel) => {
        // Simulate reading from hardware channel
        // Return random value for testing
        return Math.floor(Math.random() * 64);
    },
    
    displayMessage: (code, message) => {
        console.log(`Code ${code.toString(8)} (octal): ${message}`);
        // Simulate astronaut response
        const responses = ['TERMINATE', 'PROCEED', 'ENTER'];
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    terminate: () => {
        console.log("Operation terminated.");
    },
    
    initializeLandingRadar: () => {
        console.log("Landing radar initialized. OFF TO SEE THE WIZARD...");
    }
};

// Test the function
console.log("Testing Landing Radar Antenna Check (Original Logic):");
console.log("=".repeat(50));

try {
    const result = landingRadarAntennaCheck(mockHardware);
    console.log(`Antenna check completed: ${result ? 'Success' : 'Terminated'}`);
} catch (error) {
    console.error(`Error during antenna check: ${error.message}`);
}

console.log("\nTesting Loop Version:");
console.log("=".repeat(50));

try {
    const result = landingRadarAntennaCheckLoop(mockHardware);
    console.log(`Antenna check completed: ${result ? 'Success' : 'Terminated'}`);
} catch (error) {
    console.error(`Error during antenna check: ${error.message}`);
}

module.exports = {
    landingRadarAntennaCheck,
    landingRadarAntennaCheckLoop,
    landingRadarAntennaCheckAsync,
    BIT6,
    CODE500,
    CHAN33
};