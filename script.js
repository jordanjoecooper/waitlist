document.addEventListener("DOMContentLoaded", () => {
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
  const clearAllButton = document.getElementById("clearAllButton");
  const formContainer = document.getElementById("formContainer");
  const nameInput = document.getElementById("nameInput");
  const guestsInput = document.getElementById("guestsInput");
  const confirmButton = document.getElementById("confirmButton");
  const waitlist = document.getElementById("waitlist");
  const modal = document.getElementById("modal");
  const confirmClear = document.getElementById("confirmClear");
  const cancelClear = document.getElementById("cancelClear");
  const vipToggle = document.getElementById("vipToggle");
  const locationInput = document.getElementById("locationInput");

  let waitlistData = JSON.parse(localStorage.getItem("waitlist")) || [];

  const updateWaitlist = () => {
    waitlist.innerHTML = "";
    waitlistData.forEach((entry, index) => {
        const tr = document.createElement("tr");
        if (entry.vip) {
            tr.classList.add("vip");
        }
        const waitTime = Math.floor((Date.now() - entry.timestamp) / 60000);
        tr.innerHTML = `
            <td data-label="Name">${entry.vip ? "<span>*</span>" : ""}${entry.name}</td>
            <td data-label="Guests">${entry.guests}</td>
            <td data-label="Location">${entry.location}</td>
            <td data-label="Waiting">${waitTime} min${waitTime !== 1 ? "s" : ""}</td>
            <td data-label="Action">
                <button class="removeButton" data-index="${index}">Remove</button>
            </td>
        `;
        waitlist.appendChild(tr);
    });
    localStorage.setItem("waitlist", JSON.stringify(waitlistData));

    // enable/disable the Clear All button
    if (waitlistData.length > 0) {
      clearAllButton.disabled = false;
      clearAllButton.classList.remove("disabled");
    } else {
      clearAllButton.disabled = true;
      clearAllButton.classList.add("disabled");
    }
  };

  const updateWaitTimes = () => {
    document.querySelectorAll("[data-label='Waiting']").forEach((el, index) => {
        const waitTime = Math.floor((Date.now() - waitlistData[index].timestamp) / 60000);
        el.textContent = `${waitTime} min${waitTime !== 1 ? "s" : ""}`;
    });
  };

  setInterval(updateWaitTimes, 60000);

  clearAllButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  confirmClear.addEventListener("click", () => {
    waitlistData = [];
    updateWaitlist();
    modal.classList.add("hidden");
  });

  cancelClear.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  const showError = (element, message) => {
    element.classList.add("error");
    let errorSpan = element.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains("error-message")) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error-message";
      element.parentNode.insertBefore(errorSpan, element.nextSibling);
    }
    errorSpan.textContent = message;
    errorSpan.classList.add("visible");
  };

  const clearError = (element) => {
    element.classList.remove("error");
    const errorSpan = element.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains("error-message")) {
      errorSpan.classList.remove("visible");
    }
  };

  confirmButton.addEventListener("click", () => {
    clearErrors();
    const name = nameInput.value.trim();
    const guests = guestsInput.value;
    const vip = vipToggle.checked;
    const location = locationInput.value;
    let isValid = true;

    if (!name) {
      showError(nameInput, "Name is required");
      isValid = false;
    }

    if (!guests) {
      showError(guestsInput, "Please select number of guests");
      isValid = false;
    }

    if (!location) {
      showError(locationInput, "Please select a location");
      isValid = false;
    }

    if (isValid) {
      waitlistData.push({ name, guests, vip, location, timestamp: Date.now() });
      updateWaitlist();
      nameInput.value = "";
      guestsInput.selectedIndex = 0;
      vipToggle.checked = false;
      locationInput.selectedIndex = 0;
      nameInput.focus();
    }
  });

  waitlist.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeButton")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      waitlistData.splice(index, 1);
      updateWaitlist();
    }
  });

  updateWaitlist();

  nameInput.addEventListener("input", function () {
    if (this.value.length > 22) {
      this.value = this.value.slice(0, 0);
      showError(this, "Name cannot exceed 22 characters");
    } else {
      clearError(this);
    }
  });

  const clearErrors = () => {
    document.querySelectorAll(".error").forEach((el) => clearError(el));
  };

  // PIN screen commented out - end
  // }
});
