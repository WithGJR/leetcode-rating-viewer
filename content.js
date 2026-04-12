const RATING_DATA_URL = "https://huxulm.github.io/lc-rating/problemset/problems.json";
const SOLUTIONS_API = "https://huxulm.github.io/lc-rating/problemset/solutions.json";

let cachedRatings = null;
let ratingsPromise = null;

let cachedSolutions = null;
let solutionsPromise = null;

async function getRatings() {
    if (cachedRatings) return cachedRatings;
    if (ratingsPromise) return ratingsPromise;

    ratingsPromise = (async () => {
        const res = await fetch(RATING_DATA_URL);
        if (!res.ok) throw new Error(`ratings fetch failed: ${res.status}`);

        const data = await res.json();
        cachedRatings = Object.values(data).reduce((map, item) => {
            map[item.titleSlug] = item;
            return map;
        }, {});
        return cachedRatings;
    })().finally(() => {
        ratingsPromise = null;
    });

    return ratingsPromise;
}

async function getSolutions() {
    if (cachedSolutions) return cachedSolutions;
    if (solutionsPromise) return solutionsPromise;

    solutionsPromise = (async () => {
        const res = await fetch(SOLUTIONS_API);
        if (!res.ok) throw new Error(`solutions fetch failed: ${res.status}`);

        cachedSolutions = await res.json();
        return cachedSolutions;
    })().finally(() => {
        solutionsPromise = null;
    });

    return solutionsPromise;
}

function createRatingTag(problemRating) {
    const rating = Math.round(problemRating);
    const ratingTag = document.createElement('span');

    ratingTag.className = 'lc-rating-tag';
    ratingTag.innerText = `⭐ Rating: ${rating}`;

    ratingTag.style.cssText = `
        background-color: #2cbb5d;
        color: white;
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: bold;
        margin-left: 8px;
        vertical-align: middle;
        display: inline-block;
        font-family: monospace;
    `;

    if (rating >= 2000) ratingTag.style.backgroundColor = '#f63636';
    else if (rating >= 1600) ratingTag.style.backgroundColor = '#ffa246';
    return ratingTag;
}

async function injectRatingOnProblemsHomePage() {
    if (!window.location.pathname.includes('/problemset')) return;

    let ratings;
    try {
        ratings = await getRatings();
    } catch (e) {
        console.error("ratings fetch failed", e);
        return;
    }

    let links = document.querySelectorAll('a.group');
    links.forEach((titleLink) => {
        let pathParts = titleLink.href.split('/');
        if (pathParts[pathParts.length - 1][0] == '?') {
            return;
        }
        
        let problemSlug = pathParts[pathParts.length - 1];
        let index = problemSlug.indexOf('?');
        if (index != -1) {
            problemSlug = problemSlug.slice(0, index);
        }

        if (titleLink.dataset.processed === problemSlug) {
            return; 
        }

        const problemData = ratings[problemSlug];
        if (!problemData) return;

        const rating = Math.round(problemData.rating);
        const ratingTag = createRatingTag(rating);
        let titleElement = titleLink.querySelector('div.ellipsis');

        if (titleElement) {
            titleLink.dataset.processed = problemSlug;
            titleElement.appendChild(ratingTag);
        }
    });
}

async function injectRating() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] !== 'problems') return;

    const problemSlug = pathParts[2];
    if (!problemSlug) return;

    const titleElement = document.querySelector(
        'div.text-title-large'
    );
    if (!titleElement) return;

    let ratings;
    try {
        ratings = await getRatings();
    } catch (e) {
        return;
    }

    const problemData = ratings[problemSlug];
    const oldTag = titleElement.querySelector('.lc-rating-tag');

    if (!problemData) {
        if (oldTag) oldTag.remove();
        return;
    }

    if (oldTag && oldTag.dataset.slug === problemSlug) {
        return;
    }

    if (oldTag) oldTag.remove();

    const rating = Math.round(problemData.rating);
    const ratingTag = createRatingTag(rating);
    ratingTag.dataset.slug = problemSlug;
    titleElement.appendChild(ratingTag);

    getSolutions().then((solutions) => {
        if (!solutions) return;

        const solutionUrl = solutions[problemData.solutionId];
        if (!solutionUrl) return;

        const solutionLink = document.createElement('a');
        solutionLink.style.cssText =
            'text-decoration: underline; display: inline-block; padding-left: 8px; font-size: 13px;';
        solutionLink.innerText = '(0x3f 題解)';
        solutionLink.target = '_blank';
        solutionLink.href = `https://leetcode.cn/problems/${problemSlug}/solution/${solutionUrl['titleSlug']}`;

        solutionLink.addEventListener('mouseenter', () => {
            solutionLink.style.color = '#0072e3';
        });
        solutionLink.addEventListener('mouseleave', () => {
            solutionLink.style.color = '';
        });

        ratingTag.appendChild(solutionLink);
    }).catch(() => {});
}

let debounceTimer;
const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        injectRatingOnProblemsHomePage();
        injectRating();
    }, 100); 
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});