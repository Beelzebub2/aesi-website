// Modern Podcast Player with Howler.js

document.addEventListener('DOMContentLoaded', function () {
    initializePodcastPlayers();
    setupScrollListener();
    setupKeyboardControls();
});

// Store player instances and state - make it globally accessible
window.podcastState = {
    players: {},
    currentlyPlaying: null,
    minimizedPlayer: null,
    currentEpisodeElement: null
};

function initializePodcastPlayers() {
    const podcastPlayers = document.querySelectorAll('.podcast-player');
    const minimizedPlayer = document.querySelector('.minimized-player');

    window.podcastState.minimizedPlayer = minimizedPlayer;

    // Initialize each player
    podcastPlayers.forEach((playerElement) => {
        const audioSrc = playerElement.getAttribute('data-src');
        const episodeTitle = playerElement.getAttribute('data-title');
        const episodeNumber = playerElement.closest('.podcast-card').getAttribute('data-episode');

        // Add loading state
        playerElement.closest('.podcast-card').classList.add('loading');

        // Create Howl instance for this player
        const player = new Howl({
            src: [audioSrc],
            html5: true,
            preload: true,
            volume: 1.0,  // Set initial volume
            onload: function () {
                // Remove loading state
                playerElement.closest('.podcast-card').classList.remove('loading');

                // Update duration
                const duration = formatTime(player.duration());
                const durationElement = playerElement.closest('.podcast-card').querySelector('.duration-text');
                if (durationElement) {
                    durationElement.textContent = duration;
                }

                // Setup saved position and volume if exists
                const savedPosition = localStorage.getItem(`podcast_${episodeNumber}_position`);
                const savedVolume = localStorage.getItem(`podcast_volume`);

                if (savedPosition) {
                    player.seek(parseFloat(savedPosition));
                    updateProgressBar(playerElement, player);
                }

                if (savedVolume) {
                    player.volume(parseFloat(savedVolume));
                    updateVolumeDisplay(parseFloat(savedVolume));
                }
            },
            onplay: function () {
                // Update UI for playing state
                updatePlayingState(playerElement, true);

                // Stop other players
                if (window.podcastState.currentlyPlaying && window.podcastState.currentlyPlaying !== player) {
                    window.podcastState.currentlyPlaying.pause();
                }

                // Update current player reference
                window.podcastState.currentlyPlaying = player;
                window.podcastState.currentEpisodeElement = playerElement;

                // Show minimized player when scrolling
                updateMinimizedPlayer(playerElement, true);

                // Start progress update interval
                startProgressInterval(playerElement, player);
            },
            onpause: function () {
                // Update UI for paused state
                updatePlayingState(playerElement, false);

                // Save current position
                const currentPosition = player.seek();
                localStorage.setItem(`podcast_${episodeNumber}_position`, currentPosition);

                // Clear progress interval
                if (playerElement.progressInterval) {
                    clearInterval(playerElement.progressInterval);
                }
            },
            onstop: function () {
                updatePlayingState(playerElement, false);
                if (playerElement.progressInterval) {
                    clearInterval(playerElement.progressInterval);
                }
            },
            onend: function () {
                updatePlayingState(playerElement, false);
                updateProgressBar(playerElement, player, 0);
                if (playerElement.progressInterval) {
                    clearInterval(playerElement.progressInterval);
                }

                // Reset position
                localStorage.removeItem(`podcast_${episodeNumber}_position`);

                // Hide minimized player
                minimizedPlayer.style.display = 'none';

                // Auto-play next episode option
                playNextEpisode(episodeNumber);
            },
            onloaderror: function () {
                // Handle loading error
                playerElement.closest('.podcast-card').classList.remove('loading');
                playerElement.closest('.podcast-card').classList.add('error');
                console.error(`Error loading audio for episode ${episodeNumber}`);
            },
            onplayerror: function () {
                // Handle playback error
                console.error(`Error playing audio for episode ${episodeNumber}`);
                player.once('unlock', function () {
                    player.play();
                });
            }
        });

        // Store reference to player
        window.podcastState.players[episodeNumber] = {
            howl: player,
            element: playerElement,
            title: episodeTitle
        };

        // Setup play button click
        const playButton = playerElement.querySelector('.play-button');
        playButton.addEventListener('click', function () {
            togglePlayback(player, playerElement);
        });

        // Enhanced progress bar interaction with drag support
        const progressBar = playerElement.querySelector('.progress-bar');
        const progressThumb = playerElement.querySelector('.progress-thumb');

        let isDragging = false;

        // Progress bar click
        progressBar.addEventListener('click', function (e) {
            if (!isDragging && player.state() === 'loaded') {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                const seekPosition = player.duration() * percent;
                player.seek(seekPosition);
                updateProgressBar(playerElement, player);

                // If player is not playing, start playing
                if (!player.playing()) {
                    player.play();
                }
            }
        });

        // Thumb drag functionality
        progressThumb.addEventListener('mousedown', function (e) {
            e.preventDefault();
            isDragging = true;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging && player.state() === 'loaded') {
                const rect = progressBar.getBoundingClientRect();
                let percent = (e.clientX - rect.left) / rect.width;
                percent = Math.max(0, Math.min(1, percent)); // Clamp between 0 and 1

                const seekPosition = player.duration() * percent;
                player.seek(seekPosition);
                updateProgressBar(playerElement, player);
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    });

    // Enhanced minimized player controls
    const miniPlayButton = minimizedPlayer.querySelector('.mini-play-button');
    const miniSkipBack = minimizedPlayer.querySelector('.mini-skip-back');
    const miniSkipForward = minimizedPlayer.querySelector('.mini-skip-forward');
    const miniVolumeButton = minimizedPlayer.querySelector('.mini-volume-button');
    const miniVolumeContainer = minimizedPlayer.querySelector('.mini-volume-container');
    const volumeSliderContainer = minimizedPlayer.querySelector('.volume-slider-container');
    const volumeSlider = minimizedPlayer.querySelector('.volume-slider');
    const volumeSliderFill = minimizedPlayer.querySelector('.volume-slider-fill');
    const volumeSliderThumb = minimizedPlayer.querySelector('.volume-slider-thumb');
    const volumePercentage = minimizedPlayer.querySelector('.volume-percentage');
    const miniProgressBar = minimizedPlayer.querySelector('.mini-progress-bar');
    const miniProgressThumb = minimizedPlayer.querySelector('.mini-progress-thumb');

    miniPlayButton.addEventListener('click', function () {
        if (window.podcastState.currentlyPlaying) {
            togglePlayback(window.podcastState.currentlyPlaying, window.podcastState.currentEpisodeElement);
        }
    });

    // Skip back 10 seconds
    miniSkipBack.addEventListener('click', function () {
        if (window.podcastState.currentlyPlaying) {
            const currentTime = window.podcastState.currentlyPlaying.seek() || 0;
            window.podcastState.currentlyPlaying.seek(Math.max(0, currentTime - 10));
            updateAllProgressBars();
        }
    });

    // Skip forward 10 seconds
    miniSkipForward.addEventListener('click', function () {
        if (window.podcastState.currentlyPlaying) {
            const currentPos = window.podcastState.currentlyPlaying.seek() || 0;
            window.podcastState.currentlyPlaying.seek(Math.min(window.podcastState.currentlyPlaying.duration(), currentPos + 10));
            updateAllProgressBars();
        }
    });

    // Volume button toggle slider
    miniVolumeButton.addEventListener('click', function (e) {
        e.stopPropagation();
        volumeSliderContainer.classList.toggle('show');
    });

    // Close volume slider when clicking outside
    document.addEventListener('click', function (e) {
        if (!miniVolumeContainer.contains(e.target)) {
            volumeSliderContainer.classList.remove('show');
        }
    });

    // Volume slider interaction
    let isVolumeSliding = false;

    volumeSlider.addEventListener('mousedown', function (e) {
        e.preventDefault();
        isVolumeSliding = true;
        updateVolumeFromSlider(e);
        document.addEventListener('mousemove', onVolumeSliderMove);
        document.addEventListener('mouseup', onVolumeSliderUp);
    });

    volumeSlider.addEventListener('click', function (e) {
        if (!isVolumeSliding) {
            updateVolumeFromSlider(e);
        }
    });

    function updateVolumeFromSlider(e) {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = 1 - ((e.clientY - rect.top) / rect.height); // Inverted for bottom-to-top
        const clampedPercent = Math.max(0, Math.min(1, percent));

        if (window.podcastState.currentlyPlaying) {
            window.podcastState.currentlyPlaying.volume(clampedPercent);
            localStorage.setItem('podcast_volume', clampedPercent);
            updateVolumeDisplay(clampedPercent);
        }
    }

    function onVolumeSliderMove(e) {
        if (isVolumeSliding) {
            updateVolumeFromSlider(e);
        }
    }

    function onVolumeSliderUp() {
        isVolumeSliding = false;
        document.removeEventListener('mousemove', onVolumeSliderMove);
        document.removeEventListener('mouseup', onVolumeSliderUp);
    }

    // Enhanced minimized progress bar with drag support
    let miniIsDragging = false;

    miniProgressBar.addEventListener('click', function (e) {
        if (!miniIsDragging && window.podcastState.currentlyPlaying && window.podcastState.currentlyPlaying.state() === 'loaded') {
            const rect = miniProgressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const seekPosition = window.podcastState.currentlyPlaying.duration() * percent;
            window.podcastState.currentlyPlaying.seek(seekPosition);
            updateAllProgressBars();
        }
    });

    // Mini thumb drag functionality
    miniProgressThumb.addEventListener('mousedown', function (e) {
        e.preventDefault();
        miniIsDragging = true;
        document.addEventListener('mousemove', onMiniMouseMove);
        document.addEventListener('mouseup', onMiniMouseUp);
    });

    function onMiniMouseMove(e) {
        if (miniIsDragging && window.podcastState.currentlyPlaying && window.podcastState.currentlyPlaying.state() === 'loaded') {
            const rect = miniProgressBar.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));

            const seekPosition = window.podcastState.currentlyPlaying.duration() * percent;
            window.podcastState.currentlyPlaying.seek(seekPosition);
            updateAllProgressBars();
        }
    }

    function onMiniMouseUp() {
        miniIsDragging = false;
        document.removeEventListener('mousemove', onMiniMouseMove);
        document.removeEventListener('mouseup', onMiniMouseUp);
    }
}

// Toggle playback
function togglePlayback(player, playerElement) {
    if (player.playing()) {
        player.pause();
    } else {
        player.play();
    }
}

// Update UI for playing/paused state
function updatePlayingState(playerElement, isPlaying) {
    const podcastCard = playerElement.closest('.podcast-card');
    const playButton = playerElement.querySelector('.play-button');
    const minimizedPlayer = document.querySelector('.minimized-player');
    const miniPlayButton = minimizedPlayer.querySelector('.mini-play-button');

    if (isPlaying) {
        podcastCard.classList.add('playing');
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        minimizedPlayer.classList.add('playing');
        miniPlayButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        podcastCard.classList.remove('playing');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        minimizedPlayer.classList.remove('playing');
        miniPlayButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Make updateVolumeDisplay globally accessible
window.updateVolumeDisplay = function (volume) {
    const volumeSliderFill = document.querySelector('.volume-slider-fill');
    const volumeSliderThumb = document.querySelector('.volume-slider-thumb');
    const volumePercentage = document.querySelector('.volume-percentage');
    const miniVolumeButton = document.querySelector('.mini-volume-button');

    if (volumeSliderFill && volumeSliderThumb && volumePercentage) {
        const percentage = Math.round(volume * 100);
        volumeSliderFill.style.height = `${percentage}%`;
        volumeSliderThumb.style.bottom = `${percentage}%`;
        volumePercentage.textContent = `${percentage}%`;
    }

    // Update volume icon
    if (miniVolumeButton) {
        const icon = miniVolumeButton.querySelector('i');
        if (icon) {
            if (volume === 0) {
                icon.className = 'fas fa-volume-mute';
            } else if (volume < 0.5) {
                icon.className = 'fas fa-volume-down';
            } else {
                icon.className = 'fas fa-volume-up';
            }
        }
    }
};

// Enhanced progress bar update with proper time display
function updateProgressBar(playerElement, player, overrideValue = null) {
    const progressIndicator = playerElement.querySelector('.progress-indicator');
    const progressThumb = playerElement.querySelector('.progress-thumb');
    const timeDisplay = playerElement.querySelector('.time-display');

    if (!progressIndicator || !timeDisplay) return;

    // Calculate progress percentage
    let percent;
    if (overrideValue !== null) {
        percent = overrideValue;
    } else {
        const seek = player.seek() || 0;
        percent = (seek / player.duration()) * 100 || 0;
    }

    // Update progress indicator width
    progressIndicator.style.width = `${percent}%`;

    // Update thumb position
    if (progressThumb) {
        progressThumb.style.left = `${percent}%`;
    }

    // Update time display with current/total format
    if (player.state() === 'loaded') {
        const currentTime = formatTime(player.seek() || 0);
        const totalTime = formatTime(player.duration());
        timeDisplay.textContent = `${currentTime} / ${totalTime}`;
    }

    // If this is the currently playing track, update minimized player too
    if (window.podcastState.currentlyPlaying === player) {
        updateMinimizedProgress(percent);
        updateMinimizedTime(player);
    }
}

// Update minimized player progress with thumb
function updateMinimizedProgress(percent) {
    const miniProgressIndicator = document.querySelector('.mini-progress-indicator');
    const miniProgressThumb = document.querySelector('.mini-progress-thumb');

    if (miniProgressIndicator) {
        miniProgressIndicator.style.width = `${percent}%`;
    }

    if (miniProgressThumb) {
        miniProgressThumb.style.left = `${percent}%`;
    }
}

// Update minimized player time display with current time only
function updateMinimizedTime(player) {
    const miniTimeDisplay = document.querySelector('.mini-time-display');
    if (miniTimeDisplay && player.state() === 'loaded') {
        const currentTime = formatTime(player.seek() || 0);
        miniTimeDisplay.textContent = currentTime;
    }
}

// Update minimized player info with volume
function updateMinimizedPlayer(playerElement, isPlaying) {
    const minimizedPlayer = document.querySelector('.minimized-player');
    const miniEpisodeNumber = minimizedPlayer.querySelector('.mini-episode-number');
    const miniTitle = minimizedPlayer.querySelector('.mini-title');
    const episodeNumber = playerElement.closest('.podcast-card').getAttribute('data-episode');
    const episodeTitle = playerElement.getAttribute('data-title');

    // Update info
    miniEpisodeNumber.textContent = `Episódio ${episodeNumber}`;
    miniTitle.textContent = episodeTitle;

    // Update volume display based on current player
    if (window.podcastState.currentlyPlaying) {
        const currentVolume = window.podcastState.currentlyPlaying.volume();
        window.updateVolumeDisplay(currentVolume);
    }

    // Show minimized player
    minimizedPlayer.style.display = 'flex';
}

// Update all progress bars (for minimized player interaction)
function updateAllProgressBars() {
    if (window.podcastState.currentlyPlaying && window.podcastState.currentEpisodeElement) {
        updateProgressBar(window.podcastState.currentEpisodeElement, window.podcastState.currentlyPlaying);
    }
}

// Start progress update interval with proper time updates
function startProgressInterval(playerElement, player) {
    // Clear any existing interval
    if (playerElement.progressInterval) {
        clearInterval(playerElement.progressInterval);
    }

    // Create new interval that updates every 100ms for smooth progress
    playerElement.progressInterval = setInterval(() => {
        if (player.playing()) {
            updateProgressBar(playerElement, player);
        }
    }, 100);
}

// Play next episode
function playNextEpisode(currentEpisodeNumber) {
    const nextEpisodeNumber = parseInt(currentEpisodeNumber) + 1;
    if (podcastState.players[nextEpisodeNumber]) {
        setTimeout(() => {
            if (confirm('Reproduzir próximo episódio?')) {
                podcastState.players[nextEpisodeNumber].howl.play();
            }
        }, 500);
    }
}

// Setup scroll listener to show/hide minimized player
function setupScrollListener() {
    window.addEventListener('scroll', function () {
        if (!window.podcastState.currentlyPlaying || !window.podcastState.currentEpisodeElement) return;

        const podcastCard = window.podcastState.currentEpisodeElement.closest('.podcast-card');
        const cardRect = podcastCard.getBoundingClientRect();
        const minimizedPlayer = document.querySelector('.minimized-player');

        // Show minimized player when the current card is out of view
        if (cardRect.bottom < 0 || cardRect.top > window.innerHeight) {
            minimizedPlayer.style.display = 'flex';
        } else {
            minimizedPlayer.style.display = 'none';
        }
    });
}

// Setup keyboard controls
function setupKeyboardControls() {
    document.addEventListener('keydown', function (e) {
        // Only handle if we have a currently playing track
        if (!window.podcastState.currentlyPlaying) return;

        // Skip if we're in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayback(window.podcastState.currentlyPlaying, window.podcastState.currentEpisodeElement);
                break;

            case 'ArrowLeft':
                e.preventDefault();
                // Skip back 10 seconds
                const currentTime = window.podcastState.currentlyPlaying.seek() || 0;
                window.podcastState.currentlyPlaying.seek(Math.max(0, currentTime - 10));
                updateAllProgressBars();
                break;

            case 'ArrowRight':
                e.preventDefault();
                // Skip forward 10 seconds
                const currentPos = window.podcastState.currentlyPlaying.seek() || 0;
                window.podcastState.currentlyPlaying.seek(Math.min(window.podcastState.currentlyPlaying.duration(), currentPos + 10));
                updateAllProgressBars();
                break;
        }
    });
}

// Format time utility
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize volume display on page load
document.addEventListener('DOMContentLoaded', function () {
    const savedVolume = localStorage.getItem('podcast_volume');
    if (savedVolume) {
        setTimeout(() => {
            window.updateVolumeDisplay(parseFloat(savedVolume));
        }, 100);
    }
});
