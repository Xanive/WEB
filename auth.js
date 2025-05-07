// Initialize user and registered users from localStorage
let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
let registeredUsers = localStorage.getItem("registeredUsers") ? JSON.parse(localStorage.getItem("registeredUsers")) : [];

// Get the base path for GitHub Pages
const getBasePath = () => {
    const path = window.location.pathname;
    // Check if we're on GitHub Pages
    if (path.includes('/hiPython/')) {
        return '/hiPython/';
    }
    return '/';
};

// Update header based on user state
function updateHeaderForUser() {
    const authArea = document.getElementById("authArea");
    if (!authArea) return; // Guard against missing element
    
    if (user) {
        authArea.innerHTML = `
            <div class="profile-dropdown">
                <button class="btn" onclick="toggleDropdown(event)">
                    <img src="${user.profilePicture||'https://via.placeholder.com/32'}" class="profile-picture" />
                    ${user.displayName}
                </button>
                <div class="dropdown-content" id="profileDropdown">
                    <label for="editName">Display Name:</label>
                    <input type="text" id="editName" value="${user.displayName}" />
                    <div class="profile-pic-upload">
                        <label>
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                            Change Profile Picture
                            <input type="file" id="profilePicFile" accept="image/*" onchange="handleProfilePicChange(event)" />
                        </label>
                    </div>
                    <button class="btn" onclick="saveProfile()">Save Changes</button>
                    <hr />
                    <button class="btn logout" onclick="logoutUser()">Logout</button>
                </div>
            </div>`;
    } else {
        authArea.innerHTML = `
            <button class="btn" onclick="openModal('loginModal')">Login</button>
            <button class="btn" onclick="openModal('registerModal')">Register</button>
        `;
    }
}

// Login functionality
function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const foundUser = registeredUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
        user = foundUser;
        localStorage.setItem('user', JSON.stringify(user));
        updateHeaderForUser();
        closeModal('loginModal');
        document.getElementById('loginForm').reset();
        
        // Redirect to home page after successful login
        window.location.href = getBasePath();
    } else {
        alert('Invalid username or password');
    }
}

// Registration functionality
function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const displayName = document.getElementById('registerDisplayName').value;
    
    if (!username || !password || !displayName) {
        alert('Please fill in all fields');
        return;
    }
    
    if (registeredUsers.some(u => u.username === username)) {
        alert('Username already exists');
        return;
    }
    
    const newUser = {
        username,
        password,
        displayName,
        profilePicture: null
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    user = newUser;
    localStorage.setItem('user', JSON.stringify(user));
    
    updateHeaderForUser();
    closeModal('registerModal');
    document.getElementById('registerForm').reset();
    
    // Redirect to home page after successful registration
    window.location.href = getBasePath();
}

// Profile management
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('profileDropdown');
    if (!dropdown) return;
    
    dropdown.classList.toggle('active');
    
    // Add click event listener to document
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && !e.target.closest('.btn')) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = event => {
            user.profilePicture = event.target.result;
            localStorage.setItem('user', JSON.stringify(user));
            updateHeaderForUser();
        };
        reader.readAsDataURL(file);
    }
}

function saveProfile() {
    const newName = document.getElementById('editName').value.trim();
    if (newName) {
        user.displayName = newName;
        localStorage.setItem('user', JSON.stringify(user));
        updateHeaderForUser();
    }
}

function logoutUser() {
    user = null;
    localStorage.removeItem('user');
    updateHeaderForUser();
    // Redirect to home page after logout
    window.location.href = getBasePath();
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderForUser();
    
    // Add event listeners for forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginUser();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registerUser();
        });
    }
});

// Interactive Background
function createInteractiveBackground() {
    const bg = document.getElementById('interactive-bg');
    if (!bg) return;

    const numLogos = 45;
    const connections = [];
    let logos = [];
    let mouseX = 0;
    let mouseY = 0;

    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Create Python logos
    for (let i = 0; i < numLogos; i++) {
        const logo = document.createElement('div');
        logo.className = 'python-logo';
        logo.innerHTML = '<svg viewBox="0 0 128 128"><path d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137h-33.961c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491v-11.282c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548v-23.513c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zm-13.354 7.569c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/><path d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655h-24.665c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412h-24.664v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zm-13.873 59.547c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/></svg>';
        
        // Random position
        const x = Math.random() * (window.innerWidth - 40);
        const y = Math.random() * (window.innerHeight - 40);
        logo.style.left = x + 'px';
        logo.style.top = y + 'px';
        
        // Random movement
        const speed = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        
        logos.push({ element: logo, x, y, speed });
        bg.appendChild(logo);
    }

    // Create SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('connection-line');
    svg.style.width = '100%';
    svg.style.height = '100%';
    bg.insertBefore(svg, bg.firstChild);

    function updateConnections() {
        // Clear existing connections
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Create new connections
        for (let i = 0; i < logos.length; i++) {
            for (let j = i + 1; j < logos.length; j++) {
                const distance = Math.hypot(
                    logos[i].x - logos[j].x,
                    logos[i].y - logos[j].y
                );

                if (distance < 200) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', logos[i].x + 20);
                    line.setAttribute('y1', logos[i].y + 20);
                    line.setAttribute('x2', logos[j].x + 20);
                    line.setAttribute('y2', logos[j].y + 20);
                    line.setAttribute('stroke', 'rgba(255, 186, 222, ' + (1 - distance / 200) + ')');
                    line.setAttribute('stroke-width', '1.5');
                    svg.appendChild(line);
                }
            }
        }
    }

    function animate() {
        logos = logos.map(logo => {
            // Update position
            logo.x += logo.speed.x;
            logo.y += logo.speed.y;

            // Mouse interaction
            const dx = mouseX - logo.x;
            const dy = mouseY - logo.y;
            const distance = Math.hypot(dx, dy);
            
            if (distance < 200) {
                const force = (200 - distance) / 200;
                logo.x -= dx * force * 0.05;
                logo.y -= dy * force * 0.05;
            }

            // Bounce off walls
            if (logo.x <= 0 || logo.x >= window.innerWidth - 40) {
                logo.speed.x *= -1;
                logo.x = Math.max(0, Math.min(logo.x, window.innerWidth - 40));
            }
            if (logo.y <= 0 || logo.y >= window.innerHeight - 40) {
                logo.speed.y *= -1;
                logo.y = Math.max(0, Math.min(logo.y, window.innerHeight - 40));
            }

            // Update DOM element
            logo.element.style.left = logo.x + 'px';
            logo.element.style.top = logo.y + 'px';

            return logo;
        });

        updateConnections();
        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize interactive background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createInteractiveBackground();
}); 
