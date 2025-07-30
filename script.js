import { User } from './User.js';

export let users = [];

const form = document.querySelector('main form');

handleEventListeners();
form.requestSubmit();

/**
 * Handles all required event listeners
 * Puts all event listeners at one place.
 */
function handleEventListeners() {
    //Users Amount input Element
    const usersAmountInput = document.getElementById('users-amount');

    //Makes sure the inputted user amount is between the min and max.
    function handleAmountInput(checkMin) {
        const value = Number(usersAmountInput.value);
        const min = Number(usersAmountInput.min);
        const max = Number(usersAmountInput.max);

        if (checkMin && value < min) usersAmountInput.value = min;
        if (value > max) usersAmountInput.value = max;
        usersAmountInput.value = Number(usersAmountInput.value);
    }
    usersAmountInput.oninput = () => {
        handleAmountInput();
    }

    let loadingUsers;
    const resultSentence = document.querySelector('.result-sentence');
    form.onsubmit = async e => {

        e.preventDefault();
        if (loadingUsers) return;

        handleAmountInput(true);
        const usersAmount = usersAmountInput.value;
        loadingUsers = true;

        const s = usersAmount > 1 ? 's' : '';
        resultSentence.textContent = `Loading ${usersAmount} User${s}...`;

        await User.getRandomUsers(usersAmount);
        User.displayUsersOnContainer();

        resultSentence.textContent = `Loaded ${usersAmount} User${s}`;
        loadingUsers = false;
    };

    /**
     * Downloads the users list as a JSON file
     */
    function downloadAsJson() {
        const blob = new Blob([JSON.stringify(users, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'random-users.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    //click to download as JSON
    const downloadButton = document.querySelector('.download-as-json');
    downloadButton.addEventListener('click', () => {

        if (users.length === 0) return alert("No users to download!");

        if (!confirm('Are you sure you want to download the users list?')) return;

        downloadAsJson();
    });


    //Dark-mode toggling
    const moon = document.querySelector('.moon');
    const sun = document.querySelector('.sun');
    moon.addEventListener('click', () => {
        document.documentElement.className = 'dark-mode';
        moon.classList.add('hidden');
        sun.classList.remove('hidden');
    });
    sun.addEventListener('click', () => {
        document.documentElement.className = '';
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
    });
}

