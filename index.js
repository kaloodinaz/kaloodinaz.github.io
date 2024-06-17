        let gameStarted = false;

        function loadHTML(elementId, url) {
            return fetch(url)
                .then(response => response.text())
                .then(data => {
                    document.getElementById(elementId).innerHTML = data;
                })
                .catch(error => console.log('Error loading HTML: ', error));
        }

        function loadGame() {
            var iframe = document.getElementById("iframehtml5");
            var startImg = document.getElementById("start-img");
            var startBtn = document.getElementById("start-btn");
            var title = document.getElementById("game-title");

            if (iframe) {
                iframe.src = iframe.dataset.oldsrc;
                iframe.style.display = "block";
            }
            if (startImg) startImg.style.display = "none";
            if (startBtn) startBtn.style.display = "none";
            if (title) title.style.display = "none";
            gameStarted = true;
        }

        document.addEventListener('DOMContentLoaded', () => {
            Promise.all([
                loadHTML('header-placeholder', 'https://kaloodinaz.github.io/header.html'),
                loadHTML('footer-placeholder', 'https://kaloodinaz.github.io/footer.html'),
                loadHTML('catalog-placeholder', 'https://kaloodinaz.github.io/catalog.html'),
                loadHTML('social-placeholder', 'https://kaloodinaz.github.io/social.html')
            ]).then(() => {
                var startImg = document.getElementById("start-img");
                var startBtn = document.getElementById("start-btn");

                if (startImg) startImg.addEventListener("click", loadGame);
                if (startBtn) startBtn.addEventListener("click", loadGame);

                let mobile_icon = document.querySelector(".mobile-icon");
                let mobile_close_icon = document.querySelector(".mobile-close");
                let mobile_menu = document.querySelector(".mobile-menu");

                if (mobile_icon) {
                    mobile_icon.addEventListener('click', function (e) {
                        mobile_menu.style.right = "0";
                        e.stopPropagation();
                    });
                }

                if (mobile_close_icon) {
                    mobile_close_icon.addEventListener('click', function (e) {
                        mobile_menu.style.right = "-310px";
                    });
                }

                if (mobile_menu) {
                    mobile_menu.addEventListener('click', function (e) {
                        e.stopPropagation();
                    });
                }

                document.addEventListener('click', function () {
                    if (mobile_menu) {
                        mobile_menu.style.right = "-310px";
                    }
                });
            });
        });

        function toggleFullscreen() {
            var iframe = document.getElementById("iframehtml5");
            if (!document.fullscreenElement) {
                if (!gameStarted) {
                    iframe.requestFullscreen().then(function() {
                        loadGame();
                    });
                } else {
                    iframe.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }


function shareFacebook() {
    const url = window.location.href;
    const title = document.title;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookShareUrl, "_blank");
}

function shareTwitter() {
    const url = window.location.href;
    const title = document.title;
    const twitterShareUrl = `https://www.x.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterShareUrl, "_blank");
}

function shareWhatsApp() {
    const url = window.location.href;
    const title = document.title;
    const whatsappShareUrl = `whatsapp://send?text=${encodeURIComponent(title + " " + url)}`;
    window.open(whatsappShareUrl);
}
function shareReddit() {
    const url = window.location.href;
    const title = document.title;
    const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(redditShareUrl, "_blank");
}

function share() {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
        navigator.share({
            title: title,
            text: title,
            url: url
        }).then(() => {
            console.log('Successfully shared');
        }).catch((error) => {
            console.error('Mistakes when sharing on social media:', error);
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = title + "\n" + url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const shareButton = document.getElementById('shareButton');
        shareButton.textContent = 'Copied!';
        setTimeout(function() {
            shareButton.textContent = 'Copy link';
        }, 2000);
        console.log('Copied link');
    }
}
