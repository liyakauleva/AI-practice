// Automated tests for https://fakestoreapi.com/products with final console output

async function runTests() {
    const apiUrl = 'https://fakestoreapi.com/products';
    const defectList = [];

    try {
        const response = await fetch(apiUrl);

        if (response.status !== 200) {
            console.error(`❌ Expected response code 200 but got ${response.status}`);
            return;
        }

        const products = await response.json();

        products.forEach((product, index) => {
            let hasDefect = false;
            const defects = [];

            // Check title
            if (!product.title || product.title.trim() === '') {
                defects.push('Missing or empty title');
                hasDefect = true;
            }

            // Check price
            if (typeof product.price !== 'number' || product.price < 0) {
                defects.push('Negative or invalid price');
                hasDefect = true;
            }

            // Check rating.rate
            if (
                !product.rating ||
                typeof product.rating.rate !== 'number' ||
                product.rating.rate > 5
            ) {
                defects.push('Invalid or excessive rating.rate');
                hasDefect = true;
            }

            if (hasDefect) {
                defectList.push({
                    index: index + 1,
                    id: product.id,
                    title: product.title,
                    defects: defects
                });
            }
        });

        return defectList;

    } catch (error) {
        console.error('❌ Error fetching or processing data:', error);
        return [];
    }
}

// Run the tests and output the results to console
runTests().then((result) => {
    if (!result || result.length === 0) {
        console.log('✅ No defects found. All products passed the checks.');
    } else {
        console.warn(`⚠️ Found ${result.length} products with defects:`);
        result.forEach((item) => {
            console.warn(`- [Product #${item.index} | ID: ${item.id} | Title: ${item.title}]: ${item.defects.join('; ')}`);
        });
    }
});
