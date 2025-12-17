let contentWidth;
let imgSize;
let tileSize;

const zoomHandler = (function () {
    let media = document.querySelectorAll(".project-media > *");

    media.forEach(function (image) {
        image.draggable = false;
        image.addEventListener('click', function () {
            zoomImage(image);
        });
    })

    function zoomImage(image) {
        let overlay = document.querySelector("#overlay");
        overlay.style.display = "flex";
        let container = document.querySelector("#overlay div");

        container.innerHTML = '<button id="close-button"><img src="img/cross.svg" alt="Close button"></button>'
        let copy = image.cloneNode(true);
        container.appendChild(copy);

        let closeBtn = document.querySelector("#close-button");
        closeBtn.draggable = false;
        closeBtn.addEventListener('click', function () {
            overlay.style.display = "none";
        });
    }
})();

const scaleHandler = (function () {

    function resize() {
        updateCSSVariables();
        carouselHandler.refreshCarousels();
    }

    function updateCSSVariables() {
        let contentEl = document.querySelector('.focus-project');
        let contentCss = window.getComputedStyle(contentEl, null);
        contentWidth = cleanValue(contentCss.getPropertyValue("width"));

        let mediaEl = document.querySelector('.project-media');
        let mediaCss = window.getComputedStyle(mediaEl, null);
        imgSize = cleanValue(mediaCss.getPropertyValue("width"));

        let tileEl = document.querySelector('.project-tile');
        let tileCss = window.getComputedStyle(tileEl, null);
        tileSize = cleanValue(tileCss.getPropertyValue("width"));
    }

    function cleanValue(str) {
        str = str.replace("px", '');
        return str;
    }

    return { resize, updateCSSVariables }

})();

scaleHandler.updateCSSVariables();

const tileHandler = (function () {

    const tiles = document.querySelectorAll(".project-tile");
    tiles.forEach(function (tile, index) {

        let img = tile.querySelector("img");
        img.draggable = false;

        tile.addEventListener('click', function () {
            window.scrollTo(0, 0);

            highlightTile(index);
            focusHandler.setVisible(index);
        });
    });

    function highlightTile(tileNumber) {
        tiles.forEach(function (tile) {
            let img = tile.querySelector("img");
            img.id = "";
        });
        let img = tiles[tileNumber].querySelector("img");
        img.id = "tile-highlighted";
    }

    return {};
})();

const focusHandler = (function () {

    const cards = document.querySelectorAll(".focus-project");
    function setVisible(cardNumber) {
        cards.forEach(function (card) {
            card.classList.remove("active-project");
            card.classList.add("inactive-project");

        });
        cards[cardNumber].classList.remove("inactive-project");
        cards[cardNumber].classList.add("active-project");

    }

    return { setVisible };
})();

const carouselHandler = (function () {

    const buttonHandler = (function () {
        const focusProjects = document.querySelectorAll(".focus-project");

        try {
            focusProjects.forEach(function (project, index) {
                const prevButton = project.querySelector(".carousel-previous");
                const nextButton = project.querySelector(".carousel-next");

                prevButton.addEventListener('click', function () {
                    swipeLeft(index);
                });
                nextButton.addEventListener('click', function () {
                    swipeRight(index);
                });
            })
        }
        catch (err) {
            console.log(err);
        }

    })();

    let carousels = new Array();

    let dotSections = document.querySelectorAll(".carousel-dots");

    dotSections.forEach(function (dotSection, index) {
        let car = new Carousel(0, getSlideCount(index));
        carousels.push(car);
    });

    function Carousel(pos, maxPos) {
        this.currentPos = pos;
        this.maximumPos = maxPos;
    }

    function setPosition(carousel, pos) {
        carousels[carousel].currentPos = pos;
    }

    function getPosition(carousel) {
        return carousels[carousel].currentPos;
    }

    function getMaximum(carousel) {
        return carousels[carousel].maximumPos;
    }

    function refreshCarousels() {
        carousels.forEach(function (car, index) {
            setOffset(index, car.currentPos);
            selectDot(index, car.currentPos);
        });
    };

    function setOffset(carousel, pos) {
        scaleHandler.updateCSSVariables();

        let projects = document.querySelectorAll(".focus-project");
        let imgs = projects[carousel].querySelectorAll(".project-media img, .project-media video");
        let offset = pos * imgSize + "px";

        imgs.forEach(function (pic) {
            pic.style.right = offset;
        });
    }

    function selectDot(carousel, number) {
        let dotGroups = document.querySelectorAll(".carousel-dots");
        let dots = dotGroups[carousel].querySelectorAll(".dot");

        dots.forEach(function (dot) {
            dot.classList.remove("dot-select");
        });
        dots[number].classList.add("dot-select");
    }

    function getSlideCount(carouselIndex) {
        let projects = document.querySelectorAll(".focus-project");
        let dots = projects[carouselIndex].querySelectorAll(".dot");
        return dots.length;
    }

    function swipeRight(carouselIndex) {
        let current = getPosition(carouselIndex);
        let max = getMaximum(carouselIndex);

        if (current >= max - 1) {
            setPosition(carouselIndex, 0)
        } else {
            setPosition(carouselIndex, current += 1);
        }
        refreshCarousels();
    }

    function swipeLeft(carouselIndex) {
        let current = getPosition(carouselIndex);
        let max = getMaximum(carouselIndex);

        if (current <= 0) {
            setPosition(carouselIndex, max - 1);
        } else {
            setPosition(carouselIndex, current -= 1);
        }
        refreshCarousels();
    }

    return { refreshCarousels };
})();
