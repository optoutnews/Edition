//Home page custom js

if (document.URL === 'https://www.optout.news/') {
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

        // Data fetching
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
            console.log(e)
            spinner.style.display = 'none';
            document.querySelector(
                '.slider'
            ).innerHTML = `<div class="errorMsgWrapper"><img class="error-img" src="https://optout-originals-images.nyc3.cdn.digitaloceanspaces.com/error_emoji.png" alt="Sad face"><p class="message">Looks like there was a problem getting the featured content. We're working hard on a fix-please be patient.</p></div>`;
            console.log(e);
        }

        //Inject data

        function populateSlider(data) {
            const featuredDiv = document.querySelector('.featured-content');
            const slider = document.querySelector('.slider');

            if (!data) {
                const noFeatured = document.createElement('h3');
                noFeatured.innerHTML = 'Currently No Featured Items'
                slider.classList.add('slider-no-featured')
                slider.append(noFeatured)
            } else {
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
                        const numberOfFeaturedItems = 5;
                        if (index <= numberOfFeaturedItems - 1) {
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
                            contentInfoContainer.style.backgroundImage = `url(${filteredItem.image_url !== null
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
                        }
                    });

            }
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

            return removeWhiteSpaceFromImageUrl(partner[0].image_url);
        }

        function removeWhiteSpaceFromImageUrl(url) {
            const regex = new RegExp(/ /g);
            const trimmedUrl = url ? url.replace(regex, '+') : url;

            return trimmedUrl;
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

}
