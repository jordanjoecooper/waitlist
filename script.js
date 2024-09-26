document.addEventListener('DOMContentLoaded', () => {
    // PIN screen commented out
    // const pinOverlay = document.getElementById('pinOverlay');
    // const pinDisplay = document.getElementById('pinDisplay');
    // const keypad = document.querySelector('.keypad');
    // const pinError = document.getElementById('pinError');

    // PIN screen commented out
    // const correctPin = '0134';
    // let currentPin = '';

    // PIN screen commented out
    // function showPinOverlay() {
    //     pinOverlay.classList.remove('hidden');
    // }

    // PIN screen commented out
    // function hidePinOverlay() {
    //     pinOverlay.classList.add('hidden');
    // }

    // PIN screen commented out
    // function updatePinDisplay() {
    //     const filledCircles = '●'.repeat(currentPin.length);
    //     const emptyCircles = '○'.repeat(4 - currentPin.length);
    //     pinDisplay.textContent = filledCircles + emptyCircles;
    // }

    // PIN screen commented out
    // function checkPin() {
    //     if (currentPin === correctPin) {
    //         hidePinOverlay();
    //         initializeApp();
    //     } else {
    //         pinError.textContent = 'Incorrect PIN';
    //         pinError.classList.remove('hidden');
    //         pinError.classList.add('visible');
    //         currentPin = '';
    //         updatePinDisplay();
    //         setTimeout(() => {
    //             pinError.classList.remove('visible');
    //             pinError.classList.add('hidden');
    //         }, 2000);
    //     }
    // }

    // PIN screen commented out
    // keypad.addEventListener('click', (e) => {
    //     if (e.target.classList.contains('key')) {
    //         const key = e.target.getAttribute('data-key');
    //         pinError.classList.remove('visible');
    //         pinError.classList.add('hidden');

    //         switch (key) {
    //             case 'clear':
    //                 currentPin = '';
    //                 break;
    //             case 'enter':
    //                 if (currentPin.length === 4) {
    //                     checkPin();
    //                 }
    //                 return;
    //             default:
    //                 if (currentPin.length < 4) {
    //                     currentPin += key;
    //                     if (currentPin.length === 4) {
    //                         setTimeout(checkPin, 300); // Short delay for visual feedback
    //                     }
    //                 }
    //                 break;
    //         }

    //         updatePinDisplay();
    //     }
    // });

    // PIN screen commented out
    // showPinOverlay();
    // updatePinDisplay();

    // PIN screen commented out - removed function wrapper
    // function initializeApp() {
        // Existing app code starts here
        const clearAllButton = document.getElementById('clearAllButton');
        const formContainer = document.getElementById('formContainer');
        const nameInput = document.getElementById('nameInput');
        const guestsInput = document.getElementById('guestsInput');
        const confirmButton = document.getElementById('confirmButton');
        const waitlist = document.getElementById('waitlist');
        const modal = document.getElementById('modal');
        const confirmClear = document.getElementById('confirmClear');
        const cancelClear = document.getElementById('cancelClear');

        let waitlistData = JSON.parse(localStorage.getItem('waitlist')) || [];

        const updateWaitlist = () => {
            waitlist.innerHTML = '';
            waitlistData.forEach((entry, index) => {
                const li = document.createElement('li');
                const waitTime = Math.floor((Date.now() - entry.timestamp) / 60000);
                li.innerHTML = `
                    <span class="guest-name">${entry.name}</span>
                    <span class="guest-count">Guests: ${entry.guests}</span>
                    <span class="wait-time">Waiting: ${waitTime} min${waitTime !== 1 ? 's' : ''}</span>
                    <div class="remove-button-container">
                        <button class="removeButton" data-index="${index}">Remove</button>
                    </div>
                `;
                waitlist.appendChild(li);
            });
            localStorage.setItem('waitlist', JSON.stringify(waitlistData));
            waitlist.scrollTop = waitlist.scrollHeight;

            // Add this block to enable/disable the Clear All button
            if (waitlistData.length > 0) {
                clearAllButton.disabled = false;
                clearAllButton.classList.remove('disabled');
            } else {
                clearAllButton.disabled = true;
                clearAllButton.classList.add('disabled');
            }
        };

        const updateWaitTimes = () => {
            document.querySelectorAll('.wait-time').forEach((el, index) => {
                const waitTime = Math.floor((Date.now() - waitlistData[index].timestamp) / 60000);
                el.textContent = `Waiting ${waitTime} minute${waitTime !== 1 ? 's' : ''}`;
            });
        };

        setInterval(updateWaitTimes, 60000);

        clearAllButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        confirmClear.addEventListener('click', () => {
            waitlistData = [];
            updateWaitlist();
            modal.classList.add('hidden');
        });

        cancelClear.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        const showError = (element, message) => {
            element.classList.add('error');
            let errorSpan = element.nextElementSibling;
            if (!errorSpan || !errorSpan.classList.contains('error-message')) {
                errorSpan = document.createElement('span');
                errorSpan.className = 'error-message';
                element.parentNode.insertBefore(errorSpan, element.nextSibling);
            }
            errorSpan.textContent = message;
            errorSpan.classList.add('visible');
        };

        const clearError = (element) => {
            element.classList.remove('error');
            const errorSpan = element.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('error-message')) {
                errorSpan.classList.remove('visible');
            }
        };

        confirmButton.addEventListener('click', () => {
            clearErrors();
            const name = nameInput.value.trim();
            const guests = guestsInput.value;
            let isValid = true;

            if (!name) {
                showError(nameInput, 'Name is required');
                isValid = false;
            }

            if (!guests) {
                showError(guestsInput, 'Please select number of guests');
                isValid = false;
            }

            if (isValid) {
                waitlistData.push({ name, guests, timestamp: Date.now() });
                updateWaitlist();
                nameInput.value = '';
                guestsInput.selectedIndex = 0;
                nameInput.focus(); // Set focus back to the name input for the next entry
            }
        });

        waitlist.addEventListener('click', (e) => {
            if (e.target.classList.contains('removeButton')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                waitlistData.splice(index, 1);
                updateWaitlist();
            }
        });

        updateWaitlist();

        // Add this event listener for the name input
        nameInput.addEventListener('input', function() {
            if (this.value.length > 22) {
                this.value = this.value.slice(0, 0);
                showError(this, 'Name cannot exceed 22 characters');
            } else {
                clearError(this);
            }
        });

        // Modify the clearErrors function to use the new clearError function
        const clearErrors = () => {
            document.querySelectorAll('.error').forEach(el => clearError(el));
        };

    // PIN screen commented out - removed closing brace
    // }
});
