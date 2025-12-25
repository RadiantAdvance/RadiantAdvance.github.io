const portfolio = document.querySelector('.portfolio');
const tabButtons = document.querySelector('.tab-buttons');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent'); // New container for image/video
const closeBtn = document.getElementById('close');

let lastFocusedElement = null;

// ---------- FETCH DATA ----------
fetch('galleryData.json')
    .then(res => res.json())
    .then(data => {
        renderTabs(data.galleries);
        renderGallery(data.galleries);
    })
    .catch(() => {
        portfolio.innerHTML =
            '<p class="error">Artwork failed to load. Please try again later.</p>';
    });

// ---------- TABS ----------
function renderTabs(galleries) {
    galleries.forEach((gallery, index) => {
        const btn = document.createElement('button');
        btn.textContent = gallery.category;
        btn.dataset.target = gallery.category;
        btn.classList.toggle('active', index === 0);

        btn.addEventListener('click', () => switchTab(gallery.category));
        tabButtons.appendChild(btn);
    });
}

// ---------- GALLERY ----------
function renderGallery(galleries) {
    galleries.forEach((gallery, index) => {
        const section = document.createElement('section');
        section.className = 'tab-content';
        section.dataset.category = gallery.category;
        section.hidden = index !== 0;

        const grid = document.createElement('div');
        grid.className = gallery.displayMode;

        gallery.items.forEach(item => {
            if (item.mediaType === 'image') {
                grid.appendChild(createImageCard(item, gallery.category));
            } else if (item.mediaType === 'video') {
                grid.appendChild(createVideoEmbed(item));
            } else if (item.mediaType === 'audio') {
                grid.appendChild(createAudioEmbed(item));
            }
        });

        section.appendChild(grid);
        portfolio.appendChild(section);
    });
}

// ---------- IMAGE CARD ----------
function createImageCard(item, fallbackAlt) {
    const figure = document.createElement('figure');
    figure.tabIndex = 0;

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || fallbackAlt;
    img.loading = 'lazy';

    const caption = document.createElement('figcaption');
    caption.textContent = item.title || '';

    figure.appendChild(img);
    if (item.title) figure.appendChild(caption);

    figure.addEventListener('click', () => openModal('image', item.src));
    figure.addEventListener('keydown', e => {
        if (e.key === 'Enter') openModal('image', item.src);
    });

    return figure;
}

// ---------- VIDEO ----------
function createVideoEmbed(item) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('video-wrapper');

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${item.videoId}?rel=0&showinfo=0`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.title = item.title || 'Video artwork';
    wrapper.appendChild(iframe);

    wrapper.addEventListener('click', () => openModal('video', item.videoId));
    return wrapper;
}

// ---------- AUDIO ----------
function createAudioEmbed(item) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(item.trackUrl)}&auto_play=false&hide_related=true`;
    iframe.loading = 'lazy';
    iframe.title = item.title || 'Audio artwork';
    return iframe;
}

// ---------- TAB SWITCH ----------
function switchTab(category) {
    document.querySelectorAll('.tab-content').forEach(section => {
        section.hidden = section.dataset.category !== category;
    });

    document.querySelectorAll('.tab-buttons button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === category);
    });
}

// ---------- MODAL ----------
function openModal(type, src) {
    lastFocusedElement = document.activeElement;

    modalContent.innerHTML = ''; // Clear previous content

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Portfolio image';
        modalContent.appendChild(img);
    } else if (type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${src}?autoplay=1&rel=0`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        modalContent.appendChild(iframe);
    }

    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    closeBtn.focus();

    document.body.classList.add('modal-open');
    document.addEventListener('keydown', escHandler);
}

function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';

    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', escHandler);

    if (lastFocusedElement) lastFocusedElement.focus();
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});

function escHandler(e) {
    if (e.key === 'Escape') closeModal();
}
