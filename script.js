const contacts = [];
let editIndex = -1;

const quotes = [
    "Stay positive, work hard, make it happen!",
    "Believe you can and you're halfway there.",
    "Your only limit is your mind.",
    "Dream big, work hard, stay focused.",
    "Success is not for the lazy."
];

document.addEventListener('DOMContentLoaded', () => {
    displayRandomQuote();
});

function displayRandomQuote() {
    const quoteElement = document.getElementById('quote');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.innerText = randomQuote;
}

function filterContacts() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchValue) ||
        contact.phone.includes(searchValue) ||
        contact.email.toLowerCase().includes(searchValue)
    );
    displayContacts(filteredContacts);
}

function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const birthday = document.getElementById('birthday').value;
    const profilePic = document.getElementById('profile-pic').files[0];
    const notes = document.getElementById('notes').value;
    const favorite = document.getElementById('favorite').checked;
    const socialMedia = document.getElementById('social-media').value;

    const newContact = {
        name,
        phone,
        email,
        birthday,
        profilePic: profilePic ? URL.createObjectURL(profilePic) : null,
        notes,
        favorite,
        socialMedia
    };

    if (editIndex >= 0) {
        contacts[editIndex] = newContact; // Update existing contact
        editIndex = -1; // Reset after editing
    } else {
        contacts.push(newContact); // Add new contact
    }

    displayContacts(contacts);
    document.getElementById('contact-form').reset();
    document.querySelector('button[type="submit"]').textContent = 'Add Contact'; // Reset button text

    // Fetching the new contact to save it on the server
    fetch('https://contact-app-managment-1.onrender.com/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newContact)
    })
    .then(response => {
        if (!response.ok) {
            console.log('Error:', response.statusText);
        }
        return response.json();
    })
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Error:', error));
}

function deleteContact(index) {
    contacts.splice(index, 1);
    displayContacts(contacts);
}

function editContact(index) {
    const contact = contacts[index];
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;
    document.getElementById('birthday').value = contact.birthday;
    document.getElementById('notes').value = contact.notes;
    document.getElementById('favorite').checked = contact.favorite;
    document.getElementById('social-media').value = contact.socialMedia;

    editIndex = index;
    document.querySelector('button[type="submit"]').textContent = 'Update Contact'; // Change button text
}

function displayContacts(contactsToDisplay) {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';

    contactsToDisplay.forEach((contact, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${contact.name}</strong> - ${contact.phone}<br>
            <small>Email: ${contact.email}</small><br>
            <small>Birthday: ${contact.birthday}</small><br>
            ${contact.profilePic ? `<img src="${contact.profilePic}" alt="${contact.name}'s profile picture" width="50">` : ''}
            <p>${contact.notes}</p>
            ${contact.favorite ? '<strong>⭐ Favorite</strong>' : ''}
            <p>Social Media: ${contact.socialMedia}</p>
            <button onclick="editContact(${index})">Edit</button>
            <button onclick="deleteContact(${index})">Delete</button>
            <hr>
        `;
        contactList.appendChild(li);
    });
}
