// Fetch data from galleryData.json
fetch('galleryData.json')
    .then(response => response.json())
    .then(data => {
        // Call the function to render the gallery tabs
        renderTabs(data.galleries);
        // Call the function to render the gallery content
        renderGallery(data.galleries);
    })
    .catch(error => {
        console.error('Error loading gallery data:', error);
    });

// Function to render the tabs dynamically
function renderTabs(galleries) {
    const tabButtons = document.querySelector('.tab-buttons');
    galleries.forEach((gallery, index) => {
        const button = document.createElement('button');
        button.textContent = gallery.category;
        button.id = `tab-${gallery.category.toLowerCase().replace(/\s+/g, '-')}`;
        button.onclick = () => switchTab(gallery.category);
        
        // Highlight the first tab by default
        if (index === 0) {
            button.classList.add('active');
        }
        
        tabButtons.appendChild(button);
    });
}

// Function to render the gallery content dynamically
function renderGallery(galleries) {
    const portfolio = document.querySelector('.portfolio');
    galleries.forEach((gallery, index) => {
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('tab-content');
        contentDiv.id = `content-${gallery.category.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Display the first gallery by default
        contentDiv.style.display = index === 0 ? 'block' : 'none';
        
        const grid = document.createElement('div');
        grid.classList.add(gallery.displayMode);  // Add class for the gallery display mode (grid, list, carousel)

        gallery.items.forEach(item => {
            if (item.mediaType === 'image') {
                // Handle image galleries
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add('thumbnail');
                img.onclick = () => openModal(item.src); // Open modal on click
                grid.appendChild(img);
            } else if (item.mediaType === 'video') {
                // Handle video galleries (YouTube embed)
                const iframe = document.createElement('iframe');
                iframe.src = item.videoUrl;
                iframe.width = "100%";
                iframe.height = "315";
                iframe.frameBorder = "0";
                iframe.allowFullscreen = true;
                grid.appendChild(iframe);
            } else if (item.mediaType === 'audio') {
                // Handle audio galleries (e.g., SoundCloud)
                const audio = document.createElement('iframe');
                audio.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(item.trackUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`;
                audio.width = "100%";
                audio.height = "166";
                audio.frameBorder = "no";
                audio.scrolling = "no";
                grid.appendChild(audio);
            }
        });

        contentDiv.appendChild(grid);
        portfolio.appendChild(contentDiv);
    });
}

// Function to switch between tabs
function switchTab(category) {
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        if (tab.id === `content-${category.toLowerCase().replace(/\s+/g, '-')}`) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });

    // Update the active tab button
    const tabButtons = document.querySelectorAll('.tab-buttons button');
    tabButtons.forEach(button => {
        if (button.id === `tab-${category.toLowerCase().replace(/\s+/g, '-')}`) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Modal for image preview (optional)
function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImage.src = src;

    const closeBtn = document.getElementById('close');
    closeBtn.onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }
}
