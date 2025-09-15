(() => {
    let animationFrameId = null;
    let canvas, ctx, stars;
    let canvasWidth, canvasHeight, starCount;
    const settings = {
        speed: 0.05,
        starColor_1: "180,184,240",
        starColor_2: "226,225,142",
        cometColor: "226,225,224",
    };

    function Star() {
        this.reset = function () {
            this.giant = isRandom(3);
            this.comet = !this.giant && isRandom(10);
            this.x = randomRange(0, canvasWidth - 10);
            this.y = randomRange(0, canvasHeight);
            this.r = randomRange(1.1, 2.6);
            this.dx =
                randomRange(settings.speed, 6 * settings.speed) +
                (this.comet
                    ? settings.speed * randomRange(50, 120) + 2 * settings.speed
                    : 0);
            this.dy =
                -randomRange(settings.speed, 6 * settings.speed) -
                (this.comet ? settings.speed * randomRange(50, 120) : 0);
            this.fadingOut = null;
            this.fadingIn = true;
            this.opacity = 0;
            this.opacityTresh = randomRange(0.2, 1 - 0.4 * (this.comet ? 1 : 0));
            this.do = randomRange(5e-4, 0.002) + (this.comet ? 0.001 : 0);
        };
        this.fadeIn = function () {
            if (this.fadingIn) {
                this.fadingIn = this.opacity <= this.opacityTresh;
                this.opacity += this.do;
            }
        };
        this.fadeOut = function () {
            if (this.fadingOut) {
                this.fadingOut = this.opacity >= 0;
                this.opacity -= this.do / 2;
                if (this.x > canvasWidth || this.y < 0) {
                    this.fadingOut = false;
                    this.reset();
                }
            }
        };
        this.draw = function () {
            ctx.beginPath();
            if (this.giant) {
                ctx.fillStyle = `rgba(${settings.starColor_1},${this.opacity})`;
                ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
            } else if (this.comet) {
                ctx.fillStyle = `rgba(${settings.cometColor},${this.opacity})`;
                ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);
                for (let i = 0; i < 30; i++) {
                    ctx.fillStyle = `rgba(${settings.cometColor},${this.opacity - (this.opacity / 20) * i
                        })`;
                    ctx.rect(
                        this.x - (this.dx / 4) * i,
                        this.y - (this.dy / 4) * i - 2,
                        2,
                        2
                    );
                    ctx.fill();
                }
            } else {
                ctx.fillStyle = `rgba(${settings.starColor_2},${this.opacity})`;
                ctx.rect(this.x, this.y, this.r, this.r);
            }
            ctx.closePath();
            ctx.fill();
        };
        this.move = function () {
            this.x += this.dx;
            this.y += this.dy;
            if (this.fadingOut === false) this.reset();
            if (this.x > canvasWidth - canvasWidth / 4 || this.y < 0) {
                this.fadingOut = true;
            }
        };
    }
    function isRandom(t) {
        return Math.floor(1e3 * Math.random()) + 1 < 10 * t;
    }
    function randomRange(t, i) {
        return Math.random() * (i - t) + t;
    }
    function updateCanvasSize() {
        if (!canvas) return;
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        starCount = 0.216 * canvasWidth;
        canvas.setAttribute("width", canvasWidth);
        canvas.setAttribute("height", canvasHeight);
    }
    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        stars.forEach((star) => {
            star.move();
            star.fadeIn();
            star.fadeOut();
            star.draw();
        });
        animationFrameId = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationFrameId) return;
        canvas = document.getElementById("universe");
        if (!canvas) return;
        ctx = canvas.getContext("2d");
        updateCanvasSize();
        stars = [];
        for (let i = 0; i < starCount; i++) {
            let star = new Star();
            star.reset();
            stars.push(star);
        }
        canvas.style.display = "block";
        animate();
        window.addEventListener("resize", updateCanvasSize, false);
    }

    function stopAnimation() {
        if (!animationFrameId || !canvas) return;
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        canvas.style.display = "none";
        window.removeEventListener("resize", updateCanvasSize, false);
    }

    function initThemeObserver() {
        const htmlElement = document.documentElement;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "data-theme") {
                    const theme = htmlElement.getAttribute("data-theme");
                    if (theme === "dark") {
                        startAnimation();
                    } else {
                        stopAnimation();
                    }
                }
            });
        });
        observer.observe(htmlElement, {
            attributes: true,
        });

        if (htmlElement.getAttribute("data-theme") === "dark") {
            startAnimation();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initThemeObserver);
    } else {
        initThemeObserver();
    }
})();
