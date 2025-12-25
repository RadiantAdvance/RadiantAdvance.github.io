// Fetch gallery data
fetch('galleryData.json')
    .then(res => res.json())
    .then(data => {
        renderTabs(data.galleries);
        renderGallery(data.galleries);
    })
    .catch(err => {
        console.error('Error loading gallery data:', err);
        document.querySelector('.portfolio').innerHTML =
            '<p class="error">Artwork failed to load. Please try again later.</p>';
    });

// Render category tabs
function renderTabs(galleries) {
    const tabButtons = document.querySelector('.tab-buttons');
    galleries.forEach((gallery, i) => {
        const btn = document.createElement('button');
        btn.textContent = gallery.category;
        btn.id = `tab-${gallery.category.toLowerCase().replace(/\s+/g, '-')}`;
        btn.onclick = () => switchTab(gallery.category);
        if (i === 0) btn.classList.add('active');
        tabButtons.appendChild(btn);
    });
}

// Render gallery content
function renderGallery(galleries) {
    const portfolio = document.querySelector('.portfolio');
    galleries.forEach((gallery, i) => {
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('tab-content');
        contentDiv.id = `content-${gallery.category.toLowerCase().replace(/\s+/g, '-')}`;
        contentDiv.style.display = i === 0 ? 'block' : 'none';

        const grid = document.createElement('div');
        grid.classList.add(gallery.displayMode);

        gallery.items.forEach(item => {
            if (item.mediaType === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt || gallery.category;
                img.classList.add('thumbnail');
                img.loading = 'lazy';
                img.onclick = () => openModal(item.src);
                grid.appendChild(img);
            } else if (item.mediaType === 'video') {
                const iframe = document.createElement('iframe');
                iframe.src = item.videoUrl;
                iframe.width = "100%";
                iframe.height = "315";
                iframe.frameBorder = "0";
                iframe.allowFullscreen = true;
                grid.appendChild(iframe);
            } else if (item.mediaType === 'audio') {
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

// Switch tabs
function switchTab(category) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = tab.id === `content-${category.toLowerCase().replace(/\s+/g, '-')}` ? 'block' : 'none';
    });
    document.querySelectorAll('.tab-buttons button').forEach(btn => {
        btn.classList.toggle('active', btn.id === `tab-${category.toLowerCase().replace(/\s+/g, '-')}`);
    });
}

// Modal
function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImage.src = src;
    document.body.classList.add('modal-open');

    const closeBtn = document.getElementById('close');
    closeBtn.onclick = () => closeModal();
    modal.onclick = e => { if (e.target == modal) closeModal(); };

    document.addEventListener('keydown', escHandler);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', escHandler);
}

function escHandler(e) {
    if (e.key === 'Escape') closeModal();
}
