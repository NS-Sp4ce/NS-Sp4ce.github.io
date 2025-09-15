/**
 * Butterfly-themed bubble animation effect.
 * This script is a refactored, dependency-free version of the original circle-magic effect.
 */
(() => {
    "use strict";

    const targetSelector = "#page-header";

    const settings = {
        radius: 10,
        density: 0.2,
        color: "rgba(255,255,255,.4)",
        clearOffset: 0.99,
    };
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
        return;
    }
    let canvas, ctx, width, height, bubbles, animationFrameId;
    let isRunning = true;

    class Bubble {
        constructor() {
            this.reset();
        }
        reset() {
            this.position = {
                x: Math.random() * width,
                y: height + Math.random() * 100,
            };
            this.alpha = 0.1 + Math.random() * settings.clearOffset;
            this.scale = 0.1 + Math.random() * 0.3;
            this.speed = Math.random();
            this.color = settings.color;
        }
        draw() {
            if (this.alpha <= 0) {
                this.reset();
            }
            this.position.y -= this.speed;
            this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(
                this.position.x,
                this.position.y,
                this.scale * settings.radius,
                0,
                2 * Math.PI,
                false
            );
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    function initialize() {
        width = targetElement.clientWidth;
        height = targetElement.clientHeight;
        canvas = document.createElement("canvas");
        canvas.id = "bubble-canvas";
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "0";
        targetElement.style.overflow = "hidden";
        targetElement.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        bubbles = [];
        const bubbleCount = Math.floor(width * settings.density);
        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push(new Bubble());
        }
        animate();
    }

    function animate() {
        if (isRunning) {
            ctx.clearRect(0, 0, width, height);
            bubbles.forEach((bubble) => bubble.draw());
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    function handleResize() {
        width = targetElement.clientWidth;
        height = targetElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function handleScroll() {
        isRunning = document.body.scrollTop <= height;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

    window.addEventListener("scroll", handleScroll, false);
    window.addEventListener("resize", handleResize, false);
})();
