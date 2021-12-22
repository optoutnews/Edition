var html = document.documentElement;
var body = document.body;
var lastMonth;
var lastGroup;
var timeout;
var st = 0;

cover();
subMenu();
featured();
feedLayout();
pagination();
archive();
video();
gallery();
table();
burger();

window.addEventListener('scroll', function () {
    'use strict';
    if (
        body.classList.contains('home-template') &&
        body.classList.contains('with-full-cover')
    ) {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(portalButton);
    }
});

function portalButton() {
    'use strict';
    st = window.scrollY;

    if (st > 300) {
        body.classList.add('portal-visible');
    } else {
        body.classList.remove('portal-visible');
    }
}

function cover() {
    'use strict';
    var cover = document.querySelector('.cover');
    if (!cover) return;

    imagesLoaded(cover, function () {
        cover.classList.remove('image-loading');
    });

    document
        .querySelector('.cover-arrow')
        .addEventListener('click', function () {
            var element = cover.nextElementSibling;
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
}

function subMenu() {
    'use strict';
    var nav = document.querySelector('.header-nav');
    var items = nav.querySelectorAll('.menu-item');

    function getSiblings(el, filter) {
        var siblings = [];
        while ((el = el.nextSibling)) {
            if (!filter || filter(el)) siblings.push(el);
        }
        return siblings;
    }

    function exampleFilter(el) {
        return el.nodeName.toLowerCase() == 'a';
    }

    if (items.length > 5) {
        var separator = items[4];

        var toggle = document.createElement('button');
        toggle.setAttribute(
            'class',
            'button-icon menu-item-button menu-item-more'
        );
        toggle.setAttribute('aria-label', 'More');
        toggle.innerHTML =
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M21.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM13.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM5.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0z"></path></svg>';

        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'sub-menu');

        var children = getSiblings(separator, exampleFilter);

        children.forEach(function (child) {
            wrapper.appendChild(child);
        });

        toggle.appendChild(wrapper);
        separator.parentNode.appendChild(toggle);

        toggle.addEventListener('click', function () {
            if (window.getComputedStyle(wrapper).display == 'none') {
                wrapper.style.display = 'block';
                wrapper.classList.add('animate__animated', 'animate__bounceIn');
            } else {
                wrapper.classList.add('animate__animated', 'animate__zoomOut');
            }
        });

        wrapper.addEventListener('animationend', function (e) {
            wrapper.classList.remove(
                'animate__animated',
                'animate__bounceIn',
                'animate__zoomOut'
            );
            if (e.animationName == 'zoomOut') {
                wrapper.style.display = 'none';
            }
        });
    }
}

function featured() {
    'use strict';
    var feed = document.querySelector('.featured-feed');
    if (!feed) return;

    tns({
        container: feed,
        controlsText: [
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.547 22.107L14.44 16l6.107-6.12L18.667 8l-8 8 8 8 1.88-1.893z"></path></svg>',
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.453 22.107L17.56 16l-6.107-6.12L13.333 8l8 8-8 8-1.88-1.893z"></path></svg>',
        ],
        gutter: 30,
        loop: false,
        nav: false,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });
}

function feedLayout() {
    'use strict';
    var wrapper = document.querySelector('.feed-layout');
    if (!wrapper) return;

    var feed = document.querySelector('.post-feed');

    document
        .querySelector('.feed-layout-headline')
        .addEventListener('click', function () {
            wrapper.classList.remove('expanded');
            feed.classList.remove('expanded');
            localStorage.setItem('edition_layout', 'compact');
        });

    document
        .querySelector('.feed-layout-expanded')
        .addEventListener('click', function () {
            wrapper.classList.add('expanded');
            feed.classList.add('expanded');
            localStorage.removeItem('edition_layout');
        });
}

function pagination() {
    'use strict';
    var infScroll;

    if (body.classList.contains('paged-next')) {
        infScroll = new InfiniteScroll('.post-feed', {
            append: '.feed',
            button: '.infinite-scroll-button',
            debug: false,
            hideNav: '.pagination',
            history: false,
            path: '.pagination .older-posts',
            scrollThreshold: false,
        });

        var button = document.querySelector('.infinite-scroll-button');

        infScroll.on('request', function (_path, _fetchPromise) {
            button.classList.add('loading');
        });

        infScroll.on('append', function (_response, _path, items) {
            items[0].classList.add('feed-paged');
            button.classList.remove('loading');
            archive(items);
        });
    }
}

function archive(data) {
    'use strict';
    if (!body.classList.contains('logged-in')) return;

    var posts = data || document.querySelectorAll('.feed');

    posts.forEach(function (post) {
        var current = post.getAttribute('data-month');
        if (current != lastMonth) {
            var month = document.createElement('div');
            month.className = 'feed-month';
            month.innerText = current;

            var group = document.createElement('div');
            group.className = 'feed-group';
            group.appendChild(month);

            feed.insertBefore(group, post);

            group.appendChild(post);

            lastMonth = current;
            lastGroup = group;
        } else {
            lastGroup.appendChild(post);
        }
    });
}

function video() {
    'use strict';
    const sources = [
        '.single-content iframe[src*="youtube.com"]',
        '.single-content iframe[src*="youtube-nocookie.com"]',
        '.single-content iframe[src*="player.vimeo.com"]',
        '.single-content iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed',
    ];

    reframe(document.querySelectorAll(sources.join(',')));
}

function gallery() {
    'use strict';
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });

    pswp(
        '.kg-gallery-container',
        '.kg-gallery-image',
        '.kg-gallery-image',
        false,
        true
    );
}

function table() {
    'use strict';
    if (
        !body.classList.contains('post-template') &&
        !body.classList.contains('page-template')
    )
        return;

    var tables = document.querySelectorAll('.single-content .table');

    tables.forEach(function (table) {
        var labels = [];

        table.querySelectorAll('thead th').forEach(function (label) {
            labels.push(label.textContent);
        });

        table.querySelectorAll('tr').forEach(function (row) {
            row.querySelectorAll('td').forEach(function (column, index) {
                column.setAttribute('data-label', labels[index]);
            });
        });
    });
}

function burger() {
    'use strict';
    document.querySelector('.burger').addEventListener('click', function () {
        if (!body.classList.contains('menu-opened')) {
            body.classList.add('menu-opened');
        } else {
            body.classList.remove('menu-opened');
        }
    });
}

function pswp(container, element, trigger, caption, isGallery) {
    var parseThumbnailElements = function (el) {
        var items = [],
            gridEl,
            linkEl,
            item;

        el.querySelectorAll(element).forEach(function (v) {
            gridEl = v;
            linkEl = gridEl.querySelector(trigger);

            item = {
                src: isGallery
                    ? gridEl.querySelector('img').getAttribute('src')
                    : linkEl.getAttribute('href'),
                w: 0,
                h: 0,
            };

            if (caption && gridEl.querySelector(caption)) {
                item.title = gridEl.querySelector(caption).innerHTML;
            }

            items.push(item);
        });

        return items;
    };

    var openPhotoSwipe = function (index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        options = {
            closeOnScroll: false,
            history: false,
            index: index,
            shareEl: false,
            showAnimationDuration: 0,
            showHideOpacity: true,
        };

        gallery = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
        );
        gallery.listen('gettingData', function (index, item) {
            if (item.w < 1 || item.h < 1) {
                // unknown size
                var img = new Image();
                img.onload = function () {
                    // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        gallery.init();
    };

    var onThumbnailsClick = function (e) {
        e.preventDefault();

        var siblings = e.target.closest(container).querySelectorAll(element);
        var nodes = Array.prototype.slice.call(siblings);
        var index = nodes.indexOf(e.target.closest(element));
        var clickedGallery = e.target.closest(container);

        openPhotoSwipe(index, clickedGallery);

        return false;
    };

    // container = document.querySelector(container);
    // if (!container) return;

    var triggers = document.querySelectorAll(trigger);
    triggers.forEach(function (trig) {
        trig.addEventListener('click', function (e) {
            onThumbnailsClick(e);
        });
    });
}

//App page custom js

(async function () {
    // Date formatting

    const monthsArr = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'P.M.' : 'A.M.';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const toHHMMSS = (secondsInput, isCasual) => {
        const isNegative = secondsInput < 0;
        secondsInput = Math.abs(secondsInput);
        let hours = Math.floor(secondsInput / 3600);
        let minutes = Math.floor((secondsInput - hours * 3600) / 60);
        let seconds = Math.round(secondsInput - hours * 3600 - minutes * 60);
        hours = Math.abs(hours);
        minutes = Math.abs(minutes);
        seconds = Math.abs(seconds);
        if (isCasual) {
            const directionWords = isNegative ? 'ago' : 'from now';
            if (hours > 2) {
                if (minutes > 30) {
                    hours += 1;
                }
                return `about ${hours} hours ${directionWords}`;
            }
            let hoursString = !hours ? '' : `${hours} hours`;
            if (minutes) {
                hoursString = !hoursString ? '' : `${hoursString}, `;
                return `${hoursString}${minutes} minutes ${directionWords}`;
            }
            return `${hoursString} ${directionWords}`;
        }
        minutes = minutes < 10 && hours ? `0${minutes}` : `${minutes}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return [hours, minutes, seconds].filter((item) => item).join(':');
    };

    function formatDateTime({
        seconds: secondsInput,
        timestamp,
        isCompact,
        includeTime,
        includeYear,
        isDayMonthYear,
        isCountDown,
        isCasual,
    }) {
        const dateObj = new Date(timestamp);
        if (isCountDown) {
            return toHHMMSS(
                typeof secondsInput === 'undefined'
                    ? dateObj.getTime() / 1000
                    : secondsInput,
                isCasual
            );
        }
        let month = monthsArr[dateObj.getMonth()];
        if (isCompact) {
            month = month.substring(0, 3);
        }
        const day = dateObj.getDate();
        let convdataTime = `${month} ${day}`;
        const year = dateObj.getFullYear();
        if (includeYear) {
            convdataTime = `${convdataTime}, ${year}`;
        }
        if (includeTime) {
            convdataTime = `${convdataTime}, ${formatAMPM(dateObj)}`;
        }
        if (isDayMonthYear) {
            return `${day} ${month} ${year}`;
        }
        return convdataTime;
    }

    //Data fetching
    let dataFetched = false,
        partners;

    const spinner = document.querySelector('.spinner');
    try {
        const fetchPromises = [
            'partners',
            'articles',
            'podcasts',
            'videos',
        ].map(async (endpointName) => {
            const uri = `https://api.optout.news/api/${endpointName}.json`;
            const data = await fetch(uri).then((result) => result.json());
            return data;
        });
        const fetchDataArrays = await Promise.all(fetchPromises);
        const allContent = [
            ...fetchDataArrays[1],
            ...fetchDataArrays[2],
            ...fetchDataArrays[3],
        ];

        dataFetched = true;
        partners = fetchDataArrays[0];

        populateSlider(allContent);
        spinner.style.display = 'none';
    } catch (e) {
        spinner.style.display = 'none';
        document.querySelector(
            '.slider'
        ).innerHTML = `<div class="errorMsgWrapper"><img class="error-img" src="https://optout-originals-images.nyc3.cdn.digitaloceanspaces.com/error_emoji.png" alt="Sad face"><p class="message">Looks like there was a problem getting the featured content. We're working hard on a fix-please be patient.</p></div>`;
        console.log(e);
    }

    //Inject data

    function populateSlider(data) {
        data.sort((a, b) => {
            if (a.published_at > b.published_at) {
                return -1;
            }
            if (a.published_at < b.published_at) {
                return 1;
            }
            return 0;
        })
            .filter((item) => {
                return item.featured === true;
            })
            .map((filteredItem, index) => {
                const featuredDiv = document.querySelector('.featured-content');
                const jumpLinkContainer = document.querySelector(
                    '.jump-link-container'
                );
                const jumpLink = document.createElement('a');
                const slider = document.querySelector('.slider');
                const slide = document.createElement('div');
                const overlay = document.createElement('div');
                const contentInfoContainer = document.createElement('div');
                const image = document.createElement('img');
                const title = document.createElement('h3');
                const partner = document.createElement('h4');
                const date = document.createElement('h5');
                const titleText = filteredItem.title;
                const dateText = formatDateTime({
                    timestamp: filteredItem.published_at,
                });
                const link = document.createElement('a');
                jumpLink.classList.add('jump-link');
                jumpLink.setAttribute('id', index);
                jumpLink.innerHTML = index + 1;
                slide.classList.add('slide');
                slide.id = `slide-${index}`;
                overlay.classList.add('overlay');
                contentInfoContainer.classList.add('content-info-container');
                contentInfoContainer.style.backgroundImage = `url(${
                    filteredItem.image_url !== null
                        ? filteredItem.image_url
                        : getPartnerImage(filteredItem.partner_id)
                })`;
                image.src = filteredItem.image_url;
                partner.classList.add('partner');
                date.classList.add('date');
                link.href = filteredItem.url.includes('?')
                    ? `${filteredItem.url}&utm_source=optout&utm_medium=site`
                    : `${filteredItem.url}?utm_source=optout&utm_medium=site`;
                link.setAttribute('target', 'blank');
                title.innerHTML = titleText;
                partner.innerHTML = getPartner(filteredItem.partner_id);
                date.innerHTML = dateText;
                link.innerHTML = 'Go to Content';
                jumpLinkContainer.append(jumpLink);
                contentInfoContainer.append(overlay, title, partner, date);
                slide.append(contentInfoContainer, link);
                slider.append(slide);
                featuredDiv.append(jumpLinkContainer, slider);
            });
    }

    function getPartner(id) {
        const partner = partners.filter((partner) => {
            return partner.id === id;
        });
        return partner[0].name;
    }

    function getPartnerImage(id) {
        const partner = partners.filter((partner) => {
            return partner.id === id;
        });
        return partner[0].image_url;
    }

    //Guard against errors if data not fetched
    if (dataFetched) {
        //Slider code adapted and modified from: https://github.com/bushblade/Full-Screen-Touch-Slider

        //Set global variables for this section
        const slider = document.querySelector('.slider');
        const jumpLinks = Array.from(document.querySelectorAll('.jump-link'));
        const slides = Array.from(document.querySelectorAll('.slide'));
        let isDragging = false,
            startPos = 0,
            currentTranslate,
            prevTranslate,
            animationID = 0,
            currentIndex;

        //Set first slide as active by default
        const defaultSlideIndex = '0';
        setActiveLink(defaultSlideIndex);

        //Set event listeners on the jump-links//
        jumpLinks.forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                currentIndex = parseInt(e.target.innerHTML) - 1;
                setPositionByIndex();
                setActiveLink(currentIndex.toString());
            });
        });

        function setActiveLink(index) {
            const activeLink = jumpLinks.filter(
                (link) => link.getAttribute('id') === index
            )[0];
            activeLink.classList.add('active-link');
            const inActiveLinks = jumpLinks.filter(
                (link) => link.getAttribute('id') !== index
            );
            inActiveLinks.forEach((link) => {
                link.classList.remove('active-link');
            });
        }

        function getSlideWidth() {
            const slide = document.querySelector('.slide');
            const styles = window.getComputedStyle(slide);
            const slideWidthWithPx = styles.width;
            const slideWidth = slideWidthWithPx.slice(
                0,
                slideWidthWithPx.length - 2
            );
            return parseInt(slideWidth);
        }

        // Make slides move on mouse drag and swipe
        slides.forEach((slide, index) => {
            //Remove context menu for slides
            slide.addEventListener('contextmenu', (e) => e.preventDefault());
            // Touch events
            slide.addEventListener('touchstart', touchStart(index));
            slide.addEventListener('touchend', touchEnd);
            slide.addEventListener('touchmove', touchMove);

            // Mouse events
            slide.addEventListener('mousedown', touchStart(index));
            slide.addEventListener('mouseup', touchEnd);
            slide.addEventListener('mouseleave', touchEnd);
            slide.addEventListener('mousemove', touchMove);
        });

        function touchStart(index) {
            return function (event) {
                const html = document.querySelector('html');
                html.classList.add('overflow-hidden');
                currentIndex = index;
                startPos = getPositionX(event);
                isDragging = true;
                animationID = requestAnimationFrame(animation);
                slides.forEach((slide) => {
                    slide.classList.add('grabbing');
                });
            };
        }

        function touchEnd() {
            const html = document.querySelector('html');
            html.classList.remove('overflow-hidden');
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentIndex < slides.length - 1) {
                currentIndex += 1;
            }

            if (movedBy > 100 && currentIndex > 0) {
                currentIndex -= 1;
            }

            setPositionByIndex();
            const currentIndexString = currentIndex
                ? currentIndex.toString()
                : '0';
            setActiveLink(currentIndexString);
            slides.forEach((slide) => {
                slide.classList.remove('grabbing');
            });
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function getPositionX(event) {
            return event.type.includes('mouse')
                ? event.pageX
                : event.touches[0].clientX;
        }

        function animation() {
            setSlidesPosition();
            if (isDragging) {
                requestAnimationFrame(animation);
            }
        }

        function setSlidesPosition() {
            slides.forEach((slide) => {
                slide.style.transform = `translateX(${currentTranslate}px)`;
            });
        }

        function setPositionByIndex() {
            const slideWidth = getSlideWidth();
            currentTranslate = currentIndex * -slideWidth;
            prevTranslate = currentTranslate;
            setSlidesPosition();
        }
    }
})();
