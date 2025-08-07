document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Canvas setup
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match its display size
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#000000';
    let currentBrushSize = 8;

    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    const customColorInput = document.getElementById('customColor');

    colorOptions.forEach(option => {
        option.addEventListener('click', function () {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.dataset.color;
            customColorInput.value = currentColor;
            updateBrushPreview();
        });
    });

    customColorInput.addEventListener('input', function () {
        currentColor = this.value;
        colorOptions.forEach(opt => opt.classList.remove('active'));
        updateBrushPreview();
    });

    // Brush size
    const brushSizeInput = document.getElementById('brushSize');
    const brushPreview = document.getElementById('brushPreview');

    brushSizeInput.addEventListener('input', function () {
        currentBrushSize = parseInt(this.value);
        brushPreview.textContent = `${currentBrushSize}px`;
        updateBrushPreview();
    });

    function updateBrushPreview() {
        brushPreview.style.width = `${currentBrushSize * 2}px`;
        brushPreview.style.height = `${currentBrushSize * 2}px`;
        brushPreview.style.backgroundColor = currentColor;
        brushPreview.style.color = currentColor === '#ffffff' ? '#000' : '#fff';
    }

    updateBrushPreview();

    // Tools
    const clearBtn = document.getElementById('clearBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    clearBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear the canvas?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    eraserBtn.addEventListener('click', function () {
        currentColor = '#ffffff';
        customColorInput.value = currentColor;
        colorOptions.forEach(opt => opt.classList.remove('active'));
        updateBrushPreview();
    });

    downloadBtn.addEventListener('click', function () {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Drawing functions
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize;
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }
});