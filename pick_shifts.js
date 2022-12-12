function refreshAt(hours, minutes, seconds) {
    var now = new Date();
    var then = new Date();

    if(now.getHours() > hours ||
       (now.getHours() == hours && now.getMinutes() > minutes) ||
        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    var timeout = (then.getTime() - now.getTime());
    setTimeout(() => { window.location.reload(); }, timeout);

    console.log("Loaded script.")
}


refreshAt(16,00,01); //Will refresh the page at 16:00 and 1 second.
//^Works on computers local time.

var loadfunction = window.onload;
//On page reload.
window.onload = function(event){
    setTimeout(()=> {
        console.log("Checking shifts.")
        let DESIRED_DAYS = ['12', '13', '14', '15', '16'];
        let DESIRED_SHIFTS = ['8a - 10a', '10a - 12p', '12p - 2p', '2p - 4p', '4p - 6p'];
        //['8a - 10a', '10a - 12p', '12p - 2p', '2p - 4p', '4p - 6p']

        let shiftButtons = [];
        document.querySelectorAll('.row.no-gutters.align-items-center').forEach((row) => {
            if (DESIRED_SHIFTS.includes(row.innerText)) {
                const day = findTheDay(row);
                const month = findTheMonth(row);
                if (DESIRED_DAYS.includes(day)) {
                    const button = row.parentElement.querySelector('.btn.btn-primary.btn-sm');
                    if (button) {
                        shiftButtons.push({ button: button, shift: row.innerText, day: day, month: month  });
                    }
                }
            }
        });

        function findTheDay(row) {
            const div = row.parentElement.parentElement.parentElement.querySelector('div.col-md-4.date.text-center div');
            if (div) {
                return div.innerText;
            }
            return null
        }

        function findTheMonth(row) {
            const div = row.parentElement.parentElement.parentElement.querySelector('div.col-md-4.date.text-center span');
            if (div) {
                return div.innerText;
            }
            return null
        }

        let shouldContinue = true;
        function takeShift() {
            if (!shiftButtons) return;
            const { button, shift, day, month } = shiftButtons.shift();
            if (!shouldContinue) return;

            console.log(`Clicking button for shift: "${day}" "${month}" "${shift}"`);
            button.click();

            setTimeout(() => {
                takeShiftOnModal(shift, month, day);
            }, 400);    
        }

        function takeShiftOnModal(shift, month, day) {
            const confirmButton = document.querySelector('.btn.btn-primary.pull-right.ml-2.btn-md');
            if (confirmButton && confirmButton.innerText === 'TAKE OPENSHIFT') {
                console.log(`Clicking confirm button for ${day} ${month} ${shift}: "${confirmButton.innerText}"`);
                // CLICK TAKE OPENSHIFT
                confirmButton.click();

                // CLICK THE CANCEL BUTTON INSTEAD
                /* onst cancelButton = document.querySelector('.btn.btn-secondary.pull-right.ml-2.cancel.btn-md');
                if (cancelButton && cancelButton.innerText === 'CANCEL') {
                    console.log(`Clicking cancel button for ${day} ${month} ${shift}: "${cancelButton.innerText}"`);
                    cancelButton.click();
                } else {
                    console.log("No cancel button found");
                    shouldContinue = false;
                    return
                } */
            } else {
                console.log("No confirm button found.");
                shouldContinue = false;
                return
            }
        }

        function recursiveButtonLoop() {
            if (!shiftButtons) return;
            if (shiftButtons.length === 0) {
                console.log("No more buttons to click.");
                return;
            }

            takeShift();

            console.log("Waiting 1.5 seconds before going for another button.");
            setTimeout(() => {
                recursiveButtonLoop();
            //Wait 1.5 seconds before going to next shift.
            //Two seconds because after clicking TAKE OPENSHIFT it can take a bit for it to load.
            }, 1500);
        }

        recursiveButtonLoop();
     }
     //Wait 3.5 seconds after the page reloads to run the script.
     ,3500);
    if(loadfunction) loadfunction(event);
}