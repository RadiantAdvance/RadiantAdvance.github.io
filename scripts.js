const imageList = [
    '../media/art/art1.jpg',
    '../media/art/art2.jpg',
    '../media/art/art3.jpg',
    '../media/art/art4.jpg',
    // Add more images as needed
];

const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.getElementById('close');

imageList.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Artwork';
    img.classList.add('thumbnail');
    img.onclick = () => openModal(src);
    gallery.appendChild(img);
});

function openModal(src) {
    modal.style.display = 'flex';
    modalImage.src = src;
}

closeBtn.onclick = () => modal.style.display = 'none';
modal.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }
