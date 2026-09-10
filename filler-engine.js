/**
 * Faker Engine - Realistic English Dummy Data Generator
 * Lightweight, zero-dependency, rich mock data generator.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        const engine = factory();
        root.FillerEngine = engine;
        root.FakerEngine = engine; // backwards compatibility
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const firstNamesMale = [
        'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
        'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald',
        'Mark', 'Paul', 'Steven', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian',
        'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
        'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott',
        'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Patrick',
        'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan'
    ];

    const firstNamesFemale = [
        'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
        'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra',
        'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy', 'Carol',
        'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura',
        'Cynthia', 'Kathleen', 'Amy', 'Shirley', 'Angela', 'Helen', 'Anna', 'Brenda',
        'Pamela', 'Nicole', 'Emma', 'Samantha', 'Katherine', 'Christine', 'Debra',
        'Rachel', 'Catherine', 'Carolyn', 'Janet', 'Ruth', 'Maria', 'Heather', 'Diane'
    ];

    const allFirstNames = [...firstNamesMale, ...firstNamesFemale];

    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
        'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
        'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
        'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
        'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
        'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
        'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz'
    ];

    const streets = [
        'Main Street', 'Highland Avenue', 'Oak Street', 'Maple Avenue', 'Cedar Lane',
        'Elm Street', 'Washington Boulevard', 'Lakeview Drive', 'Park Avenue',
        'Sunset Boulevard', 'Pine Street', 'Lincoln Way', 'Broadway', 'Market Street',
        'Chestnut Street', 'Church Road', 'Springfield Road', 'River Road', 'Valley View Dr'
    ];

    const cities = [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
        'San Antonio', 'San Diego', 'Dallas', 'Austin', 'San Jose', 'Fort Worth',
        'Jacksonville', 'Columbus', 'Charlotte', 'Indianapolis', 'San Francisco',
        'Seattle', 'Denver', 'Washington', 'Boston', 'Nashville', 'Portland', 'Las Vegas'
    ];

    const states = [
        { name: 'California', code: 'CA' },
        { name: 'New York', code: 'NY' },
        { name: 'Texas', code: 'TX' },
        { name: 'Florida', code: 'FL' },
        { name: 'Illinois', code: 'IL' },
        { name: 'Pennsylvania', code: 'PA' },
        { name: 'Ohio', code: 'OH' },
        { name: 'Georgia', code: 'GA' },
        { name: 'North Carolina', code: 'NC' },
        { name: 'Michigan', code: 'MI' },
        { name: 'Washington', code: 'WA' },
        { name: 'Colorado', code: 'CO' },
        { name: 'Massachusetts', code: 'MA' },
        { name: 'Arizona', code: 'AZ' }
    ];

    const companies = [
        'Acme Corporation', 'Apex Global Systems', 'Starlight Technologies', 'Nexus Dynamics',
        'Omni Consumer Tech', 'Initech Software', 'Pinnacle Solutions', 'Cyberdyne Labs',
        'Vanguard Enterprises', 'Stark Industries', 'Wayne Technologies', 'Globex Corporation',
        'Bluefin Logistics', 'Synergy Partners', 'Atlas Capital', 'Horizon Media'
    ];

    const jobTitles = [
        'Software Engineer', 'Senior Frontend Developer', 'Backend Architect',
        'Product Manager', 'QA Automation Engineer', 'DevOps Specialist',
        'UI/UX Designer', 'Data Scientist', 'Technical Lead', 'Scrum Master',
        'Marketing Manager', 'Operations Director', 'Sales Account Executive',
        'Customer Success Lead', 'Business Analyst', 'Security Engineer'
    ];

    const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
        'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
        'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur',
        'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt',
        'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    const reviewSentences = [
        'Great overall experience, highly recommended for everyday productivity.',
        'The interface is intuitive and setup took less than two minutes.',
        'Impressed by the quality and attention to detail throughout the product.',
        'Works exactly as expected with smooth performance and zero hiccups.',
        'Customer support was responsive and answered all my technical questions.',
        'A reliable solution that saved our team countless hours of repetitive work.',
        'Clean layout, fast response times, and well-thought-out features.'
    ];

    // Helper functions
    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function padZero(num, size = 2) {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    function randomString(length = 8, chars = 'abcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Luhn algorithm helper to generate valid test credit card numbers
    function generateLuhnNumber(prefix, length) {
        let ccNumber = prefix;
        while (ccNumber.length < (length - 1)) {
            ccNumber += Math.floor(Math.random() * 10);
        }

        // Calculate Luhn check digit
        let sum = 0;
        let alternate = true;
        for (let i = ccNumber.length - 1; i >= 0; i--) {
            let n = parseInt(ccNumber.charAt(i), 10);
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }

        const checkDigit = (10 - (sum % 10)) % 10;
        return ccNumber + checkDigit;
    }

    const FakerEngine = {
        // Names
        firstName(gender = 'any') {
            if (gender === 'male') return randomItem(firstNamesMale);
            if (gender === 'female') return randomItem(firstNamesFemale);
            return randomItem(allFirstNames);
        },

        lastName() {
            return randomItem(lastNames);
        },

        fullName(gender = 'any') {
            return `${this.firstName(gender)} ${this.lastName()}`;
        },

        username(baseName = '') {
            const first = baseName ? baseName.toLowerCase().replace(/[^a-z0-9]/g, '') : randomItem(allFirstNames).toLowerCase();
            const last = randomItem(lastNames).toLowerCase();
            const styles = [
                `${first}.${last}`,
                `${first}_${last}`,
                `${first.charAt(0)}${last}${randomNumber(10, 99)}`,
                `${first}${randomNumber(100, 999)}`,
                `${last}_${first.charAt(0)}`
            ];
            return randomItem(styles);
        },

        // Emails
        email(options = {}) {
            const domain = options.domain || randomItem(['example.com', 'testmail.dev', 'dummymail.org', 'fakemail.io']);
            const first = (options.firstName || randomItem(allFirstNames)).toLowerCase().replace(/[^a-z0-9]/g, '');
            const last = (options.lastName || randomItem(lastNames)).toLowerCase().replace(/[^a-z0-9]/g, '');
            const styles = [
                `${first}.${last}@${domain}`,
                `${first}_${last}@${domain}`,
                `${first}${last.charAt(0)}${randomNumber(1, 99)}@${domain}`,
                `${first}.${last}${randomNumber(10, 99)}@${domain}`
            ];
            return randomItem(styles);
        },

        // Passwords
        password(options = {}) {
            if (options.presetPassword) {
                return options.presetPassword;
            }
            const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
            const lower = 'abcdefghijkmnpqrstuvwxyz';
            const digits = '23456789';
            const symbols = '!@#$%^&*';

            let pwd = randomString(3, upper) + randomString(4, lower) + randomString(2, digits) + randomString(1, symbols);
            // Shuffle
            return pwd.split('').sort(() => 0.5 - Math.random()).join('');
        },

        // Phone numbers (US / International format)
        phoneNumber(format = 'formatted') {
            const area = randomNumber(201, 989);
            const mid = randomNumber(201, 989);
            const last = randomNumber(1000, 9999);
            if (format === 'clean') {
                return `${area}${mid}${last}`;
            }
            if (format === 'international') {
                return `+1-${area}-${mid}-${last}`;
            }
            return `(${area}) ${mid}-${last}`;
        },

        // Address & Geography
        streetAddress() {
            const num = randomNumber(10, 9999);
            return `${num} ${randomItem(streets)}`;
        },

        city() {
            return randomItem(cities);
        },

        state(returnCode = false) {
            const st = randomItem(states);
            return returnCode ? st.code : st.name;
        },

        zipCode() {
            return randomNumber(10001, 99950) + '';
        },

        country() {
            return 'United States';
        },

        countryCode() {
            return 'US';
        },

        // Company & Work
        company() {
            return randomItem(companies);
        },

        jobTitle() {
            return randomItem(jobTitles);
        },

        department() {
            return randomItem(['Engineering', 'Product', 'Design', 'QA & Testing', 'Marketing', 'Operations', 'Finance', 'Human Resources']);
        },

        // Internet & Tech
        url() {
            const slug = randomItem(['dashboard', 'projects', 'docs', 'profile', 'app', 'settings']);
            const domain = randomItem(['example.com', 'testsite.dev', 'acme.io', 'democorp.org']);
            return `https://${domain}/${slug}`;
        },

        ipv4() {
            return `${randomNumber(10, 220)}.${randomNumber(1, 254)}.${randomNumber(1, 254)}.${randomNumber(1, 254)}`;
        },

        uuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        // Finance & Cards
        creditCard(type = 'visa') {
            // Generates valid Luhn numbers
            if (type.toLowerCase() === 'mastercard') {
                const prefix = randomItem(['51', '52', '53', '54', '55']);
                return generateLuhnNumber(prefix, 16);
            }
            if (type.toLowerCase() === 'amex') {
                const prefix = randomItem(['34', '37']);
                return generateLuhnNumber(prefix, 15);
            }
            // Default to Visa
            return generateLuhnNumber('4', 16);
        },

        creditCardFormatted(type = 'visa') {
            const num = this.creditCard(type);
            if (num.length === 15) {
                // Amex 4-6-5
                return `${num.slice(0, 4)} ${num.slice(4, 10)} ${num.slice(10)}`;
            }
            // 4-4-4-4
            return num.match(/.{1,4}/g).join(' ');
        },

        creditCardExp() {
            const month = padZero(randomNumber(1, 12));
            const year = randomNumber(26, 32);
            return `${month}/${year}`;
        },

        creditCardCVV() {
            return randomNumber(100, 999) + '';
        },

        // Dates & Times
        dateOfBirth(minAge = 18, maxAge = 65) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const birthYear = randomNumber(currentYear - maxAge, currentYear - minAge);
            const birthMonth = padZero(randomNumber(1, 12));
            const birthDay = padZero(randomNumber(1, 28));
            return `${birthYear}-${birthMonth}-${birthDay}`;
        },

        futureDate(daysAhead = 30) {
            const d = new Date();
            d.setDate(d.getDate() + randomNumber(1, daysAhead));
            const year = d.getFullYear();
            const month = padZero(d.getMonth() + 1);
            const day = padZero(d.getDate());
            return `${year}-${month}-${day}`;
        },

        time() {
            const hours = padZero(randomNumber(8, 20));
            const minutes = padZero(randomItem([0, 15, 30, 45]));
            return `${hours}:${minutes}`;
        },

        dateTimeLocal() {
            return `${this.futureDate(14)}T${this.time()}`;
        },

        // Numbers & Quantities
        number(min = 1, max = 100) {
            return randomNumber(min, max);
        },

        price(min = 10, max = 500) {
            return (randomNumber(min, max) + (randomNumber(0, 99) / 100)).toFixed(2);
        },

        color() {
            const colors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6', '#f97316'];
            return randomItem(colors);
        },

        // Text & Paragraphs
        loremSentence(minWords = 6, maxWords = 12) {
            const count = randomNumber(minWords, maxWords);
            const words = [];
            for (let i = 0; i < count; i++) {
                words.push(randomItem(loremWords));
            }
            const s = words.join(' ');
            return s.charAt(0).toUpperCase() + s.slice(1) + '.';
        },

        loremParagraph(numSentences = 3) {
            const sentences = [];
            for (let i = 0; i < numSentences; i++) {
                sentences.push(randomItem(reviewSentences));
            }
            return sentences.join(' ');
        }
    };

    return FakerEngine;
}));
