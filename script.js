const paletteVibes = [
            'Midnight Dreams', 'Ocean Breeze', 'Sunset Glow', 'Forest Whisper', 
            'Cosmic Aurora', 'Desert Mirage', 'Arctic Frost', 'Tropical Paradise',
            'Urban Jungle', 'Vintage Romance', 'Neon Nights', 'Pastel Daydream',
            'Autumn Harvest', 'Spring Bloom', 'Winter Wonderland', 'Summer Vibes',
            'Ethereal Mist', 'Bold Energy', 'Serene Calm', 'Vibrant Pulse',
            'Moody Blues', 'Warm Embrace', 'Cool Breeze', 'Electric Dreams',
            'Natural Harmony', 'Retro Wave', 'Modern Minimalist', 'Classic Elegance'
        ];

        let currentPalette = [];
        let lockedColors = new Set();

        function randomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function adjustColor(hex, amount) {
            const num = parseInt(hex.slice(1), 16);
            const r = Math.min(255, Math.max(0, (num >> 16) + amount));
            const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
            const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
            return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase();
        }

        function getRandomVibe() {
            return paletteVibes[Math.floor(Math.random() * paletteVibes.length)];
        }

        function createSwatch(color, index) {
            const swatch = document.createElement('div');
            swatch.className = 'swatch';
            if (lockedColors.has(index)) {
                swatch.classList.add('locked');
            }

            const top = document.createElement('div');
            top.className = 'top';
            top.style.backgroundColor = color;

            const bottom = document.createElement('div');
            bottom.className = 'bottom';

            const hex = document.createElement('div');
            hex.className = 'hex';
            hex.textContent = color;
            hex.addEventListener('click', () => copyColor(color));

            const actions = document.createElement('div');
            actions.className = 'actions';

            const lockBtn = document.createElement('button');
            lockBtn.className = 'icon-btn';
            lockBtn.textContent = lockedColors.has(index) ? '🔒 Unlock' : '🔓 Lock';
            if (lockedColors.has(index)) {
                lockBtn.classList.add('locked');
            }
            lockBtn.addEventListener('click', () => toggleLock(index));

            const regenBtn = document.createElement('button');
            regenBtn.className = 'icon-btn';
            regenBtn.textContent = '↻ Regen';
            regenBtn.addEventListener('click', () => regenerateSingle(index));

            actions.appendChild(lockBtn);
            actions.appendChild(regenBtn);

            bottom.appendChild(hex);
            bottom.appendChild(actions);

            swatch.appendChild(top);
            swatch.appendChild(bottom);

            return swatch;
        }

        function renderPalette() {
            const paletteEl = document.getElementById('palette');
            paletteEl.innerHTML = '';
            currentPalette.forEach((color, index) => {
                paletteEl.appendChild(createSwatch(color, index));
            });
        }

        function generatePalette() {
            for (let i = 0; i < 5; i++) {
                if (!lockedColors.has(i)) {
                    currentPalette[i] = randomColor();
                }
            }
            renderPalette();
            updateVibe();
        }

        function toggleLock(index) {
            if (lockedColors.has(index)) {
                lockedColors.delete(index);
            } else {
                lockedColors.add(index);
            }
            renderPalette();
        }

        function regenerateSingle(index) {
            if (!lockedColors.has(index)) {
                currentPalette[index] = randomColor();
                renderPalette();
            }
        }

        function randomizeShades() {
            const unlockedIndices = [];
            for (let i = 0; i < 5; i++) {
                if (!lockedColors.has(i)) {
                    unlockedIndices.push(i);
                }
            }
            if (unlockedIndices.length > 0) {
                const randomIndex = unlockedIndices[Math.floor(Math.random() * unlockedIndices.length)];
                const adjustment = Math.floor(Math.random() * 60) - 30;
                currentPalette[randomIndex] = adjustColor(currentPalette[randomIndex], adjustment);
                renderPalette();
            }
        }

        function copyColor(color) {
            navigator.clipboard.writeText(color).then(() => {
                showCopyFeedback(color);
            });
        }

        function showCopyFeedback(color) {
            const existing = document.querySelector('.copy-feedback');
            if (existing) {
                existing.remove();
            }

            const feedback = document.createElement('div');
            feedback.className = 'copy-feedback';
            feedback.textContent = `Copied ${color} ✓`;
            document.body.appendChild(feedback);

            setTimeout(() => {
                feedback.remove();
            }, 3000);
        }

        function updateVibe() {
            document.getElementById('vibeName').textContent = getRandomVibe();
        }

        function savePalette() {
            const palettes = JSON.parse(localStorage.getItem('colorflowPalettes') || '[]');
            palettes.push([...currentPalette]);
            localStorage.setItem('colorflowPalettes', JSON.stringify(palettes));
            renderFavorites();
            showCopyFeedback('Palette saved!');
        }

        function loadPalette(colors) {
            currentPalette = [...colors];
            lockedColors.clear();
            renderPalette();
            updateVibe();
        }

        function deletePalette(index) {
            const palettes = JSON.parse(localStorage.getItem('colorflowPalettes') || '[]');
            palettes.splice(index, 1);
            localStorage.setItem('colorflowPalettes', JSON.stringify(palettes));
            renderFavorites();
        }

        function clearAllFavorites() {
            if (confirm('Are you sure you want to clear all saved palettes?')) {
                localStorage.removeItem('colorflowPalettes');
                renderFavorites();
            }
        }

        function renderFavorites() {
            const favList = document.getElementById('favList');
            const clearBtn = document.getElementById('clearFavs');
            const palettes = JSON.parse(localStorage.getItem('colorflowPalettes') || '[]');

            if (palettes.length === 0) {
                favList.innerHTML = '<div class="empty-state">No saved palettes yet. Click "Save" to store your favorites!</div>';
                clearBtn.style.display = 'none';
                return;
            }

            clearBtn.style.display = 'block';
            favList.innerHTML = '';

            palettes.forEach((palette, index) => {
                const item = document.createElement('div');
                item.className = 'fav-item';

                const colors = document.createElement('div');
                colors.className = 'fav-colors';

                palette.forEach(color => {
                    const colorDiv = document.createElement('div');
                    colorDiv.className = 'fav-color';
                    colorDiv.style.backgroundColor = color;
                    colorDiv.title = color;
                    colorDiv.addEventListener('click', () => copyColor(color));
                    colors.appendChild(colorDiv);
                });

                const actions = document.createElement('div');
                actions.className = 'fav-actions';

                const useBtn = document.createElement('button');
                useBtn.className = 'btn';
                useBtn.textContent = 'Use';
                useBtn.addEventListener('click', () => loadPalette(palette));

                const delBtn = document.createElement('button');
                delBtn.className = 'btn';
                delBtn.textContent = 'Del';
                delBtn.style.background = 'var(--danger)';
                delBtn.addEventListener('click', () => deletePalette(index));

                actions.appendChild(useBtn);
                actions.appendChild(delBtn);

                item.appendChild(colors);
                item.appendChild(actions);

                favList.appendChild(item);
            });
        }

        document.getElementById('generateBtn').addEventListener('click', generatePalette);
        document.getElementById('randomizeShades').addEventListener('click', randomizeShades);
        document.getElementById('savePalette').addEventListener('click', savePalette);
        document.getElementById('clearFavs').addEventListener('click', clearAllFavorites);

        generatePalette();
        renderFavorites();