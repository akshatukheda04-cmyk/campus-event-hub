
const defaultEvents = [
    {
        id: 1,
        name: "Tech Fest 2026",
        date: "2026-11-15",
        location: "College Auditorium",
        description: "Explore technology, innovation and exciting projects."
    },
    {
        id: 2,
        name: "Coding Competition",
        date: "2026-11-20",
        location: "Computer Lab",
        description: "Test your programming and problem-solving skills."
    },
    {
        id: 3,
        name: "Cultural Festival",
        date: "2026-11-25",
        location: "College Ground",
        description: "Celebrate music, dance, art and campus life."
    }
];

function loadSavedEvents() {
    try {
        const saved = localStorage.getItem("campusHubEvents");
        return saved ? JSON.parse(saved) : defaultEvents;
    } catch {
        return defaultEvents;
    }
}

let events = loadSavedEvents();

function saveEvents() {
    try {
        localStorage.setItem("campusHubEvents", JSON.stringify(events));
    } catch {
        alert("Unable to save events in this browser.");
    }
}

function renderEvents() {
    const eventContainer = document.querySelector(".events");
    const eventSelect = document.querySelector("#register select");

    if (!eventContainer || !eventSelect) {
        console.error("Events container or registration dropdown not found.");
        return;
    }

    eventContainer.replaceChildren();
    eventSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose an event";
    eventSelect.appendChild(placeholder);

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = event.name;

        const date = document.createElement("p");
        date.textContent = `📅 ${event.date}`;

        const location = document.createElement("p");
        location.textContent = `📍 ${event.location}`;

        const description = document.createElement("p");
        description.textContent = event.description;

        card.append(title, date, location, description);
        eventContainer.appendChild(card);

        const option = document.createElement("option");
        option.value = event.id;
        option.textContent = event.name;
        eventSelect.appendChild(option);
    });
}

// Admin: add a new event
const adminForm = document.querySelector("#admin-form");

if (adminForm) {
    adminForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.querySelector("#admin-event-name").value.trim();
        const date = document.querySelector("#admin-event-date").value;
        const location = document.querySelector("#admin-event-location").value.trim();
        const description = document.querySelector("#admin-event-description").value.trim();

        if (!name || !date || !location || !description) {
            alert("Please fill in all event details.");
            return;
        }

        events.push({
            id: Date.now(),
            name,
            date,
            location,
            description
        });

        saveEvents();
        renderEvents();
        adminForm.reset();

        alert("Event added successfully!");
    });
}

// Student registration
const registrationForm = document.querySelector("#register form");

if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fields = registrationForm.querySelectorAll("input");
        const name = fields[0]?.value.trim();
        const email = fields[1]?.value.trim();
        const eventId = document.querySelector("#register select")?.value;

        if (!name || !email || !eventId) {
            alert("Please enter your name, email, and choose an event.");
            return;
        }

        const selectedEvent = events.find(item => String(item.id) === eventId);

        if (!selectedEvent) {
            alert("Please choose a valid event.");
            return;
        }

        let registrations = [];

        try {
            registrations = JSON.parse(
                localStorage.getItem("campusHubRegistrations") || "[]"
            );
        } catch {
            registrations = [];
        }

        const alreadyRegistered = registrations.some(
            registration =>
                registration.email.toLowerCase() === email.toLowerCase() &&
                registration.eventId === selectedEvent.id
        );

        if (alreadyRegistered) {
            alert("This email is already registered for this event.");
            return;
        }

        registrations.push({
            name,
            email,
            eventId: selectedEvent.id
        });

        localStorage.setItem(
            "campusHubRegistrations",
            JSON.stringify(registrations)
        );

        registrationForm.reset();
        alert(`Registration successful for ${selectedEvent.name}!`);
    });
}

renderEvents();
