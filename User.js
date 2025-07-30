import { users } from './script.js';

export class User {
    id;
    firstName;
    lastName;
    country;
    age;
    gender;
    email;
    image;
    username;
    password;
    phoneNumber;

    constructor(userDetails) {
        this.id = userDetails.id;
        this.firstName = userDetails.firstName;
        this.lastName = userDetails.lastName;
        this.country = userDetails.country;
        this.age = userDetails.age;
        this.gender = userDetails.gender;
        this.email = userDetails.email;
        this.image = userDetails.image;
        this.username = userDetails.username;
        this.password = userDetails.password;
        this.phoneNumber = userDetails.phoneNumber
    }

    /**
     * 
     * @returns the generated .user Div's HTML.
     */
    getHTML() {
        return `
        <div class="user">
            <div class="color"></div>
            <div class="user-image-container">
                <img src="${this.image}" class="user-image" alt="User Image">
            </div>
            <div class="user-info">
                <header>
                        <span class="name" aria-label="Full name">${this.firstName} ${this.lastName}</span>
                    <span class="country" aria-label="Country">${this.country}</span>
                </header>

                <div class="middle-container">

                    <div class="left-side">
                        <div>
                            <span class="label">Username:</span>
                            <span class="username" aria-label="username">${this.username}</span>
                        </div>
                        <div>
                            <span class="label">Password:</span>
                            <span class="password" aria-label="Password">${this.password}</span>
                        </div>
                    </div>

                    <div class="right-side">
                        <div>
                            <span class="label">Gender:</span>
                            <span class="gender" aria-label="Gender">${this.gender}</span>
                        </div>
                        <div>
                            <span class="label">Age:</span>
                            <span class="age" aria-label="Age">${this.age}</span>
                            <span class="label">y/o</span>
                        </div>
                    </div>

                </div>

                <footer>
                    <div>
                        <span class="label">ID:</span>
                        <span class="id" aria-label="Id">${this.id}</span>
                    </div>
                    <div>
                        <span class="label">Phone:</span>
                        <span class="phone-number" aria-label="Phone Number">${this.phoneNumber}</span>
                    </div>
                    <div>
                        <span class="label">Email:</span>
                        <a href="mailto:${this.email}"><span class="email" aria-label="Email">${this.email}</span></a>
                    </div>

                    
                </footer>
            </div>
        </div>
        `;
    }

    /**
     * 
     * @param {number} amount 
     */
    static async getRandomUsers(amount, gender, reset = true) {
        const response = await fetch(`https://randomuser.me/api/?results=${amount}${gender ? `&gender=${gender}` : ''}`);
        const usersResult = (await response.json()).results;
        if (reset) {
            users.length = 0; // empty users
        }
        usersResult.forEach(user => {
            users.push(new User({
                id: user.id?.value || 'Not found',
                firstName: user.name.first,
                lastName: user.name.last,
                country: user.location.country,
                age: user.dob.age,
                gender: user.gender,
                email: user.email,
                image: user.picture.large,
                username: user.login.username,
                password: user.login.password,
                phoneNumber: user.cell
            }));
        });
    }

    /**
     * Displays all Random Users on page inside the .users-container Div
     */
    static displayUsersOnContainer() {
        const usersContainer = document.querySelector('.users-container');
        const html = users.reduce((HTML, user) => HTML + user.getHTML(), '');
        usersContainer.innerHTML = html;
    }

    /**
     * 
     * @param {*} amount -> amount of added users
     * This adds only the new users' htmls to the container,
     * instead of recreating all the users' html.
     */
    static displayLastUsersOnContainer(amount) {
        const usersContainer = document.querySelector('.users-container');
        let html = '';
        for (let i = users.length - amount; i < users.length; i++) {
            html += users[i].getHTML();
        }
        usersContainer.insertAdjacentHTML('beforeend', html); //apend instead of overwrite
    }

}
