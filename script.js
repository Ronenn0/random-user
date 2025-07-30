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

        const usersAmount = usersAmountInput.value;
        loadingUsers = true;

        const s = usersAmount > 1 ? 's' : '';
        resultSentence.textContent = `Loading ${usersAmount} User${s}...`;

        await User.getRandomUsers(usersAmount);
        User.displayUsersOnContainer();

        resultSentence.textContent = `Loaded ${usersAmount} User${s}`;
        loadingUsers = false;
    };
}