// Admin Panel JavaScript

// DOM Elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');
const loginForm = document.querySelector('.admin-login-form');
const addRoomBtn = document.querySelector('.add-room-btn');
const addGalleryBtn = document.querySelector('.add-gallery-btn');
const roomModal = document.querySelector('.room-modal');
const galleryModal = document.querySelector('.gallery-modal');
const closeModals = document.querySelectorAll('.close-modal');
const navLinks = document.querySelectorAll('.admin-nav a');
const modulePages = document.querySelectorAll('.module-page');

// Toggle Sidebar
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!adminSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            adminSidebar.classList.remove('active');
        }
    }
});

// Handle Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active state in navigation
        navLinks.forEach(l => l.parentElement.classList.remove('active'));
        link.parentElement.classList.add('active');
        
        // Show target module page
        modulePages.forEach(page => {
            page.classList.remove('active');
            if (page.id === targetId) {
                page.classList.add('active');
            }
        });

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            adminSidebar.classList.remove('active');
        }
    });
});

// Close Modals
closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        roomModal.classList.remove('active');
        galleryModal.classList.remove('active');
    });
});

// Open Room Modal
if (addRoomBtn) {
    addRoomBtn.addEventListener('click', () => {
        roomModal.classList.add('active');
    });
}

// Open Gallery Modal
if (addGalleryBtn) {
    addGalleryBtn.addEventListener('click', () => {
        galleryModal.classList.add('active');
    });
}

// Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const errorMessage = document.querySelector('.error-message');

        try {
            // TODO: Replace with actual API call
            const response = await mockLoginAPI(username, password);
            
            if (response.success) {
                localStorage.setItem('adminToken', response.token);
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = response.message;
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    });
}

// Handle Room Form Submission
const roomForm = document.querySelector('.room-form');
if (roomForm) {
    roomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(roomForm);
        const roomData = {
            name: formData.get('name'),
            type: formData.get('type'),
            location: formData.get('location'),
            price: formData.get('price'),
            capacity: formData.get('capacity'),
            description: formData.get('description'),
            amenities: Array.from(formData.getAll('amenities')),
            images: formData.getAll('images')
        };

        try {
            // TODO: Replace with actual API call
            const response = await mockAddRoomAPI(roomData);
            
            if (response.success) {
                showSuccessMessage('Room added successfully');
                roomModal.classList.remove('active');
                roomForm.reset();
                // Refresh room list
                loadRooms();
            } else {
                showErrorMessage(response.message);
            }
        } catch (error) {
            showErrorMessage('An error occurred. Please try again.');
        }
    });
}

// Handle Gallery Form Submission
const galleryForm = document.getElementById('add-gallery-form');
if (galleryForm) {
    galleryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(galleryForm);
        const isEdit = galleryForm.dataset.editId;
        
        const galleryData = {
            title: formData.get('gallery-title'),
            category: formData.get('gallery-category'),
            location: formData.get('gallery-location'),
            description: formData.get('gallery-description'),
            image: formData.get('gallery-image')
        };

        try {
            // TODO: Replace with actual API call
            const response = await (isEdit ? 
                mockUpdateGalleryAPI(galleryForm.dataset.editId, galleryData) : 
                mockAddGalleryAPI(galleryData));
            
            if (response.success) {
                showSuccessMessage(isEdit ? 'Image updated successfully' : 'Image added successfully');
                const modal = document.getElementById('add-gallery-modal');
                modal.classList.remove('active');
                galleryForm.reset();
                delete galleryForm.dataset.editId;
                loadGallery();
            } else {
                showErrorMessage(response.message);
            }
        } catch (error) {
            showErrorMessage('An error occurred. Please try again.');
        }
    });
}

// Handle Cancel Buttons
document.querySelectorAll('.form-actions button[type="button"]').forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.admin-modal');
        if (modal) {
            modal.classList.remove('active');
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                delete form.dataset.editId;
            }
        }
    });
});

// Load Rooms
async function loadRooms() {
    try {
        // TODO: Replace with actual API call
        const rooms = await mockGetRoomsAPI();
        const roomList = document.querySelector('.room-list');
        
        if (roomList) {
            roomList.innerHTML = rooms.map(room => `
                <div class="room-card">
                    <img src="${room.image}" alt="${room.name}">
                    <div class="room-info">
                        <h3>${room.name}</h3>
                        <p>${room.type} - ${room.location}</p>
                        <p>$${room.price}/night</p>
                        <div class="room-actions">
                            <button class="room-action-btn edit" onclick="editRoom(${room.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="room-action-btn delete" onclick="deleteRoom(${room.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        showErrorMessage('Failed to load rooms');
    }
}

// Load Gallery
async function loadGallery() {
    try {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            galleryGrid.classList.add('loading');
            
            // TODO: Replace with actual API call
            const gallery = await mockGetGalleryAPI();
            
            galleryGrid.innerHTML = gallery.map(item => `
                <div class="gallery-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="gallery-item-info">
                        <h3>${item.title}</h3>
                        <p>${item.category} • ${item.location}</p>
                        <div class="gallery-actions">
                            <button class="gallery-action-btn edit" onclick="editGalleryItem(${item.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="gallery-action-btn delete" onclick="deleteGalleryItem(${item.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        showErrorMessage('Failed to load gallery');
    } finally {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            galleryGrid.classList.remove('loading');
        }
    }
}

// Edit Gallery Item
async function editGalleryItem(id) {
    try {
        // TODO: Replace with actual API call
        const item = await mockGetGalleryItemAPI(id);
        
        // Populate form with item data
        const form = document.getElementById('add-gallery-form');
        form.querySelector('#gallery-title').value = item.title;
        form.querySelector('#gallery-category').value = item.category;
        form.querySelector('#gallery-location').value = item.location;
        form.querySelector('#gallery-description').value = item.description;
        
        // Show modal
        const modal = document.getElementById('add-gallery-modal');
        modal.classList.add('active');
        
        // Update form title and button
        modal.querySelector('.modal-header h3').textContent = 'Edit Gallery Image';
        modal.querySelector('.form-actions button[type="submit"]').textContent = 'Update Image';
        
        // Store item ID for update
        form.dataset.editId = id;
    } catch (error) {
        showErrorMessage('Failed to load gallery item');
    }
}

// Delete Gallery Item
async function deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        try {
            // TODO: Replace with actual API call
            const response = await mockDeleteGalleryAPI(id);
            
            if (response.success) {
                showSuccessMessage('Image deleted successfully');
                loadGallery(); // Refresh gallery
            } else {
                showErrorMessage(response.message);
            }
        } catch (error) {
            showErrorMessage('Failed to delete image');
        }
    }
}

// Mock API Functions (Replace with actual API calls)
async function mockLoginAPI(username, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'password') {
                resolve({
                    success: true,
                    token: 'mock-token'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Invalid username or password'
                });
            }
        }, 1000);
    });
}

async function mockAddRoomAPI(roomData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Room added successfully'
            });
        }, 1000);
    });
}

async function mockAddGalleryAPI(galleryData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Image added successfully'
            });
        }, 1000);
    });
}

async function mockGetRoomsAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    name: 'Lake View Suite',
                    type: 'Suite',
                    location: 'Sawela Lodges',
                    price: 250,
                    image: 'images/rooms/lake-view-suite.jpg'
                },
                {
                    id: 2,
                    name: 'Deluxe Room',
                    type: 'Standard',
                    location: 'Capella Resort',
                    price: 180,
                    image: 'images/rooms/deluxe-room.jpg'
                }
            ]);
        }, 1000);
    });
}

async function mockGetGalleryAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: 'Lake View',
                    category: 'Exterior',
                    image: 'images/gallery/lake-view.jpg'
                },
                {
                    id: 2,
                    title: 'Swimming Pool',
                    category: 'Amenities',
                    image: 'images/gallery/pool.jpg'
                }
            ]);
        }, 1000);
    });
}

async function mockGetGalleryItemAPI(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: id,
                title: 'Lake View',
                category: 'Exterior',
                location: 'Sawela Lodges',
                description: 'Beautiful view of the lake',
                image: 'images/gallery/lake-view.jpg'
            });
        }, 500);
    });
}

async function mockUpdateGalleryAPI(id, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Image updated successfully'
            });
        }, 1000);
    });
}

async function mockDeleteGalleryAPI(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Image deleted successfully'
            });
        }, 1000);
    });
}

// Initialize Dashboard
if (document.querySelector('.admin-dashboard')) {
    // Show dashboard page by default
    document.getElementById('dashboard').classList.add('active');
    
    // Load initial data
    loadRooms();
    loadGallery();
} 