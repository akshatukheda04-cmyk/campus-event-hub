const defaultEvents = [
    {
        id: 1,
        name: "Tech Fest 2026",
        date: "2026-11-15",
        time: "10:00 AM",
        location: "College Auditorium",
        category: "Technology",
        organizer: "Campus Events Committee",
        capacity: 100,
        description: "Explore technology, innovation and exciting projects."
    },
    {
        id: 2,
        name: "Coding Competition",
        date: "2026-11-20",
        time: "11:00 AM",
        location: "Computer Lab",
        category: "Academic",
        organizer: "Computer Science Department",
        capacity: 50,
        description: "Test your programming and problem-solving skills."
    },
    {
        id: 3,
        name: "Cultural Festival",
        date: "2026-11-25",
        time: "5:00 PM",
        location: "College Ground",
        category: "Cultural",
        organizer: "Cultural Committee",
        capacity: 200,
        description: "Celebrate music, dance, art and campus life."
    }
];

const eventCategories = [
    "Technology",
    "Academic",
    "Cultural",
    "Sports",
    "Other"
];

function loadSavedEvents() {
    try {
        const saved = localStorage.getItem("campusHubEvents");
        const savedEvents = saved ? JSON.parse(saved) : defaultEvents;

        if (!Array.isArray(savedEvents)) {
            return defaultEvents;
        }

        // Add defaults for events saved before organizer and capacity were added.
        return savedEvents.map(eventItem => ({
            ...eventItem,
            category: eventItem.category || "Other",
            time: eventItem.time || "Time to be announced",
            organizer: eventItem.organizer || "Campus Events Committee",
            capacity: Number(eventItem.capacity) > 0
                ? Number(eventItem.capacity)
                : 100
        }));
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

function loadRegistrations() {
    try {
        const savedRegistrations =
            JSON.parse(localStorage.getItem("campusHubRegistrations") || "[]");

        return Array.isArray(savedRegistrations) ? savedRegistrations : [];
    } catch {
        return [];
    }
}

function getRegistrationCount(eventId) {
    const registrations = loadRegistrations();

    return registrations.filter(registration =>
        String(registration.eventId) === String(eventId)
    ).length;
}

function getAvailableSeats(eventItem) {
    const capacity = Number(eventItem.capacity) || 0;
    return Math.max(0, capacity - getRegistrationCount(eventItem.id));
}

function renderEvents() {
    const eventSection = document.querySelector("#events");
    const eventContainer = document.querySelector(".events");
    const eventSelect = document.querySelector("#register select");

    if (!eventSection || !eventContainer || !eventSelect) {
        console.error("Events section or registration dropdown not found.");
        return;
    }

    let filter = document.querySelector("#category-filter");

    if (!filter) {
        const label = document.createElement("label");
        label.htmlFor = "category-filter";
        label.textContent = "Filter events by category";
        label.style.display = "block";
        label.style.margin = "16px 0 6px";

        filter = document.createElement("select");
        filter.id = "category-filter";
        filter.setAttribute("aria-label", "Filter events by category");

        eventSection.insertBefore(label, eventContainer);
        eventSection.insertBefore(filter, eventContainer);
    }

    const previousCategory = filter.value || "all";

    filter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All categories";
    filter.appendChild(allOption);

    eventCategories.forEach(categoryName => {
        const option = document.createElement("option");
        option.value = categoryName;
        option.textContent = categoryName;
        filter.appendChild(option);
    });

    filter.value = eventCategories.includes(previousCategory)
        ? previousCategory
        : "all";

    filter.onchange = renderEvents;

    eventContainer.replaceChildren();
    eventSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose an event";
    eventSelect.appendChild(placeholder);

    events.forEach(eventItem => {
        const option = document.createElement("option");
        option.value = eventItem.id;
        option.textContent = eventItem.name;
        eventSelect.appendChild(option);
    });

    const visibleEvents = events.filter(eventItem =>
        filter.value === "all" ||
        (eventItem.category || "Other") === filter.value
    );

    if (visibleEvents.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-state";
        message.textContent = "No events found in this category.";
        eventContainer.appendChild(message);
        return;
    }

    visibleEvents.forEach(eventItem => {
        const card = document.createElement("article");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = eventItem.name;

        const category = document.createElement("p");
        category.textContent =
            `🏷️ Category: ${eventItem.category || "Other"}`;

        const date = document.createElement("p");
        date.textContent = `📅 ${eventItem.date}`;

        const time = document.createElement("p");
        time.textContent =
            `🕒 ${eventItem.time || "Time to be announced"}`;

        const location = document.createElement("p");
        location.textContent = `📍 ${eventItem.location}`;

        const description = document.createElement("p");
        description.textContent = eventItem.description;

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.className = "event-details-button";
        detailsButton.dataset.eventId = eventItem.id;
        detailsButton.textContent = "View details";

        card.append(
            title,
            category,
            date,
            time,
            location,
            description,
            detailsButton
        );

        eventContainer.appendChild(card);
    });
}

// Open the selected event's details
const eventContainer = document.querySelector(".events");
const detailsDialog = document.querySelector("#event-details-dialog");
const detailsContent = document.querySelector("#event-details-content");
const detailsTitle = document.querySelector("#event-details-title");
const closeDetailsButton = document.querySelector("#close-event-details");

if (eventContainer && detailsDialog && detailsContent && detailsTitle) {
    eventContainer.addEventListener("click", function (clickEvent) {
        const button = clickEvent.target.closest(".event-details-button");

        if (!button) {
            return;
        }

        const selectedEvent = events.find(eventItem =>
            String(eventItem.id) === button.dataset.eventId
        );

        if (!selectedEvent) {
            return;
        }

        detailsContent.replaceChildren();

        const category = document.createElement("p");
        category.textContent =
            `Category: ${selectedEvent.category || "Other"}`;

        const date = document.createElement("p");
        date.textContent = `Date: ${selectedEvent.date}`;

        const time = document.createElement("p");
        time.textContent =
            `Time: ${selectedEvent.time || "Time to be announced"}`;

        const location = document.createElement("p");
        location.textContent = `Venue: ${selectedEvent.location}`;

        const organizer = document.createElement("p");
        organizer.textContent =
            `Organizer: ${selectedEvent.organizer || "Campus Events Committee"}`;

        const description = document.createElement("p");
        description.textContent = selectedEvent.description;

        const availableSeats = getAvailableSeats(selectedEvent);
        const capacity = document.createElement("p");

        if (availableSeats > 0) {
            capacity.textContent = `Available seats: ${availableSeats}`;
        } else {
            capacity.textContent = "Registration status: Full";
        }

        detailsContent.append(
            category,
            date,
            time,
            location,
            organizer,
            description,
            capacity
        );

        detailsTitle.textContent = selectedEvent.name;
        detailsDialog.showModal();
    });
}

if (detailsDialog && closeDetailsButton) {
    closeDetailsButton.addEventListener("click", function () {
        detailsDialog.close();
    });
}

// Admin: add a new event
const adminForm = document.querySelector("#admin-form");

if (adminForm) {
    adminForm.addEventListener("submit", function (submitEvent) {
        submitEvent.preventDefault();

        const name =
            document.querySelector("#admin-event-name").value.trim();
        const date =
            document.querySelector("#admin-event-date").value;
        const location =
            document.querySelector("#admin-event-location").value.trim();
        const description =
            document.querySelector("#admin-event-description").value.trim();

        if (!name || !date || !location || !description) {
            alert("Please fill in all event details.");
            return;
        }

        events.push({
            id: Date.now(),
            name,
            date,
            time: "Time to be announced",
            location,
            category: "Other",
            organizer: "Campus Events Committee",
            capacity: 100,
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
    registrationForm.addEventListener("submit", function (submitEvent) {
        submitEvent.preventDefault();

        const fields = registrationForm.querySelectorAll("input");
        const name = fields[0]?.value.trim();
        const email = fields[1]?.value.trim();
        const eventId = document.querySelector("#register select")?.value;

        if (!name || !email || !eventId) {
            alert("Please enter your name, email, and choose an event.");
            return;
        }

        const selectedEvent = events.find(eventItem =>
            String(eventItem.id) === eventId
        );

        if (!selectedEvent) {
            alert("Please choose a valid event.");
            return;
        }

        const registrations = loadRegistrations();

        const alreadyRegistered = registrations.some(registration =>
            registration.email.toLowerCase() === email.toLowerCase() &&
            String(registration.eventId) === String(selectedEvent.id)
        );

        if (alreadyRegistered) {
            alert("This email is already registered for this event.");
            return;
        }

        if (getAvailableSeats(selectedEvent) <= 0) {
            alert("Sorry, this event is full.");
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
