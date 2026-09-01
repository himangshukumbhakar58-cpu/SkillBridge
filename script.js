// Mock Data Definition
const mockData = {
    user: {
        name: "Himangshu",
        type: "college_student", // "college_student" or "open_user"
        college: "Engineering Institute",
        trustScore: 95,
        badges: ["Verified Student", "Top Buyer"]
    },
    marketplace: [
        { id: 1, title: "Engineering Mathematics Volume 1", type: "Book", price: 250, seller: "Rahul", rating: 4.8 },
        { id: 2, title: "Physics Lab Manual", type: "Notes", price: 100, seller: "Priya", rating: 4.5 },
        { id: 3, title: "Drafting Kit (Complete)", type: "Tool", price: 500, seller: "Amit", rating: 4.9 },
        { id: 4, title: "Data Structures in C", type: "Book", price: 300, seller: "Sneha", rating: 4.2 }
    ],
    mentors: [
        { id: 1, name: "Arjun K.", skill: "Web Development (React)", level: "Top Mentor", price: "Paid (₹500/hr)", rating: 4.9 },
        { id: 2, name: "Neha S.", skill: "UI/UX Design", level: "New Mentor", price: "Free", rating: 4.5 },
        { id: 3, name: "Vikram P.", skill: "Advanced Mathematics", level: "Top Mentor", price: "Paid (₹300/hr)", rating: 4.8 },
        { id: 4, name: "Ananya D.", skill: "Python for Beginners", level: "New Mentor", price: "Free", rating: 4.6 }
    ]
};

// Global App State
let currentUser = null;

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Vanta.js 3D Canvas
    if (window.VANTA && window.VANTA.NET) {
        window.VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x60a5fa,
            backgroundColor: 0x0f172a,
            points: 15.00,
            maxDistance: 22.00,
            spacing: 16.00
        });
    }

    // Initialize 3D Tilt on Auth Card
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelector(".auth-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

    // Initial View State: Auth View Active
    document.getElementById('auth-view').classList.add('active');
    document.getElementById('app-view').classList.remove('active');
    
    // GSAP Auth Card entrance animation
    if (window.gsap) {
        gsap.from(".auth-card", { y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.7)" });
    }

    // Setup event listeners for navbar navigation
    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(e.currentTarget.dataset.target);
        });
    });
});

// Authentication Logic
function login(userType) {
    if (userType === 'college_student') {
        currentUser = { ...mockData.user };
    } else {
        currentUser = {
            name: "Guest User",
            type: "open_user",
            college: "Not Verified",
            trustScore: 0,
            badges: []
        };
    }
    
    // Update User Interface
    updateUIForUser();
    
    // Switch View to Main App
    document.getElementById('auth-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    
    // Navigate to Dashboard
    navigate('dashboard');
}

function logout() {
    currentUser = null;
    document.getElementById('app-view').classList.remove('active');
    document.getElementById('auth-view').classList.add('active');
    if (window.gsap) {
        gsap.from(".auth-card", { y: 30, opacity: 0, duration: 0.5, ease: "power2.out" });
    }
}

function updateUIForUser() {
    if (!currentUser) return;

    // Set User Name & College Info
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('dash-user-name').textContent = currentUser.name;
    document.getElementById('prof-name').textContent = currentUser.name;
    document.getElementById('prof-college').textContent = currentUser.college;
    document.getElementById('prof-score').textContent = currentUser.trustScore;
    
    // Update User Role Badge in Navbar
    const badgeEl = document.getElementById('user-badge');
    if (currentUser.type === 'college_student') {
        badgeEl.textContent = 'Verified Student';
        badgeEl.className = 'badge badge-student';
    } else {
        badgeEl.textContent = 'Open User';
        badgeEl.className = 'badge badge-open';
    }
    
    // Toggle Student-Only Features & Buttons
    const studentOnlyElements = document.querySelectorAll('.student-only');
    studentOnlyElements.forEach(el => {
        if (currentUser.type === 'college_student') {
            if (el.tagName === 'A') {
                el.style.display = 'flex';
            } else if (el.tagName === 'BUTTON') {
                el.style.display = 'inline-flex';
            } else {
                el.style.display = 'block';
            }
        } else {
            el.style.display = 'none';
        }
    });
    
    // Render Profile Badges
    const badgesContainer = document.getElementById('prof-badges');
    badgesContainer.innerHTML = '';
    currentUser.badges.forEach(badge => {
        const span = document.createElement('span');
        span.className = 'badge badge-student';
        span.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${badge}`;
        badgesContainer.appendChild(span);
    });
    
    // Render Marketplace & Mentors Data
    renderMarketplace();
    renderMentors(mockData.mentors);
}

// SPA Navigation Router
function navigate(targetId) {
    // Update Navbar Active State
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.target) {
            link.classList.remove('active');
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            }
        }
    });

    // Hide all page sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Activate targeted page section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // GSAP entrance animation for section elements
        if (window.gsap) {
            gsap.from(targetSection.querySelectorAll('.card, .header-banner, .section-header'), {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }
}

// Dynamic Marketplace Rendering
function renderMarketplace() {
    const container = document.getElementById('marketplace-container');
    if (!container) return;
    container.innerHTML = '';
    
    mockData.marketplace.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card item-card';
        card.innerHTML = `
            <span class="item-badge">${item.type}</span>
            <h3 class="item-title">${item.title}</h3>
            <div class="item-price">₹${item.price}</div>
            <div class="item-seller">
                <i class="fa-solid fa-circle-user"></i> ${item.seller} 
                <span class="ms-auto"><i class="fa-solid fa-star"></i> ${item.rating}</span>
            </div>
            <button class="btn btn-outline w-100 mt-auto" onclick="openPayment('₹${item.price}')">
                Contact Seller
            </button>
        `;
        container.appendChild(card);
    });
    
    // Apply 3D Tilt Effect to Marketplace Cards
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".item-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.1
        });
    }
}

// Dynamic Mentors Rendering & Search
function renderMentors(mentorsList) {
    const container = document.getElementById('mentors-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (mentorsList.length === 0) {
        container.innerHTML = `<p class="text-gray text-center w-100 py-4">No mentors found matching your search.</p>`;
        return;
    }

    mentorsList.forEach(mentor => {
        const levelClass = mentor.level === 'Top Mentor' ? 'level-top' : 'level-new';
        const card = document.createElement('div');
        card.className = 'card mentor-card';
        card.innerHTML = `
            <div class="mentor-avatar">${mentor.name.charAt(0)}</div>
            <h3 class="mentor-name">${mentor.name}</h3>
            <p class="mentor-skill">${mentor.skill}</p>
            <span class="mentor-level ${levelClass}">${mentor.level}</span>
            <div class="mb-3 text-sm">
                <i class="fa-solid fa-star text-yellow"></i> ${mentor.rating}
                <span class="text-gray ml-2">| ${mentor.price}</span>
            </div>
            <button class="btn btn-primary w-100" onclick="openPayment('${mentor.price}')">
                Book Session
            </button>
        `;
        container.appendChild(card);
    });
    
    // Apply 3D Tilt Effect to Mentor Cards
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".mentor-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.1
        });
    }
}

function filterMentors(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = mockData.mentors.filter(m => 
        m.name.toLowerCase().includes(lowerQuery) || 
        m.skill.toLowerCase().includes(lowerQuery)
    );
    renderMentors(filtered);
}

// Payment Modal Controls
function openPayment(amount) {
    if (amount === 'Free') {
        alert('Session booked successfully for Free! Check your profile/email for booking details.');
        return;
    }
    document.getElementById('pay-amount').textContent = amount;
    document.getElementById('payment-modal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function completePayment() {
    closeModal('payment-modal');
    alert('Payment Completed! The seller/mentor has been notified and will contact you shortly.');
}

// Teach Form Submission Handler
function handleTeachSubmit(e) {
    e.preventDefault();
    alert('Mentor application submitted successfully! Our team will review your application.');
    e.target.reset();
}
