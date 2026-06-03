/**
 * Fluid line simulation — adapted from:
 * https://codepen.io/aecend/pen/WbONyK (Jeff Thomas, MIT-style open pen)
 */
(function (w) {
    'use strict';

    const RESOLUTION = 10;
    const PEN_SIZE = 48;
    const STROKE_COLOR = '#00FFFF';
    const BG_COLOR = '#000000';
    const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;

    let canvas;
    let ctx;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let numCols = 0;
    let numRows = 0;
    let speckCount = 0;
    let vecCells = [];
    let particles = [];
    let rafId = null;
    let resizeTimer = null;

    const mouse = { x: 0, y: 0, px: 0, py: 0, onScreen: false };

    function snapToGrid(value) {
        return Math.max(RESOLUTION, Math.floor(value / RESOLUTION) * RESOLUTION);
    }

    function Cell(x, y, res) {
        this.x = x;
        this.y = y;
        this.r = res;
        this.col = 0;
        this.row = 0;
        this.xv = 0;
        this.yv = 0;
        this.pressure = 0;
    }

    function Particle(x, y) {
        this.x = this.px = x;
        this.y = this.py = y;
        this.xv = 0;
        this.yv = 0;
    }

    function buildGrid() {
        vecCells = [];
        particles = [];

        for (let col = 0; col < numCols; col++) {
            vecCells[col] = [];
            for (let row = 0; row < numRows; row++) {
                const cellData = new Cell(col * RESOLUTION, row * RESOLUTION, RESOLUTION);
                cellData.col = col;
                cellData.row = row;
                vecCells[col][row] = cellData;
            }
        }

        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < numRows; row++) {
                const cellData = vecCells[col][row];
                const rowUp = row - 1 >= 0 ? row - 1 : numRows - 1;
                const colLeft = col - 1 >= 0 ? col - 1 : numCols - 1;
                const colRight = col + 1 < numCols ? col + 1 : 0;

                const up = vecCells[col][rowUp];
                const left = vecCells[colLeft][row];
                const upLeft = vecCells[colLeft][rowUp];
                const upRight = vecCells[colRight][rowUp];

                cellData.up = up;
                cellData.left = left;
                cellData.up_left = upLeft;
                cellData.up_right = upRight;

                up.down = cellData;
                left.right = cellData;
                upLeft.down_right = cellData;
                upRight.down_left = cellData;
            }
        }

        for (let i = 0; i < speckCount; i++) {
            particles.push(new Particle(
                Math.random() * canvasWidth,
                Math.random() * canvasHeight
            ));
        }
    }

    function setCanvasSize() {
        canvasWidth = snapToGrid(window.innerWidth);
        canvasHeight = snapToGrid(window.innerHeight);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        numCols = canvasWidth / RESOLUTION;
        numRows = canvasHeight / RESOLUTION;
        const area = canvasWidth * canvasHeight;
        // Higher density (CodePen uses 5000 on 500×500); capped for performance
        // speckCount = Math.min(5000, Math.max(2000, Math.floor(area / 100)));
        if (isTouchDevice) {
            speckCount = 1200;
        } else {
            speckCount = Math.min(
                5000,
                Math.max(2000, Math.floor(area / 100))
            );
        }
        buildGrid();
    }

    function updateMouseFromEvent(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.onScreen = true;
    }

    function changeCellVelocity(cellData, mvelX, mvelY, radius) {
        const dx = cellData.x - mouse.x;
        const dy = cellData.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
            if (dist < 4) dist = radius;
            const power = radius / dist;
            cellData.xv += mvelX * power;
            cellData.yv += mvelY * power;
        }
    }

    function updatePressure(cellData) {
        const pressureX = (
            cellData.up_left.xv * 0.5
            + cellData.left.xv
            + cellData.down_left.xv * 0.5
            - cellData.up_right.xv * 0.5
            - cellData.right.xv
            - cellData.down_right.xv * 0.5
        );
        const pressureY = (
            cellData.up_left.yv * 0.5
            + cellData.up.yv
            + cellData.up_right.yv * 0.5
            - cellData.down_left.yv * 0.5
            - cellData.down.yv
            - cellData.down_right.yv * 0.5
        );
        cellData.pressure = (pressureX + pressureY) * 0.25;
    }

    function updateVelocity(cellData) {
        cellData.xv += (
            cellData.up_left.pressure * 0.5
            + cellData.left.pressure
            + cellData.down_left.pressure * 0.5
            - cellData.up_right.pressure * 0.5
            - cellData.right.pressure
            - cellData.down_right.pressure * 0.5
        ) * 0.25;
        cellData.yv += (
            cellData.up_left.pressure * 0.5
            + cellData.up.pressure
            + cellData.up_right.pressure * 0.5
            - cellData.down_left.pressure * 0.5
            - cellData.down.pressure
            - cellData.down_right.pressure * 0.5
        ) * 0.25;
        cellData.xv *= 0.99;
        cellData.yv *= 0.99;
    }

    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.x >= 0 && p.x < canvasWidth && p.y >= 0 && p.y < canvasHeight) {
                const col = parseInt(p.x / RESOLUTION, 10);
                const row = parseInt(p.y / RESOLUTION, 10);
                const cellData = vecCells[col][row];
                const ax = (p.x % RESOLUTION) / RESOLUTION;
                const ay = (p.y % RESOLUTION) / RESOLUTION;

                p.xv += (1 - ax) * cellData.xv * 0.05;
                p.yv += (1 - ay) * cellData.yv * 0.05;
                p.xv += ax * cellData.right.xv * 0.05;
                p.yv += ax * cellData.right.yv * 0.05;
                p.xv += ay * cellData.down.xv * 0.05;
                p.yv += ay * cellData.down.yv * 0.05;

                p.x += p.xv;
                p.y += p.yv;

                const dx = p.px - p.x;
                const dy = p.py - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const limit = Math.random() * 0.5;

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                if (dist > limit) {
                    ctx.lineTo(p.px, p.py);
                } else {
                    ctx.lineTo(p.x + limit, p.y + limit);
                }
                ctx.stroke();

                p.px = p.x;
                p.py = p.y;
            } else {
                p.x = p.px = Math.random() * canvasWidth;
                p.y = p.py = Math.random() * canvasHeight;
                p.xv = 0;
                p.yv = 0;
            }

            p.xv *= 0.5;
            p.yv *= 0.5;
        }
    }

    function draw() {
        const mouseXv = mouse.x - mouse.px;
        const mouseYv = mouse.y - mouse.py;

        if (mouse.onScreen && (mouseXv !== 0 || mouseYv !== 0)) {
            for (let i = 0; i < vecCells.length; i++) {
                const cellDatas = vecCells[i];
                for (let j = 0; j < cellDatas.length; j++) {
                    const cellData = cellDatas[j];
                    changeCellVelocity(cellData, mouseXv, mouseYv, PEN_SIZE);
                    updatePressure(cellData);
                }
            }
        } else {
            for (let i = 0; i < vecCells.length; i++) {
                const cellDatas = vecCells[i];
                for (let j = 0; j < cellDatas.length; j++) {
                    updatePressure(cellDatas[j]);
                }
            }
        }

        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = STROKE_COLOR;
        updateParticles();

        for (let i = 0; i < vecCells.length; i++) {
            const cellDatas = vecCells[i];
            for (let j = 0; j < cellDatas.length; j++) {
                updateVelocity(cellDatas[j]);
            }
        }

        mouse.px = mouse.x;
        mouse.py = mouse.y;
        rafId = w.requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
        updateMouseFromEvent(e);
    }

    function onMouseLeave() {
        mouse.onScreen = false;
    }

    function onTouchStart(e) {
        // e.preventDefault();
        updateMouseFromEvent(e);
    }

    function onTouchMove(e) {
        // e.preventDefault();
        updateMouseFromEvent(e);
    }

    function onTouchEnd(e) {
        if (!e.touches.length) mouse.onScreen = false;
    }

    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setCanvasSize();
        }, 200);
    }

    function bindEvents() {
        w.addEventListener('mousemove', onMouseMove);
        w.addEventListener('mouseleave', onMouseLeave);
        w.addEventListener('touchstart', onTouchStart, { passive: true });
        w.addEventListener('touchmove', onTouchMove, { passive: true });
        w.addEventListener('touchend', onTouchEnd);
        w.addEventListener('resize', onResize);
    }

    function init(canvasId) {
        canvas = document.getElementById(canvasId);
        if (!canvas) return false;
        ctx = canvas.getContext('2d');
        setCanvasSize();
        bindEvents();
        if (rafId) w.cancelAnimationFrame(rafId);
        draw();
        return true;
    }

    function destroy() {
        if (rafId) w.cancelAnimationFrame(rafId);
        rafId = null;
        w.removeEventListener('mousemove', onMouseMove);
        w.removeEventListener('mouseleave', onMouseLeave);
        w.removeEventListener('touchstart', onTouchStart);
        w.removeEventListener('touchmove', onTouchMove);
        w.removeEventListener('touchend', onTouchEnd);
        w.removeEventListener('resize', onResize);
    }

    w.FluidBackground = { init, destroy };
}(window));
