import { User } from './User.js';

export let users = [];

const form = document.querySelector('main form');
const usersContainer = document.querySelector('.users-container');


let infinitLoading = true;


handleEventListeners();
// form.requestSubmit();
loadInfinit();


/**
 * Handles all required event listeners
 * Puts all event listeners at one place.
 */
function handleEventListeners() {
    //Users Amount input Element
    const usersAmountInput = document.getElementById('users-amount');

    /**
     * 
     * @param {*} checkMin -> true -> checks the minimum value, false - doesn't check
     * The function Makes sure the inputted user amount is between the min and max.
     */
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
    let genderFilter;
    const resultSentence = document.querySelector('.result-sentence');

    /**
     * 
     * @param {*} e -> event
     * Function that fires when the form is submitted
     * It checks all data, alerts if anything is wrong.
     * Gets users and displays them.
     */
    form.onsubmit = async e => {

        e.preventDefault();
        if (loadingUsers) return;

        handleAmountInput(true);

        let gender;
        if (genderFilter) {
            const gendersSelectInput = document.getElementById('genders');

            if (gendersSelectInput.value.length > 0) {
                gender = gendersSelectInput.value;
            } else {
                return alert('Pick a gender!');
            }
        }
        const usersAmount = usersAmountInput.value;
        loadingUsers = true;

        usersContainer.innerHTML = getSpinnerHTML();

        const s = usersAmount > 1 ? 's' : '';
        resultSentence.textContent = `Loading ${usersAmount} User${s}...`;

        await User.getRandomUsers(usersAmount, gender);
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

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} className 
     * Adds a class to the element's class list.
     */
    function addClass(element, className) {
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} className 
     * Removes a class from the element's class list.
     */
    function removeClass(element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }


    //Dark-mode toggling
    const moon = document.querySelector('.moon');
    const sun = document.querySelector('.sun');
    moon.addEventListener('click', () => {
        document.documentElement.className = 'dark-mode';
        addClass(moon, 'hidden');
        removeClass(sun, 'hidden');
    });
    sun.addEventListener('click', () => {
        document.documentElement.className = '';
        addClass(sun, 'hidden');
        removeClass(moon, 'hidden');
    });

    //filter by gender button
    const filterByGender = document.querySelector('.gender-filter');
    const noFilter = document.querySelector('input.no-filter');

    noFilter.addEventListener('click', () => {
        form.className = 'no-filter';
        genderFilter = false;
    });

    filterByGender.addEventListener('click', () => {
        form.className = 'filter-by-gender';
        genderFilter = true;
    });

    //manualy or infinit load
    const main = document.querySelector('main');
    const infinitButton = document.querySelector('input.infinit');
    const manualyButton = document.querySelector('input.manualy');
    infinitButton.addEventListener('click', () => {
        if (infinitLoading) return;
        main.className = 'inf';
        infinitLoading = true;
        users.length = 0;
        User.displayUsersOnContainer();
        loadInfinit();
    });
    manualyButton.addEventListener('click', () => {
        main.className = 'man';
        infinitLoading = false;
        users.length = 0;
        usersAmountInput.value = 5;
        form.requestSubmit();
    });
}


/**
 * 
 * Loads infinity Random Users, 
 * when user scrolls down close to bottom -> it loads 10 users.
 */
async function loadInfinit() {
    if (!infinitLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
        const usersAmountToAdd = 10;

        //Add spinner
        usersContainer.innerHTML += getSpinnerHTML();

        //Add Random users to the users array.
        await User.getRandomUsers(usersAmountToAdd, null, false);

        //Remove spinner if it exists
        if ([...usersContainer.children][[...usersContainer.children].length - 1].id == 'spinner') {
            usersContainer.removeChild(document.getElementById('spinner'));
        }

        //Display new users.
        User.displayLastUsersOnContainer(usersAmountToAdd);

    }

    setTimeout(async () => {
        await loadInfinit();
    }, 1000);
}

/**
 * 
 * @returns a spinner's html
 */
function getSpinnerHTML() {
    return '<div id="spinner" class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
}
