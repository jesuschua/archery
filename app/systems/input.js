// Input system for the archery game with mobile optimizations
import { responsive } from '../utils/responsiveUtils.js';
import { createTouchFeedback } from './touchFeedback.js';

let inputEnabled = true;
let helperMode = false;
let lastTouchTime = 0; // Used to prevent double-firing on mobile

export function setupInputHandlers(bow, arrow, updateWind, onArrowRelease) {
    function updateBowAngle(e) {
        if (!inputEnabled || arrow.fired) return;
        
        // Prevent default behavior to avoid scrolling on mobile
        e.preventDefault();
        
        let pos;
        if (e.touches) {
            // Mobile touch event
            pos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else {
            // Mouse event
            pos = { x: e.clientX, y: e.clientY };
        }
        
        let dx = pos.x - bow.x;
        let dy = pos.y - bow.y;
        bow.angle = Math.atan2(dy, dx);
        arrow.angle = bow.angle;
    }    function startPulling(e) { 
        if (!inputEnabled) return;
        
        // Prevent default to avoid unwanted behavior
        if (e.type === 'touchstart') {
            e.preventDefault();
            
            // Create visual touch feedback
            const touchPos = responsive.getTouchEventPosition(e);
            createTouchFeedback(touchPos.x, touchPos.y);
            
            // Provide haptic feedback when starting to pull bow on mobile
            responsive.provideTapFeedback('light');
        }
        
        bow.pulling = true;
    }    function releaseArrow(e) {
        if (!inputEnabled) return;
        
        // Debounce touch events to prevent double-firing
        if (e.type === 'touchend') {
            const now = Date.now();
            if (now - lastTouchTime < 300) return; // Prevent rapid firing
            lastTouchTime = now;
            
            // Create touch feedback at arrow release point
            const touchPos = responsive.getTouchEventPosition(e);
            createTouchFeedback(touchPos.x, touchPos.y, '#FF6B00');
        }
        
        if (bow.pulling) {
            updateWind();
            arrow.fired = true;
            
            // Provide stronger haptic feedback when releasing arrow on mobile
            if (e.type === 'touchend') {
                responsive.provideTapFeedback('medium');
            }
            
            // Scale arrow speed for mobile
            const baseSpeed = 30;
            arrow.speed = responsive.isMobile ? baseSpeed * 0.9 : baseSpeed;
            
            arrow.vx = arrow.speed * Math.cos(bow.angle);
            arrow.vy = arrow.speed * Math.sin(bow.angle);
            bow.pulling = false;
            arrow.releaseAngle = bow.angle;
            onArrowRelease && onArrowRelease();
        }
    }// Add keyboard listener for helper mode toggle
    function handleKeyPress(e) {
        if (e.key === 'h' || e.key === 'H') {
            toggleHelperMode();
        }
    }
      // Add helper mode toggle for mobile with double tap
    function handleDoubleTap(e) {
        if (!responsive.isMobile) return;
        
        const now = Date.now();
        if (now - lastTouchTime < 300) {
            toggleHelperMode();
            e.preventDefault(); // Prevent other actions
            
            // Provide haptic feedback when toggling helper mode
            responsive.provideTapFeedback('light');
        }
        lastTouchTime = now;
    }
    
    // Desktop event handlers
    window.addEventListener('mousemove', updateBowAngle, { passive: false });
    window.addEventListener('mousedown', startPulling, { passive: false });
    window.addEventListener('mouseup', releaseArrow, { passive: false });
    
    // Mobile event handlers with passive: false for better performance
    window.addEventListener('touchmove', updateBowAngle, { passive: false });
    window.addEventListener('touchstart', startPulling, { passive: false });
    window.addEventListener('touchend', releaseArrow, { passive: false });
    
    // Double tap for helper mode on mobile
    if (responsive.isMobile) {
        window.addEventListener('touchstart', handleDoubleTap, { passive: false });
    }
    
    // Keyboard for desktop
    window.addEventListener('keydown', handleKeyPress);
}

export function setInputEnabled(enabled) {
    inputEnabled = enabled;
}

export function isInputEnabled() {
    return inputEnabled;
}

export function toggleHelperMode() {
    helperMode = !helperMode;
    console.log(`Helper Mode: ${helperMode ? 'ENABLED' : 'DISABLED'}`);
    return helperMode;
}

export function isHelperModeEnabled() {
    return helperMode;
}

export function setHelperMode(enabled) {
    helperMode = enabled;
}
