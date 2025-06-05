// Responsive utilities for mobile-friendly UI scaling

export class ResponsiveManager {    constructor() {
        this.updateScreenInfo();
        this.orientationChangeInProgress = false;
        
        // Track user interaction for vibration API
        this.hasUserInteracted = false;
        this.setupUserInteractionTracking();
        
        // Update on resize
        window.addEventListener('resize', () => this.updateScreenInfo());
        
        // Enhanced orientation change handling
        window.addEventListener('orientationchange', () => {
            this.orientationChangeInProgress = true;
            
            // First immediate update
            this.updateScreenInfo();
            
            // Then follow-up updates to ensure everything settles
            setTimeout(() => this.updateScreenInfo(), 100);
            setTimeout(() => {
                this.updateScreenInfo();
                this.orientationChangeInProgress = false;
            }, 500);
        });
    }
    
    setupUserInteractionTracking() {
        // Track first user interaction to enable vibration API
        const markUserInteraction = () => {
            this.hasUserInteracted = true;
            // Remove listeners after first interaction
            document.removeEventListener('touchstart', markUserInteraction, { passive: true });
            document.removeEventListener('mousedown', markUserInteraction, { passive: true });
            document.removeEventListener('keydown', markUserInteraction, { passive: true });
        };
        
        document.addEventListener('touchstart', markUserInteraction, { passive: true });
        document.addEventListener('mousedown', markUserInteraction, { passive: true });
        document.addEventListener('keydown', markUserInteraction, { passive: true });
    }
    
    updateScreenInfo() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.isMobile = this.screenWidth <= 768;
        this.isSmallMobile = this.screenWidth <= 480;
        this.isLandscape = this.screenWidth > this.screenHeight;
        this.scaleFactor = this.calculateScaleFactor();
        this.safeAreaTop = this.getSafeAreaTop();
        this.safeAreaBottom = this.getSafeAreaBottom();
    }
    
    calculateScaleFactor() {
        // Base scale factor for different screen sizes
        if (this.isSmallMobile) {
            return 0.7; // Smaller UI for small phones
        } else if (this.isMobile) {
            return 0.85; // Slightly smaller UI for tablets/large phones
        }
        return 1.0; // Full size for desktop
    }
    
    getSafeAreaTop() {
        // Account for notches and status bars
        if (this.isMobile) {
            return Math.max(20, this.screenHeight * 0.05);
        }
        return 0;
    }
    
    getSafeAreaBottom() {
        // Account for home indicators and navigation bars
        if (this.isMobile) {
            return Math.max(20, this.screenHeight * 0.05);
        }
        return 0;
    }
      // Get responsive dimensions for UI elements
    getGamePanelConfig() {
        if (this.isMobile) {
            // Create a wider panel for mobile to accommodate all indicators
            const baseWidth = this.isSmallMobile ? 300 : 340;
            const baseHeight = this.isSmallMobile ? 110 : 130;
            
            return {
                x: 10 * this.scaleFactor,
                y: this.safeAreaTop + 10,
                width: baseWidth * this.scaleFactor,
                height: baseHeight * this.scaleFactor,
                padding: 8 * this.scaleFactor,
                fontSize: {
                    title: Math.max(12, 16 * this.scaleFactor),
                    value: Math.max(14, 18 * this.scaleFactor),
                    small: Math.max(10, 12 * this.scaleFactor)
                }
            };
        }
        
        // Desktop configuration
        return {
            x: 20,
            y: 20,
            width: 280,
            height: 140,
            padding: 15,
            fontSize: {
                title: 22,
                value: 26,
                small: 14
            }
        };
    }
      getWindPanelConfig() {
        if (this.isMobile) {
            // We don't need a separate wind panel anymore as we'll integrate it
            // But keep this for backward compatibility
            const baseWidth = this.isSmallMobile ? 140 : 160;
            const baseHeight = this.isSmallMobile ? 50 : 60;
            
            return {
                x: this.screenWidth - (baseWidth * this.scaleFactor) - (10 * this.scaleFactor),
                y: this.safeAreaTop + (10 + baseHeight) * this.scaleFactor, // Position below the space where it was
                width: baseWidth * this.scaleFactor,
                height: baseHeight * this.scaleFactor,
                fontSize: {
                    title: Math.max(10, 14 * this.scaleFactor),
                    value: Math.max(9, 12 * this.scaleFactor)
                }
            };
        }
        
        // Desktop configuration
        return {
            x: this.screenWidth - 220,
            y: 5,
            width: 215,
            height: 70,
            fontSize: {
                title: 18,
                value: 16
            }
        };
    }
    
    getWindIndicatorConfig() {
        const baseRadius = this.isMobile ? 20 : 30;
        return {
            x: this.screenWidth * 0.85,
            y: this.screenHeight * (this.isMobile ? 0.12 : 0.15),
            radius: baseRadius * this.scaleFactor,
            arrowLength: (this.isMobile ? 35 : 50) * this.scaleFactor
        };
    }      getBannerConfig() {
        if (this.isMobile) {
            // Calculate width that works well on any device
            const baseWidth = Math.min(this.screenWidth * 0.9, 280);
            const baseHeight = this.isSmallMobile ? 40 : 50;
            const gamePanelConfig = this.getGamePanelConfig();
            
            return {
                x: this.screenWidth / 2 - (baseWidth * this.scaleFactor) / 2,
                // Position below the game panel with some spacing
                y: gamePanelConfig.y + gamePanelConfig.height + 20 * this.scaleFactor,
                width: baseWidth * this.scaleFactor,
                height: baseHeight * this.scaleFactor,
                fontSize: Math.max(16, (this.isSmallMobile ? 18 : 24) * this.scaleFactor)
            };
        }
        
        // Desktop configuration
        return {
            x: this.screenWidth / 2 - 160,
            y: 30,
            width: 320,
            height: 54,
            fontSize: 32
        };
    }
      getEndGameBannerConfig() {
        if (this.isMobile) {
            // Calculate width based on screen size, ensuring it's not too wide
            const baseWidth = Math.min(this.screenWidth * 0.95, 320);
            const baseHeight = this.isSmallMobile ? 120 : 140;
            
            return {
                x: this.screenWidth / 2 - (baseWidth * this.scaleFactor) / 2,
                y: this.screenHeight / 2 - (baseHeight * this.scaleFactor) / 2,
                width: baseWidth * this.scaleFactor,
                height: baseHeight * this.scaleFactor,
                fontSize: {
                    title: Math.max(18, (this.isSmallMobile ? 20 : 26) * this.scaleFactor),
                    score: Math.max(14, (this.isSmallMobile ? 16 : 20) * this.scaleFactor)
                }
            };
        }
        
        // Desktop configuration
        return {
            x: this.screenWidth / 2 - 220,
            y: this.screenHeight / 2 - 80,
            width: 440,
            height: 160,
            fontSize: {
                title: 36,
                score: 28
            }
        };
    }
    
    getPlayAgainButtonConfig() {
        if (this.isMobile) {
            const baseWidth = this.isSmallMobile ? 140 : 160;
            const baseHeight = this.isSmallMobile ? 40 : 50;
            
            return {
                width: baseWidth,
                height: baseHeight,
                fontSize: this.isSmallMobile ? 16 : 18,
                offsetY: this.isSmallMobile ? 80 : 100
            };
        }
        
        // Desktop configuration
        return {
            width: 200,
            height: 60,
            fontSize: 22,
            offsetY: 120
        };
    }
    
    getSpeechBubbleConfig() {
        if (this.isMobile) {
            const baseWidth = this.isSmallMobile ? 100 : 120;
            const baseHeight = this.isSmallMobile ? 35 : 45;
            
            return {
                width: baseWidth * this.scaleFactor,
                height: baseHeight * this.scaleFactor,
                fontSize: Math.max(10, 12 * this.scaleFactor),
                tailSize: 8 * this.scaleFactor
            };
        }
        
        // Desktop configuration
        return {
            width: 140,
            height: 50,
            fontSize: 16,
            tailSize: 12
        };
    }
    
    // Performance optimization methods for mobile
    getOptimalFrameRate() {
        // Reduce frame rate on very small mobile devices for better performance
        if (this.isSmallMobile) {
            return 45; // 45fps for small mobile
        } else if (this.isMobile) {
            return 50; // 50fps for mobile
        }
        return 60; // 60fps for desktop
    }
    
    // Check if orientation change is in progress
    isOrientationChanging() {
        return this.orientationChangeInProgress;
    }
    
    shouldReduceEffects() {
        // Reduce visual effects on mobile for better performance
        return this.isMobile;
    }
    
    getParticleCount() {
        // Reduce particle count on mobile
        if (this.isSmallMobile) {
            return 8; // Fewer particles on small mobile
        } else if (this.isMobile) {
            return 12; // Moderate particles on mobile
        }
        return 20; // Full particles on desktop
    }
    
    // Check device performance for more granular optimization
    getDevicePerformanceLevel() {
        // Try to estimate device performance level (1-3)
        // Level 1: Low-end devices - very optimized rendering
        // Level 2: Mid-range devices - moderately optimized rendering
        // Level 3: High-end devices - full experience
        
        if (this.isSmallMobile) {
            return 1; // Assume smaller screen = lower performance
        }
        
        if (this.isMobile) {
            // Try to use available performance APIs
            if (window.navigator && window.navigator.hardwareConcurrency) {
                const cores = window.navigator.hardwareConcurrency;
                if (cores <= 2) return 1;
                if (cores <= 4) return 2;
                return 3;
            }
            return 2; // Default to medium performance for mobile
        }
        
        return 3; // Desktop gets highest performance level
    }
    
    // Helper method to get scaled font
    getScaledFont(baseSize, weight = 'bold', family = '"Inter", "Segoe UI", system-ui, sans-serif') {
        const scaledSize = Math.max(10, baseSize * this.scaleFactor);
        return `${weight} ${scaledSize}px ${family}`;
    }
    
    // Helper method for touch-friendly sizes
    getTouchTargetSize() {
        return this.isMobile ? 44 : 32; // 44px is recommended minimum touch target
    }
    
    // Touch interaction helpers
    getTouchEventPosition(event) {
        const rect = event.target.getBoundingClientRect();
        const touch = event.touches[0] || event.changedTouches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }
      // Provide haptic feedback for important actions (if supported)
    provideTapFeedback(intensity = 'medium') {
        // Only provide vibration if user has interacted with the page
        if (!this.isMobile || !window.navigator.vibrate || !this.hasUserInteracted) return;
        
        // Different intensities for different actions
        const durations = {
            'light': 10,
            'medium': 20,
            'strong': 35
        };
        
        try {
            window.navigator.vibrate(durations[intensity] || 20);
        } catch (e) {
            // Silently fail if vibration API not supported
        }
    }
    
    isValidTouchTarget(element, minSize = null) {
        const size = minSize || this.getTouchTargetSize();
        const rect = element.getBoundingClientRect();
        return rect.width >= size && rect.height >= size;
    }
    
    // Game-specific responsive configurations
    getBowConfig() {
        return {
            x: this.screenWidth * 0.2,
            y: this.screenHeight * 0.5,
            width: this.screenWidth * 0.025,
            height: this.screenHeight * 0.1
        };
    }
    
    getTargetConfig() {
        const baseRatio = this.isMobile ? 0.018 : 0.012; // Slightly larger target on mobile
        return {
            x: this.screenWidth * 0.75,
            y: this.screenHeight * 0.5,
            radius: this.screenWidth * baseRatio
        };
    }
}

// Singleton instance
export const responsive = new ResponsiveManager();
