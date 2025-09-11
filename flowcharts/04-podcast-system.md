# AESI Website - Podcast System

```mermaid
flowchart TD
    %% Podcast Entry
    PODCAST_START[Podcast Interface Entry] --> LOAD_EPISODES[Load Available Episodes]
    
    %% Episode Loading
    LOAD_EPISODES --> EPISODE_CHECK{Episodes Available?}
    EPISODE_CHECK -->|No| NO_EPISODES[Display No Episodes Message]
    EPISODE_CHECK -->|Yes| EPISODE_LIST[Display Episode List]
    
    %% Episode Selection
    EPISODE_LIST --> SELECT_EPISODE{User Selects Episode}
    SELECT_EPISODE --> INIT_HOWLER[Initialize Howler.js Player]
    INIT_HOWLER --> SETUP_PLAYER[Setup Player Controls]
    SETUP_PLAYER --> PLAYER_READY[Player Ready State]
    
    %% Player Controls
    PLAYER_READY --> PLAYER_CONTROLS[Display Player Controls]
    PLAYER_CONTROLS --> PLAYER_ACTIONS{Player Action}
    
    %% Playback Actions
    PLAYER_ACTIONS -->|Play| PLAY_AUDIO[Play Audio]
    PLAYER_ACTIONS -->|Pause| PAUSE_AUDIO[Pause Audio]
    PLAYER_ACTIONS -->|Skip Forward| SKIP_FORWARD[Skip Forward 15s]
    PLAYER_ACTIONS -->|Skip Backward| SKIP_BACKWARD[Skip Backward 15s]
    PLAYER_ACTIONS -->|Volume| ADJUST_VOLUME[Adjust Volume]
    PLAYER_ACTIONS -->|Seek| SEEK_POSITION[Seek to Position]
    PLAYER_ACTIONS -->|Next Episode| AUTO_NEXT[Auto-play Next Episode]
    
    %% Player State Management
    PLAY_AUDIO --> UPDATE_UI_PLAY[Update UI - Playing State]
    PAUSE_AUDIO --> UPDATE_UI_PAUSE[Update UI - Paused State]
    SKIP_FORWARD --> UPDATE_PROGRESS[Update Progress Display]
    SKIP_BACKWARD --> UPDATE_PROGRESS
    SEEK_POSITION --> UPDATE_PROGRESS
    ADJUST_VOLUME --> UPDATE_VOLUME_UI[Update Volume Display]
    
    %% Minimized Player
    UPDATE_UI_PLAY --> SHOW_MINIMIZED[Show Minimized Player]
    UPDATE_UI_PAUSE --> SHOW_MINIMIZED
    UPDATE_PROGRESS --> SHOW_MINIMIZED
    UPDATE_VOLUME_UI --> SHOW_MINIMIZED
    
    %% Auto-play Logic
    AUTO_NEXT --> NEXT_EPISODE_CHECK{Next Episode Available?}
    NEXT_EPISODE_CHECK -->|Yes| LOAD_NEXT_EPISODE[Load Next Episode]
    NEXT_EPISODE_CHECK -->|No| PLAYLIST_END[End of Playlist]
    LOAD_NEXT_EPISODE --> INIT_HOWLER
    
    %% Persistent Player
    SHOW_MINIMIZED --> MINIMIZED_CONTROLS[Minimized Player Controls]
    MINIMIZED_CONTROLS --> MINI_ACTIONS{Minimized Action}
    MINI_ACTIONS -->|Play/Pause| TOGGLE_PLAYBACK[Toggle Playback]
    MINI_ACTIONS -->|Skip| MINI_SKIP[Skip in Minimized Mode]
    MINI_ACTIONS -->|Volume| MINI_VOLUME[Adjust Volume in Mini Mode]
    MINI_ACTIONS -->|Expand| EXPAND_PLAYER[Return to Full Player]
    
    TOGGLE_PLAYBACK --> SHOW_MINIMIZED
    MINI_SKIP --> SHOW_MINIMIZED
    MINI_VOLUME --> SHOW_MINIMIZED
    EXPAND_PLAYER --> PLAYER_CONTROLS
    
    %% Progress Tracking
    UPDATE_PROGRESS --> PROGRESS_ACTIONS{Progress Action}
    PROGRESS_ACTIONS -->|Time Update| UPDATE_TIME_DISPLAY[Update Time Display]
    PROGRESS_ACTIONS -->|Progress Bar| UPDATE_PROGRESS_BAR[Update Progress Bar]
    PROGRESS_ACTIONS -->|Episode End| EPISODE_ENDED[Episode Completed]
    
    EPISODE_ENDED --> AUTO_NEXT
    
    %% Styling
    classDef podcast fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
    classDef player fill:#06b6d4,stroke:#fff,stroke-width:2px,color:#fff
    classDef interactive fill:#7209b7,stroke:#fff,stroke-width:2px,color:#fff
    classDef decision fill:#fb5607,stroke:#fff,stroke-width:2px,color:#fff
    classDef state fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff
    
    class LOAD_EPISODES,EPISODE_LIST,INIT_HOWLER,SETUP_PLAYER podcast
    class PLAY_AUDIO,PAUSE_AUDIO,SKIP_FORWARD,SKIP_BACKWARD,ADJUST_VOLUME,SEEK_POSITION player
    class PLAYER_CONTROLS,MINIMIZED_CONTROLS,UPDATE_PROGRESS,SHOW_MINIMIZED interactive
    class SELECT_EPISODE,PLAYER_ACTIONS,NEXT_EPISODE_CHECK,MINI_ACTIONS decision
    class UPDATE_UI_PLAY,UPDATE_UI_PAUSE,PLAYER_READY,PLAYLIST_END state
```

## Podcast System Features

### Core Functionality
- **Howler.js Integration**: Professional audio playback with cross-browser support
- **Episode Management**: Dynamic loading and organization of educational content
- **Persistent Player**: Minimized player continues across page navigation
- **Auto-play Features**: Seamless episode transitions with playlist support

### Player Controls
1. **Basic Controls**: Play, pause, skip forward/backward (15s increments)
2. **Advanced Controls**: Volume adjustment, seek to position, speed control
3. **Progress Tracking**: Real-time progress bar and time display
4. **Episode Navigation**: Next/previous episode with auto-play

### Educational Content
- **Structured Episodes**: Organized by topic and difficulty
- **Audio Quality**: High-quality educational recordings
- **Accessibility**: Keyboard controls and screen reader support
- **Mobile Optimization**: Touch-friendly controls and responsive design

### Technical Features
- **Background Playback**: Continues playing while browsing other pages
- **State Persistence**: Remembers playback position and settings
- **Error Handling**: Graceful handling of network issues and audio errors
- **Performance**: Optimized loading and minimal resource usage
