// Cart Sharing Utilities

class CartSharingService {
    constructor() {
        this.baseUrl = window.location.origin;
    }

    // Generate shareable cart link
    generateShareLink(cartId) {
        return `${this.baseUrl}/pages/join-cart.html?id=${cartId}`;
    }

    // Generate WhatsApp share message
    shareViaWhatsApp(cart) {
        const message = `🛒 Join my ${cart.platform} cart and save money!\n\n` +
            `💰 Delivery Charge: ₹${cart.deliveryCharge}\n` +
            `👥 Split Amount: ₹${cart.deliveryCharge / cart.maxMembers}\n` +
            `📍 Location: ${cart.location.city}\n` +
            `👤 Members: ${cart.members.length}/${cart.maxMembers}\n\n` +
            `Join here: ${this.generateShareLink(cart._id)}`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }

    // Share via native Web Share API
    async shareNative(cart) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Join my ${cart.platform} cart`,
                    text: `Save money by splitting ₹${cart.deliveryCharge} delivery charge. Only ₹${cart.deliveryCharge / cart.maxMembers} per person!`,
                    url: this.generateShareLink(cart._id)
                });
                return true;
            } catch (error) {
                console.error('Error sharing:', error);
                return false;
            }
        }
        return false;
    }

    // Copy link to clipboard
    async copyLink(cartId) {
        const link = this.generateShareLink(cartId);
        try {
            await navigator.clipboard.writeText(link);
            return true;
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }

    // Deep links to delivery platforms
    getDeliveryPlatformLinks(platform, location) {
        const links = {
            blinkit: {
                web: 'https://blinkit.com',
                android: 'intent://blinkit.com#Intent;scheme=https;package=com.grofers.customerapp;end',
                ios: 'blinkit://'
            },
            zepto: {
                web: 'https://www.zeptonow.com',
                android: 'intent://zeptonow.com#Intent;scheme=https;package=com.zepto.consumer;end',
                ios: 'zepto://'
            },
            swiggy: {
                web: 'https://www.swiggy.com/instamart',
                android: 'intent://swiggy.com/instamart#Intent;scheme=https;package=in.swiggy.android;end',
                ios: 'swiggy://'
            },
            bigbasket: {
                web: 'https://www.bigbasket.com',
                android: 'intent://bigbasket.com#Intent;scheme=https;package=com.bigbasket.mobileapp;end',
                ios: 'bigbasket://'
            }
        };

        return links[platform.toLowerCase()] || links.blinkit;
    }

    // Open delivery platform
    openDeliveryApp(platform) {
        const links = this.getDeliveryPlatformLinks(platform);
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/android/.test(userAgent)) {
            window.location.href = links.android;
            setTimeout(() => {
                window.location.href = links.web;
            }, 2000);
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
            window.location.href = links.ios;
            setTimeout(() => {
                window.location.href = links.web;
            }, 2000);
        } else {
            window.open(links.web, '_blank');
        }
    }

    // Generate QR Code (using QR Code API)
    generateQRCode(cartId) {
        const link = this.generateShareLink(cartId);
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
    }

    // Share via Email
    shareViaEmail(cart) {
        const subject = `Join my ${cart.platform} cart on ShareCart`;
        const body = `Hi there!\n\n` +
            `I've created a cart on ${cart.platform} and we can split the delivery charges.\n\n` +
            `Details:\n` +
            `- Platform: ${cart.platform}\n` +
            `- Delivery Charge: ₹${cart.deliveryCharge}\n` +
            `- Your Split: ₹${cart.deliveryCharge / cart.maxMembers}\n` +
            `- Location: ${cart.location.city}\n\n` +
            `Join here: ${this.generateShareLink(cart._id)}\n\n` +
            `Let's save money together!`;
        
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // Share via SMS
    shareViaSMS(cart, phoneNumber = '') {
        const message = `Join my ${cart.platform} cart! Save ₹${cart.deliveryCharge - (cart.deliveryCharge / cart.maxMembers)}. ` +
            `Join: ${this.generateShareLink(cart._id)}`;
        
        if (/android/.test(navigator.userAgent.toLowerCase())) {
            window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        } else {
            window.location.href = `sms:${phoneNumber}&body=${encodeURIComponent(message)}`;
        }
    }

    // Share on Social Media
    shareOnFacebook(cart) {
        const link = this.generateShareLink(cart._id);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
    }

    shareOnTwitter(cart) {
        const text = `Join my ${cart.platform} cart and save money on delivery! Only ₹${cart.deliveryCharge / cart.maxMembers} per person.`;
        const link = this.generateShareLink(cart._id);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, '_blank');
    }

    shareOnLinkedIn(cart) {
        const link = this.generateShareLink(cart._id);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`, '_blank');
    }
}

// Create global instance
const cartSharing = new CartSharingService();
