function printHelloWithTimeout() {
    let count = 0;

    function printHello() {
        console.log("Hello");
        count++;

        if (count < 5) { // Print "Hello" 5 times
            setTimeout(printHello, 3000); // Set timeout for 3 seconds
        }
    }

    printHello(); // Initial call to start printing
}

printHelloWithTimeout(); // Start the loop
