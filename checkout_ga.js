// Function to extract data from the page
function extractPageData() {
    const orderSummaryElement = document.querySelector('section.order-summary');
    const productNameElement = document.querySelector("#order-summary-product");

    if (orderSummaryElement && productNameElement) {
        const productName = productNameElement.textContent.trim().replace(/^\s*\\n\s*|\s*\\n\s*$/g, '').replace(/\s+/g, ' ');
        const productId = productName.replace(/\s+/g, '-').replace(/[\(\)]/g, '').toLowerCase();
        const basePrice = parseFloat(orderSummaryElement.getAttribute('data-base-price') || '0');

        return {
            productName,
            productId,
            totalValue: basePrice,
            currency: 'USD', // Assuming USD, modify if needed
            quantity: 1 // Assuming quantity of 1, modify if needed
        };
    }
    return null;
}

// Function to send checkout data to parent
function sendCheckoutData(data) {
    try {
        const postObject = JSON.stringify({
            event: data.eventName,
            value: data.totalValue,
            currency: data.currency,
            items: [
                {
                    'item_id': data.productId,
                    'item_name': data.productName,
                    'price': data.totalValue,
                    'quantity': data.quantity
                }
            ]
        });
        parent.postMessage(postObject, data.parentDomain);
        console.log('Checkout data sent:', postObject);
    } catch (e) {
        console.error('Error sending checkout data:', e);
    }
}

// Main execution function
function main(config) {
    let checkoutData = config;

    if (config.useAutoExtraction) {
        // Try to extract data from the page
        const extractedData = extractPageData();
        if (extractedData) {
            console.log('Using automatically extracted data');
            checkoutData = { ...config, ...extractedData };
        } else {
            console.log('Automatic extraction failed, using static config');
        }
    } else {
        console.log('Using static configuration (auto-extraction disabled)');
    }

    // Send the checkout data
    sendCheckoutData(checkoutData);
}
