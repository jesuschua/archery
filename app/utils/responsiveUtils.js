// Responsive utilities for mobile-friendly UI scaling

export class ResponsiveManager {
    constructor() {
        this.updateScreenInfo();
        // Update on resize/orientation change
        window.addEventListener('resize', () => this.updateScreenInfo());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateScreenInfo(), 100);
        });
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
            const baseWidth = this.isSmallMobile ? 200 : 240;
            const baseHeight = this.isSmallMobile ? 100 : 120;
            
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
            const baseWidth = this.isSmallMobile ? 140 : 160;
            const baseHeight = this.isSmallMobile ? 50 : 60;
            
            return {
                x: this.screenWidth - (baseWidth * this.scaleFactor) - (10 * this.scaleFactor),
                y: this.safeAreaTop + 10,
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
    }
    
    getBannerConfig() {
        if (this.isMobile) {
            const baseWidth = Math.min(this.screenWidth * 0.9, 280);
            const baseHeight = this.isSmallMobile ? 40 : 50;
            
            return {
                x: this.screenWidth / 2 - baseWidth / 2,
                y: this.safeAreaTop + 20,
                width: baseWidth,
                height: baseHeight,
                fontSize: this.isSmallMobile ? 18 : 24
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
            const baseWidth = Math.min(this.screenWidth * 0.95, 320);
            const baseHeight = this.isSmallMobile ? 120 : 140;
            
            return {
                x: this.screenWidth / 2 - baseWidth / 2,
                y: this.screenHeight / 2 - baseHeight / 2,
                width: baseWidth,
                height: baseHeight,
                fontSize: {
                    title: this.isSmallMobile ? 20 : 26,
                    score: this.isSmallMobile ? 16 : 20
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
