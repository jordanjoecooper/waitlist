document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
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
                <div class="guest-info">
                    <span>${entry.name}</span>
                    <span>Guests: ${entry.guests}</span>
                </div>
                <div class="wait-time">Waiting for ${waitTime} minute${waitTime !== 1 ? 's' : ''}</div>
                <div class="remove-button-container">
                    <button class="removeButton" data-index="${index}">Remove</button>
                </div>
            `;
            waitlist.appendChild(li);
        });
        localStorage.setItem('waitlist', JSON.stringify(waitlistData));
        waitlist.scrollTop = waitlist.scrollHeight;
    };

    const updateWaitTimes = () => {
        document.querySelectorAll('.wait-time').forEach((el, index) => {
            const waitTime = Math.floor((Date.now() - waitlistData[index].timestamp) / 60000);
            el.textContent = `Waiting for ${waitTime} minute${waitTime !== 1 ? 's' : ''}`;
        });
    };

    setInterval(updateWaitTimes, 60000);

    addButton.addEventListener('click', () => {
        console.log('Add button clicked'); // Add this line
        formContainer.classList.toggle('hidden');
        if (!formContainer.classList.contains('hidden')) {
            nameInput.focus();
        }
    });

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
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = message;
        element.parentNode.insertBefore(errorSpan, element.nextSibling);
    };

    const clearErrors = () => {
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
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
            formContainer.classList.add('hidden');
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
});
