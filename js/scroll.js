/**
 * Shows the scroll to top button when the user has scrolled more than 250px
 * down the page.
 */

const scrollButton = document.getElementById('scroll');
scrollButton.classList.add('hidden');

/**
 * Listens for clicks on the scroll to top button and scrolls to the top of the
 * page smoothly.
 */
scrollButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/**
 * Listens for scroll events and shows/hides the scroll to top button based on
 * the current scroll position.
 */
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > 250) {
        scrollButton.classList.remove('hidden');
    } else {
        scrollButton.classList.add('hidden');
    }
});
