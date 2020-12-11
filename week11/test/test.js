// The test "framework", exports the Suite function plus a total of how many assertions have been tested

export { Suite, total }

import { padLeft, padRight}   from "../util/strings.js"; // for formatting the report
import { Tuple }              from "../church/rock.js";
import { id }                 from "../church/church.js";

let total = 0;
var dict = {};

function Assert(name) {
    const results = []; // [Bool], true if test passed, false otherwise
    return {
        results: results,
        true: (testResult) => {
            if (!testResult) { console.error("test failed") }
            results.push(testResult);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            if (!testResult) {
                console.error("test failure. Got '"+ actual +"', expected '" + expected +"'");
            }
            results.push(testResult);
            dict[name] = dict[name] -1
            if(dict[name] == 0) {
                total += results.length;
                if (results.every( id )) { // whole suite was ok, report whole suite
                    report("suite " + name, results)
                } else { // some test in suite failed, rerun tests for better error indication
                    //tests.forEach( test => suite.test( test(name), test(logic) ) )
                }
            }
        }
    }
}

const [Test, name, logic] = Tuple(2); // data type to capture test to-be-run

function test(name, callback) {
    const assert = Assert(name);
    callback(assert);
    report(name, assert.results)
}

function Suite(suiteName) {
    const tests = []; // [Tests]
    dict[suiteName] = 0;
    const suite = {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => {
            tests.push(Test (testName) (callback))   
        },
        run:  (numberOf) => {
            dict[suiteName] = numberOf; // how many tests expected?
            const suiteAssert = Assert(suiteName);
            tests.forEach( test => test(logic) (suiteAssert) );
            /*total += suiteAssert.results.length;                // moved
            if (suiteAssert.results.every( id )) { 
                report("suite " + suiteName, suiteAssert.results) // already runned prev. version!
            } else { 
                tests.forEach( test => suite.test( test(name), test(logic) ) )
            }*/
        }
    };
    return suite;
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        write(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        document.getElementById('grossTotal').innerText = "" + total + " Tests";
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    write("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            write("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function write(message) {
    const out = document.getElementById('out');
    out.innerText += message + "\n";
}

function bar(extend) {
    write("+" + "-".repeat(extend) + "+");
}

