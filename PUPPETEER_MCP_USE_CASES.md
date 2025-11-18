# Puppeteer MCP Server - 20 Comprehensive Use Cases

## Overview

The Puppeteer MCP server provides comprehensive browser automation capabilities through the Model Context Protocol, enabling AI assistants to interact with web pages, execute JavaScript, capture screenshots, and perform complex web automation tasks in real browser environments.

## Core Capabilities

- **Browser Automation**: Navigate, click, fill forms, and interact with web elements
- **Screenshot Capture**: Full-page or element-specific screenshots
- **JavaScript Execution**: Run custom JavaScript in page context
- **Console Monitoring**: Track browser console messages
- **Resource Management**: Manage browser instances and pages
- **Form Interaction**: Automated form filling and submission
- **Element Selection**: CSS and XPath selectors
- **Network Monitoring**: Track requests and responses

## Installation

### NPX (Simplest):
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### Docker:
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "--init", "-e", "DOCKER_CONTAINER=true", "mcp/puppeteer"]
    }
  }
}
```

---

## 20 Practical Use Cases

### 1. **Automated Competitive Research**
**Scenario**: Monitor competitor websites for pricing and product changes.

**Use Case**: Navigate to competitor e-commerce sites, extract product prices, features, and availability. Take screenshots of product pages and compile a competitive analysis report.

**Implementation Example**:
```javascript
// User request: "Monitor competitor product pages and extract pricing"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function competitiveResearch() {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    // Define competitor products to monitor
    const competitors = [
        {
            name: 'Competitor A',
            url: 'https://competitorA.com/product/widget-pro',
            priceSelector: '.product-price',
            availabilitySelector: '.stock-status'
        },
        {
            name: 'Competitor B',
            url: 'https://competitorB.com/items/widget-pro',
            priceSelector: '#price-tag',
            availabilitySelector: '.availability'
        }
    ];

    const results = [];

    for (const competitor of competitors) {
        console.log(`Checking ${competitor.name}...`);

        // Navigate to product page
        await page.goto(competitor.url, {
            waitUntil: 'networkidle2'
        });

        // Extract price
        const price = await page.$eval(competitor.priceSelector,
            el => el.textContent.trim());

        // Extract availability
        const availability = await page.$eval(competitor.availabilitySelector,
            el => el.textContent.trim());

        // Extract product title
        const title = await page.$eval('h1.product-title',
            el => el.textContent.trim());

        // Take screenshot
        const screenshotPath = `./screenshots/${competitor.name}_${Date.now()}.png`;
        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

        // Collect data
        results.push({
            competitor: competitor.name,
            product: title,
            price: price,
            availability: availability,
            url: competitor.url,
            screenshot: screenshotPath,
            timestamp: new Date().toISOString()
        });

        console.log(`✓ ${competitor.name}: ${price} - ${availability}`);
    }

    // Generate report
    const report = {
        reportDate: new Date().toISOString(),
        products: results,
        summary: {
            lowestPrice: Math.min(...results.map(r =>
                parseFloat(r.price.replace(/[^0-9.]/g, '')))),
            totalCompetitors: results.length,
            inStock: results.filter(r =>
                r.availability.toLowerCase().includes('in stock')).length
        }
    };

    // Save report
    fs.writeFileSync(
        `competitive_report_${Date.now()}.json`,
        JSON.stringify(report, null, 2)
    );

    console.log('\nCompetitive Research Report:');
    console.log(`- Monitored: ${results.length} competitors`);
    console.log(`- Lowest Price: $${report.summary.lowestPrice}`);
    console.log(`- In Stock: ${report.summary.inStock}/${results.length}`);

    await browser.close();
    return report;
}

// Execute
competitiveResearch();
```

**Benefits**:
- Real-time competitive intelligence
- Automated price monitoring
- Visual proof of competitor offerings

---

### 2. **Automated Testing for Web Applications**
**Scenario**: End-to-end testing of web application workflows.

**Use Case**: Test a complete user journey: login, navigate to dashboard, create new record, verify creation, and logout. Capture screenshots at each step for test documentation.

**Implementation Example**:
```javascript
// User request: "Test the complete employee management workflow"

const puppeteer = require('puppeteer');

async function testWebApplication() {
    const browser = await puppeteer.launch({
        headless: false,  // Show browser for demo
        slowMo: 100      // Slow down for visibility
    });

    const page = await browser.newPage();
    const testResults = [];

    try {
        // Step 1: Navigate to login page
        console.log('Step 1: Navigating to login page...');
        await page.goto('https://app.example.com/login');
        await page.screenshot({ path: 'test_01_login_page.png' });
        testResults.push({ step: 'Login Page', status: 'PASS' });

        // Step 2: Fill login credentials
        console.log('Step 2: Filling credentials...');
        await page.type('#username', 'testuser@example.com');
        await page.type('#password', 'TestPassword123');
        await page.screenshot({ path: 'test_02_credentials_filled.png' });

        // Step 3: Click login button
        console.log('Step 3: Clicking login button...');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

        // Step 4: Verify successful login
        console.log('Step 4: Verifying login success...');
        const dashboardTitle = await page.$eval('h1',
            el => el.textContent);

        if (dashboardTitle.includes('Dashboard')) {
            testResults.push({ step: 'Login', status: 'PASS' });
            await page.screenshot({ path: 'test_03_dashboard.png' });
        } else {
            throw new Error('Login failed - Dashboard not found');
        }

        // Step 5: Navigate to Employees section
        console.log('Step 5: Navigating to Employees...');
        await page.click('a[href="/employees"]');
        await page.waitForSelector('.employee-list', { timeout: 5000 });
        testResults.push({ step: 'Navigate to Employees', status: 'PASS' });

        // Step 6: Click "Create New Employee"
        console.log('Step 6: Creating new employee...');
        await page.click('button.create-employee');
        await page.waitForSelector('#employee-form');

        // Step 7: Fill employee form
        console.log('Step 7: Filling employee form...');
        await page.type('#name', 'John Doe');
        await page.type('#email', 'john.doe@example.com');
        await page.type('#salary', '75000');
        await page.type('#duration', '2');
        await page.screenshot({ path: 'test_04_form_filled.png' });

        // Step 8: Submit form
        console.log('Step 8: Submitting form...');
        await Promise.all([
            page.click('button#submit-employee'),
            page.waitForSelector('.success-message', { timeout: 5000 })
        ]);

        // Step 9: Verify employee was created
        console.log('Step 9: Verifying employee creation...');
        const successMessage = await page.$eval('.success-message',
            el => el.textContent);

        if (successMessage.includes('Employee created successfully')) {
            testResults.push({ step: 'Create Employee', status: 'PASS' });
            await page.screenshot({ path: 'test_05_employee_created.png' });
        } else {
            throw new Error('Employee creation failed');
        }

        // Step 10: Verify employee appears in list
        console.log('Step 10: Checking employee list...');
        await page.goto('https://app.example.com/employees');
        const employeeExists = await page.evaluate(() => {
            return document.body.textContent.includes('John Doe');
        });

        if (employeeExists) {
            testResults.push({ step: 'Verify Employee in List', status: 'PASS' });
        } else {
            throw new Error('Employee not found in list');
        }

        // Step 11: Logout
        console.log('Step 11: Logging out...');
        await page.click('#logout-button');
        await page.waitForSelector('#login-form');
        testResults.push({ step: 'Logout', status: 'PASS' });
        await page.screenshot({ path: 'test_06_logged_out.png' });

    } catch (error) {
        console.error(`Test failed: ${error.message}`);
        testResults.push({
            step: 'Test Execution',
            status: 'FAIL',
            error: error.message
        });
        await page.screenshot({ path: 'test_ERROR.png' });
    }

    // Generate test report
    console.log('\n=== TEST REPORT ===');
    testResults.forEach(result => {
        const icon = result.status === 'PASS' ? '✓' : '✗';
        console.log(`${icon} ${result.step}: ${result.status}`);
        if (result.error) console.log(`  Error: ${result.error}`);
    });

    const passCount = testResults.filter(r => r.status === 'PASS').length;
    console.log(`\nResults: ${passCount}/${testResults.length} passed`);

    await browser.close();
    return testResults;
}

// Execute tests
testWebApplication();
```

**Benefits**:
- Automated regression testing
- Consistent test execution
- Visual test documentation

---

### 3. **Data Scraping for Market Research**
**Scenario**: Collect product reviews and ratings from multiple e-commerce sites.

**Use Case**: Visit product pages on Amazon, eBay, and other marketplaces, extract reviews, ratings, and customer feedback for sentiment analysis.

**Implementation Example**:
```javascript
// User request: "Scrape product reviews from e-commerce sites"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProductReviews(productUrl, maxReviews = 50) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Scraping reviews from: ${productUrl}`);

    await page.goto(productUrl, { waitUntil: 'networkidle2' });

    const reviews = [];

    // Scroll and load reviews
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;

    while (reviews.length < maxReviews && scrollAttempts < maxScrollAttempts) {
        // Extract reviews from current page
        const newReviews = await page.evaluate(() => {
            const reviewElements = document.querySelectorAll('.review-item');
            const extracted = [];

            reviewElements.forEach(reviewEl => {
                // Extract review data
                const ratingEl = reviewEl.querySelector('.star-rating');
                const textEl = reviewEl.querySelector('.review-text');
                const authorEl = reviewEl.querySelector('.review-author');
                const dateEl = reviewEl.querySelector('.review-date');

                if (ratingEl && textEl) {
                    extracted.push({
                        rating: parseInt(ratingEl.getAttribute('data-rating')) || 0,
                        text: textEl.textContent.trim(),
                        author: authorEl ? authorEl.textContent.trim() : 'Anonymous',
                        date: dateEl ? dateEl.textContent.trim() : '',
                        helpful: reviewEl.querySelector('.helpful-count')?.textContent || '0'
                    });
                }
            });

            return extracted;
        });

        // Add new unique reviews
        newReviews.forEach(review => {
            if (!reviews.some(r => r.text === review.text)) {
                reviews.push(review);
            }
        });

        console.log(`Collected ${reviews.length} reviews...`);

        // Scroll to load more
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Wait for new content to load
        await page.waitForTimeout(2000);

        // Check if we've scrolled to the bottom
        const currentHeight = await page.evaluate(() => document.body.scrollHeight);
        if (currentHeight === previousHeight) {
            scrollAttempts++;
        } else {
            scrollAttempts = 0;
        }
        previousHeight = currentHeight;

        // Try clicking "Load More" button if exists
        const loadMoreButton = await page.$('button.load-more-reviews');
        if (loadMoreButton) {
            await loadMoreButton.click();
            await page.waitForTimeout(2000);
            scrollAttempts = 0;
        }
    }

    // Analyze reviews
    const analysis = {
        totalReviews: reviews.length,
        averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2),
        ratingDistribution: {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length
        },
        positiveReviews: reviews.filter(r => r.rating >= 4).length,
        negativeReviews: reviews.filter(r => r.rating <= 2).length
    };

    // Save results
    const output = {
        productUrl,
        scrapedAt: new Date().toISOString(),
        analysis,
        reviews: reviews.slice(0, maxReviews)
    };

    fs.writeFileSync(
        `reviews_${Date.now()}.json`,
        JSON.stringify(output, null, 2)
    );

    console.log('\n=== REVIEW ANALYSIS ===');
    console.log(`Total Reviews: ${analysis.totalReviews}`);
    console.log(`Average Rating: ${analysis.averageRating}/5`);
    console.log(`Positive (4-5★): ${analysis.positiveReviews}`);
    console.log(`Negative (1-2★): ${analysis.negativeReviews}`);

    await browser.close();
    return output;
}

// Execute
scrapeProductReviews('https://example.com/product/widget-pro', 100);
```

**Benefits**:
- Comprehensive market insights
- Automated data collection
- Competitive sentiment analysis

---

### 4. **Automated Form Submission**
**Scenario**: Submit registration forms across multiple platforms.

**Use Case**: Automate employee onboarding by filling registration forms on HR platforms, benefits portals, and training systems with employee data.

**Implementation Example**:
```javascript
// User request: "Automate employee registration across multiple systems"

const puppeteer = require('puppeteer');

async function employeeOnboarding(employeeData) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const systems = [
        {
            name: 'HR System',
            url: 'https://hr.company.com/register',
            fields: {
                name: '#employee-name',
                email: '#employee-email',
                salary: '#salary-input',
                department: '#department-select',
                startDate: '#start-date'
            }
        },
        {
            name: 'Benefits Portal',
            url: 'https://benefits.company.com/enroll',
            fields: {
                name: 'input[name="fullname"]',
                email: 'input[name="email"]',
                ssn: 'input[name="ssn"]',
                plan: 'select[name="healthplan"]'
            }
        }
    ];

    const results = [];

    for (const system of systems) {
        try {
            console.log(`\nProcessing: ${system.name}...`);

            // Navigate to registration page
            await page.goto(system.url, { waitUntil: 'networkidle2' });

            // Fill form fields
            if (system.fields.name) {
                await page.type(system.fields.name, employeeData.name);
            }
            if (system.fields.email) {
                await page.type(system.fields.email, employeeData.email);
            }
            if (system.fields.salary) {
                await page.type(system.fields.salary, employeeData.salary.toString());
            }
            if (system.fields.department) {
                await page.select(system.fields.department, employeeData.department);
            }
            if (system.fields.startDate) {
                await page.type(system.fields.startDate, employeeData.startDate);
            }

            // Handle file upload if needed
            const fileInput = await page.$('input[type="file"]');
            if (fileInput && employeeData.documents) {
                await fileInput.uploadFile(employeeData.documents.resume);
            }

            // Take screenshot before submission
            await page.screenshot({
                path: `onboarding_${system.name.replace(/\s/g, '_')}_filled.png`
            });

            // Submit form
            await Promise.all([
                page.click('button[type="submit"]'),
                page.waitForNavigation({ timeout: 10000 })
            ]);

            // Verify success
            const confirmationText = await page.evaluate(() =>
                document.body.textContent
            );

            if (confirmationText.includes('successfully') ||
                confirmationText.includes('confirmed')) {
                console.log(`✓ ${system.name}: SUCCESS`);
                results.push({
                    system: system.name,
                    status: 'SUCCESS',
                    timestamp: new Date().toISOString()
                });

                await page.screenshot({
                    path: `onboarding_${system.name.replace(/\s/g, '_')}_success.png`
                });
            } else {
                throw new Error('Confirmation message not found');
            }

        } catch (error) {
            console.log(`✗ ${system.name}: FAILED - ${error.message}`);
            results.push({
                system: system.name,
                status: 'FAILED',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Summary
    console.log('\n=== ONBOARDING SUMMARY ===');
    console.log(`Employee: ${employeeData.name}`);
    results.forEach(r => {
        console.log(`${r.system}: ${r.status}`);
    });

    await browser.close();
    return results;
}

// Execute
const newEmployee = {
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    salary: 85000,
    department: 'engineering',
    startDate: '2025-12-01',
    documents: {
        resume: './documents/jane_smith_resume.pdf'
    }
};

employeeOnboarding(newEmployee);
```

**Benefits**:
- Eliminates manual data entry
- Reduces onboarding time
- Ensures data consistency

---

### 5. **Website Performance Monitoring**
**Scenario**: Track website load times and performance metrics.

**Use Case**: Regularly visit website pages, measure load times, capture performance metrics, and alert if performance degrades below thresholds.

**Implementation Example**:
```javascript
// User request: "Monitor website performance and alert on slowdowns"

const puppeteer = require('puppeteer');

async function performanceMonitoring(url, threshold = 3000) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Enable performance metrics collection
    await page.evaluateOnNewDocument(() => {
        window.performance.mark('start');
    });

    console.log(`Monitoring performance for: ${url}`);
    console.log(`Alert threshold: ${threshold}ms\n`);

    // Start performance tracking
    const startTime = Date.now();

    // Navigate and capture metrics
    const response = await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    const loadTime = Date.now() - startTime;

    // Get performance metrics
    const metrics = await page.metrics();
    const performanceData = await page.evaluate(() => {
        const perf = window.performance;
        const timing = perf.timing;

        return {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            ttfb: timing.responseStart - timing.requestStart,
            download: timing.responseEnd - timing.responseStart,
            domInteractive: timing.domInteractive - timing.navigationStart,
            domComplete: timing.domComplete - timing.navigationStart,
            loadComplete: timing.loadEventEnd - timing.navigationStart,
            resources: perf.getEntriesByType('resource').length
        };
    });

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    // Reload to capture any errors
    await page.reload({ waitUntil: 'networkidle2' });

    // Compile report
    const report = {
        url,
        timestamp: new Date().toISO String(),
        loadTime,
        responseCode: response.status(),
        performanceMetrics: {
            ...performanceData,
            scriptsCount: metrics.ScriptCount,
            jsHeapSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024) + 'MB',
            layoutCount: metrics.LayoutCount
        },
        consoleErrors: consoleErrors.length,
        passed: loadTime < threshold
    };

    // Output results
    console.log('=== PERFORMANCE REPORT ===');
    console.log(`Load Time: ${loadTime}ms`);
    console.log(`Status: ${report.passed ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Response Code: ${report.responseCode}`);
    console.log(`\nTiming Breakdown:`);
    console.log(`  DNS Lookup: ${performanceData.dns}ms`);
    console.log(`  TCP Connect: ${performanceData.tcp}ms`);
    console.log(`  Time to First Byte: ${performanceData.ttfb}ms`);
    console.log(`  Download: ${performanceData.download}ms`);
    console.log(`  DOM Interactive: ${performanceData.domInteractive}ms`);
    console.log(`  DOM Complete: ${performanceData.domComplete}ms`);
    console.log(`\nResources Loaded: ${performanceData.resources}`);
    console.log(`Console Errors: ${consoleErrors.length}`);

    // Alert if threshold exceeded
    if (!report.passed) {
        console.log(`\n⚠️  ALERT: Page load exceeded threshold!`);
        console.log(`   Expected: <${threshold}ms`);
        console.log(`   Actual: ${loadTime}ms`);
        // Send alert (email, Slack, etc.)
    }

    await browser.close();
    return report;
}

// Execute monitoring
performanceMonitoring('https://www.example.com', 3000);
```

**Benefits**:
- Proactive performance monitoring
- Historical performance data
- Early problem detection

---

### 6. **Automated Social Media Posting**
**Scenario**: Schedule and post content across social media platforms.

**Use Case**: Log into social media accounts, navigate to post creation, fill content, upload images, and publish posts automatically.

**Implementation Example**:
```javascript
// User request: "Post to Twitter with image and hashtags"

const puppeteer = require('puppeteer');

async function socialMediaPosting(postData) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Login to Twitter
        await page.goto('https://twitter.com/login');

        await page.type('input[name="text"]', postData.username);
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(1000);

        await page.type('input[name="password"]', postData.password);
        await page.click('button[data-testid="LoginForm_Login_Button"]');
        await page.waitForNavigation();

        console.log('✓ Logged in successfully');

        // Navigate to compose tweet
        await page.click('[data-testid="SideNav_NewTweet_Button"]');
        await page.waitForSelector('[data-testid="tweetTextarea_0"]');

        // Type tweet content
        const tweetText = `${postData.content}\n\n${postData.hashtags.join(' ')}`;
        await page.type('[data-testid="tweetTextarea_0"]', tweetText);

        // Upload image if provided
        if (postData.imagePath) {
            const fileInput = await page.$('input[type="file"]');
            await fileInput.uploadFile(postData.imagePath);
            await page.waitForTimeout(2000); // Wait for upload
            console.log('✓ Image uploaded');
        }

        // Take screenshot before posting
        await page.screenshot({ path: 'pre_post.png' });

        // Post tweet
        await page.click('[data-testid="tweetButton"]');
        await page.waitForTimeout(3000);

        console.log('✓ Tweet posted successfully!');

        // Verify post appeared
        await page.goto(`https://twitter.com/${postData.username}`);
        const latestTweet = await page.$eval(
            '[data-testid="tweet"] [data-testid="tweetText"]',
            el => el.textContent
        );

        if (latestTweet.includes(postData.content.substring(0, 20))) {
            console.log('✓ Post verified on profile');
        }

    } catch (error) {
        console.error('Posting failed:', error.message);
        await page.screenshot({ path: 'post_error.png' });
    }

    await browser.close();
}

// Execute
socialMediaPosting({
    username: 'mycompany',
    password: process.env.TWITTER_PASSWORD,
    content: 'Excited to announce our new product launch!',
    hashtags: ['#ProductLaunch', '#Innovation', '#Tech'],
    imagePath: './product-image.jpg'
});
```

**Benefits**:
- Consistent social media presence
- Time-saving automation
- Multi-platform posting

---

### 7. **Lead Generation from Business Directories**
**Scenario**: Extract business contact information from online directories.

**Use Case**: Search business directories like Yellow Pages or industry-specific sites, extract company names, phone numbers, emails, and addresses for sales prospecting.

**Implementation Example**:
```javascript
// User request: "Extract business leads from directory"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function leadGeneration(category, location, maxLeads = 50) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const leads = [];

    // Navigate to business directory
    await page.goto('https://www.yellowpages.com');

    // Search by category and location
    await page.type('#search_term', category);
    await page.type('#search_location', location);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    let currentPage = 1;
    const maxPages = Math.ceil(maxLeads / 30);

    while (leads.length < maxLeads && currentPage <= maxPages) {
        console.log(`Scraping page ${currentPage}...`);

        // Extract business listings
        const pageLeads = await page.evaluate(() => {
            const listings = document.querySelectorAll('.result');
            const extracted = [];

            listings.forEach(listing => {
                const nameEl = listing.querySelector('.business-name');
                const phoneEl = listing.querySelector('.phones');
                const addressEl = listing.querySelector('.street-address');
                const cityEl = listing.querySelector('.locality');

                if (nameEl) {
                    extracted.push({
                        name: nameEl.textContent.trim(),
                        phone: phoneEl ? phoneEl.textContent.trim() : 'N/A',
                        address: addressEl ? addressEl.textContent.trim() : '',
                        city: cityEl ? cityEl.textContent.trim() : '',
                        category: listing.querySelector('.categories')?.textContent.trim() || ''
                    });
                }
            });

            return extracted;
        });

        leads.push(...pageLeads);
        console.log(`Found ${pageLeads.length} leads on this page`);

        // Go to next page
        const nextButton = await page.$('a.next');
        if (nextButton && leads.length < maxLeads) {
            await nextButton.click();
            await page.waitForTimeout(2000);
            currentPage++;
        } else {
            break;
        }
    }

    // Format for CRM export
    const crmData = {
        exportDate: new Date().toISOString(),
        category,
        location,
        totalLeads: leads.length,
        leads: leads.slice(0, maxLeads).map((lead, index) => ({
            id: `LEAD_${Date.now()}_${index}`,
            ...lead,
            source: 'YellowPages',
            status: 'New'
        }))
    };

    // Save to file
    fs.writeFileSync(
        `leads_${category.replace(/\s/g, '_')}_${Date.now()}.json`,
        JSON.stringify(crmData, null, 2)
    );

    // Also save as CSV
    const csvContent = [
        'ID,Name,Phone,Address,City,Category,Source,Status',
        ...crmData.leads.map(l =>
            `${l.id},"${l.name}","${l.phone}","${l.address}","${l.city}","${l.category}","${l.source}","${l.status}"`
        )
    ].join('\n');

    fs.writeFileSync(
        `leads_${category.replace(/\s/g, '_')}_${Date.now()}.csv`,
        csvContent
    );

    console.log(`\n✓ Generated ${crmData.totalLeads} leads`);
    console.log(`Files saved for CRM import`);

    await browser.close();
    return crmData;
}

// Execute
leadGeneration('Plumbing', 'New York, NY', 100);
```

**Benefits**:
- Automated lead generation
- Comprehensive contact databases
- Time-efficient prospecting

---

### 8. **Job Application Automation**
**Scenario**: Apply to multiple job postings efficiently.

**Use Case**: Navigate to job boards, search for relevant positions, fill application forms with resume data, and submit applications automatically.

**Implementation Example**:
```javascript
// User request: "Apply to software engineering jobs automatically"

const puppeteer = require('puppeteer');

async function automatedJobApplications(criteria, applicantData) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const applications = [];

    // Navigate to job board
    await page.goto('https://www.indeed.com');

    // Search for jobs
    await page.type('#text-input-what', criteria.jobTitle);
    await page.type('#text-input-where', criteria.location);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Get job listings
    const jobLinks = await page.$$eval('a.jcs-JobTitle', links =>
        links.slice(0, 5).map(link => link.href)
    );

    for (const jobUrl of jobLinks) {
        try {
            console.log(`\nApplying to: ${jobUrl}`);
            await page.goto(jobUrl);
            await page.waitForTimeout(2000);

            // Check if "Easy Apply" available
            const easyApplyButton = await page.$('button:has-text("Apply now")');

            if (easyApplyButton) {
                await easyApplyButton.click();
                await page.waitForTimeout(1000);

                // Fill application form
                const nameField = await page.$('input[name="name"]');
                if (nameField) {
                    await nameField.type(applicantData.name);
                }

                const emailField = await page.$('input[type="email"]');
                if (emailField) {
                    await emailField.type(applicantData.email);
                }

                const phoneField = await page.$('input[type="tel"]');
                if (phoneField) {
                    await phoneField.type(applicantData.phone);
                }

                // Upload resume
                const fileInput = await page.$('input[type="file"]');
                if (fileInput && applicantData.resumePath) {
                    await fileInput.uploadFile(applicantData.resumePath);
                    console.log('✓ Resume uploaded');
                }

                // Fill cover letter if present
                const coverLetterField = await page.$('textarea[name="coverLetter"]');
                if (coverLetterField) {
                    await coverLetterField.type(applicantData.coverLetter);
                }

                // Submit application
                await page.screenshot({ path: `application_${Date.now()}_before.png` });

                const submitButton = await page.$('button[type="submit"]');
                if (submitButton) {
                    await submitButton.click();
                    await page.waitForTimeout(2000);

                    // Verify submission
                    const confirmationText = await page.evaluate(() =>
                        document.body.textContent
                    );

                    if (confirmationText.includes('Application submitted') ||
                        confirmationText.includes('Thank you')) {
                        console.log('✓ Application submitted successfully');
                        applications.push({
                            url: jobUrl,
                            status: 'submitted',
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            } else {
                console.log('⊘ Easy apply not available, skipping');
                applications.push({
                    url: jobUrl,
                    status: 'skipped - no easy apply',
                    timestamp: new Date().toISOString()
                });
            }

        } catch (error) {
            console.log(`✗ Application failed: ${error.message}`);
            applications.push({
                url: jobUrl,
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    console.log(`\n=== APPLICATION SUMMARY ===`);
    console.log(`Total: ${applications.length}`);
    console.log(`Submitted: ${applications.filter(a => a.status === 'submitted').length}`);
    console.log(`Skipped: ${applications.filter(a => a.status.includes('skipped')).length}`);
    console.log(`Failed: ${applications.filter(a => a.status === 'failed').length}`);

    await browser.close();
    return applications;
}

// Execute
automatedJobApplications(
    { jobTitle: 'Software Engineer', location: 'San Francisco, CA' },
    {
        name: 'John Developer',
        email: 'john@example.com',
        phone: '555-0123',
        resumePath: './resume.pdf',
        coverLetter: 'I am excited to apply for this position...'
    }
);
```

**Benefits**:
- Apply to more positions quickly
- Consistent application data
- Application tracking

---

### 9. **E-commerce Inventory Monitoring**
**Scenario**: Monitor product availability and stock levels.

**Use Case**: Check multiple e-commerce sites for product availability, track when out-of-stock items become available, and send notifications.

**Implementation Example**:
```javascript
// User request: "Monitor PS5 stock and alert when available"

const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

async function inventoryMonitor(products, checkInterval = 300000) {
    const browser = await puppeteer.launch({ headless: true });

    console.log('Starting inventory monitor...');
    console.log(`Checking every ${checkInterval/1000} seconds\n`);

    const checkStock = async () => {
        const page = await browser.newPage();

        for (const product of products) {
            try {
                console.log(`Checking: ${product.name}...`);
                await page.goto(product.url, { waitUntil: 'networkidle2' });

                // Check stock status
                const stockInfo = await page.evaluate((selectors) => {
                    const statusEl = document.querySelector(selectors.status);
                    const priceEl = document.querySelector(selectors.price);
                    const buttonEl = document.querySelector(selectors.button);

                    return {
                        status: statusEl ? statusEl.textContent.trim() : '',
                        price: priceEl ? priceEl.textContent.trim() : '',
                        buttonText: buttonEl ? buttonEl.textContent.trim() : ''
                    };
                }, product.selectors);

                const isInStock =
                    stockInfo.status.toLowerCase().includes('in stock') ||
                    stockInfo.buttonText.toLowerCase().includes('add to cart');

                const statusChange = product.lastStatus !== undefined &&
                                   product.lastStatus !== isInStock;

                console.log(`  Status: ${isInStock ? '✓ IN STOCK' : '✗ Out of Stock'}`);
                console.log(`  Price: ${stockInfo.price}`);

                if (isInStock && statusChange) {
                    // Send alert - product back in stock!
                    await sendAlert({
                        product: product.name,
                        url: product.url,
                        price: stockInfo.price,
                        message: '🎉 BACK IN STOCK!'
                    });
                }

                product.lastStatus = isInStock;
                product.lastPrice = stockInfo.price;
                product.lastChecked = new Date().toISOString();

            } catch (error) {
                console.log(`  Error checking ${product.name}: ${error.message}`);
            }
        }

        await page.close();
        console.log(`\n--- Next check in ${checkInterval/1000}s ---\n`);
    };

    // Initial check
    await checkStock();

    // Set up periodic checks
    setInterval(checkStock, checkInterval);
}

async function sendAlert(data) {
    console.log(`\n📧 ALERT: ${data.product} is ${data.message}`);
    console.log(`   Price: ${data.price}`);
    console.log(`   URL: ${data.url}\n`);

    // Send email notification (configure with your SMTP)
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.sendMail({
    //     to: 'your@email.com',
    //     subject: `Stock Alert: ${data.product}`,
    //     text: `${data.product} is back in stock!\nPrice: ${data.price}\n${data.url}`
    // });
}

// Execute
inventoryMonitor([
    {
        name: 'PlayStation 5',
        url: 'https://www.bestbuy.com/site/playstation-5/ps5',
        selectors: {
            status: '.fulfillment-add-to-cart-button',
            price: '.priceView-price',
            button: '.add-to-cart-button'
        }
    },
    {
        name: 'Xbox Series X',
        url: 'https://www.bestbuy.com/site/xbox-series-x/xbox',
        selectors: {
            status: '.fulfillment-add-to-cart-button',
            price: '.priceView-price',
            button: '.add-to-cart-button'
        }
    }
], 300000); // Check every 5 minutes
```

**Benefits**:
- Never miss restocks
- Price drop notifications
- Automated shopping assistant

---

### 10. **Automated Invoice Generation**
**Scenario**: Extract data from web portals and generate invoices.

**Use Case**: Log into client portals, extract billing information, hours worked, and rates, then populate invoice templates automatically.

**Implementation Example**:
```javascript
// User request: "Generate invoices from client portal data"

const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generateInvoices(clients) {
    const browser = await puppeteer.launch({ headless: true });
    const invoices = [];

    for (const client of clients) {
        const page = await browser.newPage();

        try {
            console.log(`\nProcessing invoice for: ${client.name}`);

            // Login to client portal
            await page.goto(client.portalUrl);
            await page.type('#username', client.credentials.username);
            await page.type('#password', client.credentials.password);
            await page.click('button[type="submit"]');
            await page.waitForNavigation();

            // Navigate to billing section
            await page.goto(`${client.portalUrl}/billing`);
            await page.waitForSelector('.billing-data');

            // Extract billing information
            const billingData = await page.evaluate(() => {
                const rows = document.querySelectorAll('.timesheet-row');
                const entries = [];

                rows.forEach(row => {
                    entries.push({
                        date: row.querySelector('.date')?.textContent.trim(),
                        hours: parseFloat(row.querySelector('.hours')?.textContent) || 0,
                        description: row.querySelector('.description')?.textContent.trim(),
                        rate: parseFloat(row.querySelector('.rate')?.textContent.replace(/[^0-9.]/g, '')) || 0
                    });
                });

                return entries;
            });

            // Calculate totals
            const totalHours = billingData.reduce((sum, entry) => sum + entry.hours, 0);
            const totalAmount = billingData.reduce((sum, entry) =>
                sum + (entry.hours * entry.rate), 0);

            // Generate invoice
            const invoiceNumber = `INV-${Date.now()}-${client.id}`;
            const invoiceData = {
                number: invoiceNumber,
                client: client.name,
                date: new Date().toISOString().split('T')[0],
                entries: billingData,
                totalHours,
                totalAmount
            };

            // Create PDF invoice
            await createInvoicePDF(invoiceData, `./invoices/${invoiceNumber}.pdf`);

            invoices.push(invoiceData);
            console.log(`✓ Invoice generated: ${invoiceNumber}`);
            console.log(`  Total Hours: ${totalHours}`);
            console.log(`  Total Amount: $${totalAmount.toFixed(2)}`);

        } catch (error) {
            console.log(`✗ Failed to generate invoice for ${client.name}: ${error.message}`);
        }

        await page.close();
    }

    await browser.close();
    return invoices;
}

async function createInvoicePDF(data, outputPath) {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(outputPath));

        // Header
        doc.fontSize(20).text('INVOICE', 50, 50);
        doc.fontSize(10).text(`Invoice #: ${data.number}`, 50, 80);
        doc.text(`Date: ${data.date}`, 50, 95);
        doc.text(`Client: ${data.client}`, 50, 110);

        // Line items
        let y = 150;
        doc.fontSize(12).text('Description', 50, y);
        doc.text('Hours', 300, y);
        doc.text('Rate', 400, y);
        doc.text('Amount', 500, y);

        y += 20;
        doc.fontSize(10);

        data.entries.forEach(entry => {
            doc.text(entry.description.substring(0, 40), 50, y);
            doc.text(entry.hours.toString(), 300, y);
            doc.text(`$${entry.rate}`, 400, y);
            doc.text(`$${(entry.hours * entry.rate).toFixed(2)}`, 500, y);
            y += 20;
        });

        // Total
        y += 20;
        doc.fontSize(12);
        doc.text(`Total Hours: ${data.totalHours}`, 300, y);
        doc.text(`Total Amount: $${data.totalAmount.toFixed(2)}`, 400, y, { bold: true });

        doc.end();
        doc.on('finish', resolve);
    });
}

// Execute
generateInvoices([
    {
        id: 'CLIENT001',
        name: 'Acme Corp',
        portalUrl: 'https://portal.acmecorp.com',
        credentials: {
            username: 'contractor',
            password: process.env.ACME_PASSWORD
        }
    }
]);
```

**Benefits**:
- Streamlined billing process
- Reduced manual errors
- Faster invoice generation

---

### 11. **Content Aggregation and Curation**
**Scenario**: Collect articles and content from multiple sources.

**Use Case**: Visit news sites, blogs, and industry publications, extract articles matching specific topics, and compile into a curated newsletter.

**Implementation Example**:
```javascript
// User request: "Curate AI and tech articles from multiple sources for weekly newsletter"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function contentAggregation(topics, sources) {
    const browser = await puppeteer.launch({ headless: true });
    const articles = [];
    const seenUrls = new Set();

    for (const source of sources) {
        const page = await browser.newPage();

        try {
            console.log(`\nScraping ${source.name}...`);
            await page.goto(source.url, { waitUntil: 'networkidle2' });

            // Search for topic if needed
            if (source.searchSelector) {
                await page.type(source.searchSelector, topics.join(' OR '));
                await page.keyboard.press('Enter');
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
            }

            // Extract articles
            const pageArticles = await page.evaluate((selectors) => {
                const articles = [];
                const articleElements = document.querySelectorAll(selectors.article);

                articleElements.forEach(article => {
                    const titleEl = article.querySelector(selectors.title);
                    const excerptEl = article.querySelector(selectors.excerpt);
                    const linkEl = article.querySelector(selectors.link);
                    const dateEl = article.querySelector(selectors.date);
                    const authorEl = article.querySelector(selectors.author);

                    if (titleEl && linkEl) {
                        articles.push({
                            title: titleEl.textContent.trim(),
                            excerpt: excerptEl ? excerptEl.textContent.trim().substring(0, 200) : '',
                            url: linkEl.href,
                            date: dateEl ? dateEl.textContent.trim() : new Date().toISOString().split('T')[0],
                            author: authorEl ? authorEl.textContent.trim() : 'Unknown',
                            source: window.location.hostname
                        });
                    }
                });

                return articles;
            }, source.selectors);

            // Filter duplicates
            pageArticles.forEach(article => {
                if (!seenUrls.has(article.url)) {
                    seenUrls.add(article.url);
                    articles.push(article);
                    console.log(`  ✓ ${article.title.substring(0, 60)}...`);
                }
            });

        } catch (error) {
            console.error(`Error scraping ${source.name}:`, error.message);
        }

        await page.close();
    }

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate newsletter HTML
    const newsletter = generateNewsletterHTML(articles, topics);
    fs.writeFileSync('newsletter.html', newsletter);

    // Generate JSON for other uses
    fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));

    console.log(`\n✓ Curated ${articles.length} unique articles`);
    console.log(`✓ Newsletter saved to newsletter.html`);

    await browser.close();
    return articles;
}

function generateNewsletterHTML(articles, topics) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Tech News Digest - ${new Date().toDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; margin-bottom: 30px; }
        .article { border-bottom: 1px solid #ddd; padding: 20px 0; }
        .article h2 { margin: 0 0 10px 0; }
        .article a { color: #0066cc; text-decoration: none; }
        .meta { color: #666; font-size: 14px; margin: 10px 0; }
        .excerpt { color: #333; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Tech News Digest</h1>
        <p>Topics: ${topics.join(', ')} | ${new Date().toDateString()}</p>
    </div>
    ${articles.map(article => `
    <div class="article">
        <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
        <div class="meta">
            ${article.author} | ${article.source} | ${article.date}
        </div>
        <p class="excerpt">${article.excerpt}</p>
    </div>
    `).join('')}
</body>
</html>
    `;
    return html;
}

// Execute
contentAggregation(
    ['artificial intelligence', 'machine learning', 'AI'],
    [
        {
            name: 'TechCrunch',
            url: 'https://techcrunch.com/category/artificial-intelligence/',
            selectors: {
                article: '.post-block',
                title: 'h2.post-block__title',
                excerpt: '.post-block__content',
                link: 'a.post-block__title__link',
                date: 'time',
                author: '.river-byline__authors'
            }
        },
        {
            name: 'MIT Technology Review',
            url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
            selectors: {
                article: 'article.teaserItem',
                title: 'h3.teaserItem__title',
                excerpt: '.teaserItem__description',
                link: 'a',
                date: 'time',
                author: '.teaserItem__author'
            }
        },
        {
            name: 'VentureBeat AI',
            url: 'https://venturebeat.com/category/ai/',
            selectors: {
                article: 'article',
                title: 'h2.ArticleListing__title',
                excerpt: '.ArticleListing__excerpt',
                link: 'a',
                date: 'time',
                author: '.ArticleListing__author'
            }
        }
    ]
);
```

**Benefits**:
- Automated content curation
- Comprehensive topic coverage
- Time-saving research

---

### 12. **Automated Meeting Scheduling**
**Scenario**: Schedule meetings across calendar platforms.

**Use Case**: Log into calendar systems, find available time slots, create meeting events, and send invitations to participants automatically.

**Implementation Example**:
```javascript
// User request: "Schedule team meeting with 5 participants next week"

const puppeteer = require('puppeteer');

async function scheduleMeeting(meetingDetails) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Login to Google Calendar
        console.log('Logging into Google Calendar...');
        await page.goto('https://calendar.google.com');

        // Wait for authentication (user may need to login manually)
        await page.waitForSelector('[data-moreevents]', { timeout: 60000 });
        console.log('✓ Logged in to calendar');

        // Click "Create" button
        await page.click('button[aria-label="Create"]');
        await page.waitForSelector('input[aria-label="Add title"]');

        console.log('Creating event...');

        // Fill in meeting details
        await page.type('input[aria-label="Add title"]', meetingDetails.title);

        // Set date and time
        const dateInput = await page.$('input[aria-label="Start date"]');
        await dateInput.click({ clickCount: 3 });
        await dateInput.type(meetingDetails.date);

        const timeInput = await page.$('input[aria-label="Start time"]');
        await timeInput.click({ clickCount: 3 });
        await timeInput.type(meetingDetails.startTime);

        // Set duration
        const endTimeInput = await page.$('input[aria-label="End time"]');
        await endTimeInput.click({ clickCount: 3 });
        await endTimeInput.type(meetingDetails.endTime);

        // Add location/video conference
        if (meetingDetails.addGoogleMeet) {
            await page.click('button[aria-label="Add Google Meet video conference"]');
            await page.waitForTimeout(1000);
            console.log('✓ Google Meet link added');
        }

        // Add description
        if (meetingDetails.description) {
            await page.click('div[aria-label="Description"]');
            await page.keyboard.type(meetingDetails.description);
        }

        // Add participants
        console.log('Adding participants...');
        const guestsInput = await page.$('input[aria-label="Add guests"]');

        for (const email of meetingDetails.participants) {
            await guestsInput.type(email);
            await page.waitForTimeout(500);
            await page.keyboard.press('Enter');
            console.log(`  ✓ Added ${email}`);
        }

        // Check for availability conflicts
        await page.waitForTimeout(2000);
        const conflicts = await page.evaluate(() => {
            const conflictEl = document.querySelector('[role="alert"]');
            return conflictEl ? conflictEl.textContent : null;
        });

        if (conflicts) {
            console.log(`⚠️  Schedule conflict detected: ${conflicts}`);

            // Try to find alternative time
            console.log('Suggesting alternative times...');
            await page.click('button[aria-label="Find a time"]');
            await page.waitForTimeout(2000);

            // Select first available slot
            const availableSlot = await page.$('.calendar-free-slot');
            if (availableSlot) {
                await availableSlot.click();
                console.log('✓ Alternative time selected');
            }
        }

        // Take screenshot before saving
        await page.screenshot({ path: 'meeting-preview.png' });

        // Save the event
        await page.click('button[aria-label="Save"]');
        await page.waitForTimeout(3000);

        // Verify creation
        const eventCreated = await page.evaluate((title) => {
            const events = Array.from(document.querySelectorAll('[data-eventid]'));
            return events.some(event => event.textContent.includes(title));
        }, meetingDetails.title);

        if (eventCreated) {
            console.log('\n✓ Meeting scheduled successfully!');
            console.log(`  Title: ${meetingDetails.title}`);
            console.log(`  Date: ${meetingDetails.date}`);
            console.log(`  Time: ${meetingDetails.startTime} - ${meetingDetails.endTime}`);
            console.log(`  Participants: ${meetingDetails.participants.length} invited`);
        }

        // Get meeting link if Google Meet was added
        if (meetingDetails.addGoogleMeet) {
            // Click on the newly created event to get details
            await page.click(`[aria-label*="${meetingDetails.title}"]`);
            await page.waitForTimeout(1000);

            const meetLink = await page.evaluate(() => {
                const linkEl = document.querySelector('a[href*="meet.google.com"]');
                return linkEl ? linkEl.href : null;
            });

            if (meetLink) {
                console.log(`  Meeting Link: ${meetLink}`);
            }
        }

    } catch (error) {
        console.error('Error scheduling meeting:', error.message);
        await page.screenshot({ path: 'scheduling-error.png' });
    }

    await browser.close();
}

// Execute
scheduleMeeting({
    title: 'Q4 Planning Meeting',
    date: '11/25/2025',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    description: 'Quarterly planning session to discuss goals and initiatives for Q4.',
    addGoogleMeet: true,
    participants: [
        'john.doe@company.com',
        'jane.smith@company.com',
        'bob.wilson@company.com',
        'alice.johnson@company.com',
        'charlie.brown@company.com'
    ]
});
```

**Benefits**:
- Eliminates scheduling back-and-forth
- Finds optimal meeting times
- Automated coordination

---

### 13. **Web Application Accessibility Testing**
**Scenario**: Test website accessibility compliance.

**Use Case**: Navigate website with keyboard-only interaction, verify ARIA labels, check color contrast, and generate accessibility reports.

**Implementation Example**:
```javascript
// User request: "Test our web application for WCAG 2.1 AA compliance"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function accessibilityTesting(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Testing accessibility for: ${url}\n`);

    await page.goto(url, { waitUntil: 'networkidle2' });

    const results = {
        url,
        timestamp: new Date().toISOString(),
        tests: [],
        score: 0,
        violations: [],
        warnings: []
    };

    // Test 1: Keyboard Navigation
    console.log('1. Testing keyboard navigation...');
    const keyboardTest = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        return {
            focusableCount: focusableElements.length,
            hasFocusableElements: focusableElements.length > 0
        };
    });

    results.tests.push({
        name: 'Keyboard Navigation',
        passed: keyboardTest.hasFocusableElements,
        details: `Found ${keyboardTest.focusableCount} focusable elements`
    });

    // Test 2: Image Alt Text
    console.log('2. Checking image alt attributes...');
    const imageTest = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const missingAlt = images.filter(img => !img.hasAttribute('alt'));
        const emptyAlt = images.filter(img => img.alt === '');

        return {
            totalImages: images.length,
            missingAlt: missingAlt.length,
            emptyAlt: emptyAlt.length,
            missingAltSrcs: missingAlt.slice(0, 5).map(img => img.src)
        };
    });

    const imagesPassed = imageTest.missingAlt === 0;
    results.tests.push({
        name: 'Image Alt Text',
        passed: imagesPassed,
        details: `${imageTest.missingAlt} of ${imageTest.totalImages} images missing alt text`
    });

    if (!imagesPassed) {
        results.violations.push({
            rule: 'Images must have alt text',
            severity: 'critical',
            count: imageTest.missingAlt,
            examples: imageTest.missingAltSrcs
        });
    }

    // Test 3: Form Labels
    console.log('3. Verifying form labels...');
    const formTest = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
        const unlabeled = inputs.filter(input => {
            const id = input.id;
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);
            const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
            return !hasLabel && !hasAriaLabel;
        });

        return {
            totalInputs: inputs.length,
            unlabeled: unlabeled.length,
            unlabeledIds: unlabeled.slice(0, 5).map(i => i.id || i.name || 'unknown')
        };
    });

    const formsPassed = formTest.unlabeled === 0;
    results.tests.push({
        name: 'Form Labels',
        passed: formsPassed,
        details: `${formTest.unlabeled} of ${formTest.totalInputs} form fields lack proper labels`
    });

    if (!formsPassed) {
        results.violations.push({
            rule: 'Form fields must have associated labels',
            severity: 'critical',
            count: formTest.unlabeled,
            examples: formTest.unlabeledIds
        });
    }

    // Test 4: Heading Hierarchy
    console.log('4. Checking heading hierarchy...');
    const headingTest = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const levels = headings.map(h => parseInt(h.tagName[1]));

        let errors = [];
        for (let i = 1; i < levels.length; i++) {
            if (levels[i] > levels[i-1] + 1) {
                errors.push(`Skipped from h${levels[i-1]} to h${levels[i]}`);
            }
        }

        return {
            hasH1: levels.includes(1),
            h1Count: levels.filter(l => l === 1).length,
            totalHeadings: headings.length,
            hierarchyErrors: errors
        };
    });

    const headingsPassed = headingTest.hasH1 && headingTest.h1Count === 1 && headingTest.hierarchyErrors.length === 0;
    results.tests.push({
        name: 'Heading Hierarchy',
        passed: headingsPassed,
        details: `${headingTest.h1Count} h1 tags, ${headingTest.hierarchyErrors.length} hierarchy issues`
    });

    // Test 5: Color Contrast (simplified check)
    console.log('5. Analyzing color contrast...');
    const contrastTest = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6'));
        let lowContrastCount = 0;

        // Simplified contrast check (would need a proper contrast library in production)
        textElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const bgColor = styles.backgroundColor;

            // Check if colors are too similar (simplified)
            if (color === bgColor || bgColor === 'rgba(0, 0, 0, 0)') {
                lowContrastCount++;
            }
        });

        return {
            totalElements: textElements.length,
            potentialIssues: lowContrastCount
        };
    });

    results.tests.push({
        name: 'Color Contrast',
        passed: contrastTest.potentialIssues < 5,
        details: `${contrastTest.potentialIssues} potential contrast issues detected`
    });

    // Test 6: ARIA Landmarks
    console.log('6. Checking ARIA landmarks...');
    const landmarkTest = await page.evaluate(() => {
        const landmarks = {
            main: document.querySelectorAll('main, [role="main"]').length,
            nav: document.querySelectorAll('nav, [role="navigation"]').length,
            header: document.querySelectorAll('header, [role="banner"]').length,
            footer: document.querySelectorAll('footer, [role="contentinfo"]').length
        };

        return landmarks;
    });

    const landmarksPassed = landmarkTest.main > 0;
    results.tests.push({
        name: 'ARIA Landmarks',
        passed: landmarksPassed,
        details: `main: ${landmarkTest.main}, nav: ${landmarkTest.nav}, header: ${landmarkTest.header}, footer: ${landmarkTest.footer}`
    });

    // Calculate score
    const passedTests = results.tests.filter(t => t.passed).length;
    results.score = Math.round((passedTests / results.tests.length) * 100);

    // Generate report
    console.log('\n=== ACCESSIBILITY TEST REPORT ===');
    console.log(`URL: ${url}`);
    console.log(`Overall Score: ${results.score}%`);
    console.log(`Tests Passed: ${passedTests}/${results.tests.length}\n`);

    results.tests.forEach((test, i) => {
        const status = test.passed ? '✓ PASS' : '✗ FAIL';
        console.log(`${i + 1}. ${test.name}: ${status}`);
        console.log(`   ${test.details}`);
    });

    if (results.violations.length > 0) {
        console.log('\n=== CRITICAL VIOLATIONS ===');
        results.violations.forEach(v => {
            console.log(`\n${v.rule} (${v.severity})`);
            console.log(`  Count: ${v.count}`);
            console.log(`  Examples: ${v.examples.join(', ')}`);
        });
    }

    // Save detailed report
    fs.writeFileSync('accessibility-report.json', JSON.stringify(results, null, 2));
    console.log('\n✓ Detailed report saved to accessibility-report.json');

    // Take screenshot
    await page.screenshot({ path: 'accessibility-test.png', fullPage: true });

    await browser.close();
    return results;
}

// Execute
accessibilityTesting('https://www.example.com');
```

**Benefits**:
- Ensure accessibility compliance
- Identify accessibility gaps
- Automated audit reports

---

### 14. **Price Comparison and Deal Finding**
**Scenario**: Compare prices across multiple retailers.

**Use Case**: Search for specific products across e-commerce sites, extract prices, shipping costs, and availability to find the best deals.

**Implementation Example**:
```javascript
// User request: "Find the best price for Sony WH-1000XM5 headphones across major retailers"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function priceComparison(productName, retailers) {
    const browser = await puppeteer.launch({ headless: true });
    const results = [];

    console.log(`Searching for: ${productName}\n`);

    for (const retailer of retailers) {
        const page = await browser.newPage();

        try {
            console.log(`Checking ${retailer.name}...`);

            // Navigate to retailer search
            await page.goto(retailer.url, { waitUntil: 'networkidle2' });

            // Search for product
            await page.waitForSelector(retailer.searchSelector);
            await page.type(retailer.searchSelector, productName);
            await page.keyboard.press('Enter');
            await page.waitForNavigation({ waitUntil: 'networkidle2' });

            // Extract first result
            const productData = await page.evaluate((selectors) => {
                const productEl = document.querySelector(selectors.product);
                if (!productEl) return null;

                const titleEl = productEl.querySelector(selectors.title);
                const priceEl = productEl.querySelector(selectors.price);
                const linkEl = productEl.querySelector(selectors.link);
                const ratingEl = productEl.querySelector(selectors.rating);
                const availabilityEl = productEl.querySelector(selectors.availability);

                // Extract price (remove $, commas, etc.)
                const priceText = priceEl ? priceEl.textContent : '';
                const priceMatch = priceText.match(/[\d,]+\.?\d*/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : null;

                return {
                    title: titleEl ? titleEl.textContent.trim() : null,
                    price: price,
                    url: linkEl ? linkEl.href : null,
                    rating: ratingEl ? ratingEl.textContent.trim() : 'N/A',
                    availability: availabilityEl ? availabilityEl.textContent.trim() : 'Unknown'
                };
            }, retailer.selectors);

            if (productData && productData.price) {
                // Get shipping cost if available
                await page.goto(productData.url);
                await page.waitForTimeout(2000);

                const shippingCost = await page.evaluate((selector) => {
                    const shippingEl = document.querySelector(selector);
                    if (!shippingEl) return 0;

                    const text = shippingEl.textContent;
                    if (text.toLowerCase().includes('free')) return 0;

                    const match = text.match(/[\d,]+\.?\d*/);
                    return match ? parseFloat(match[0].replace(',', '')) : 0;
                }, retailer.selectors.shipping || '.shipping-cost');

                const totalCost = productData.price + shippingCost;

                results.push({
                    retailer: retailer.name,
                    ...productData,
                    shippingCost: shippingCost,
                    totalCost: totalCost
                });

                console.log(`  ✓ $${productData.price} + $${shippingCost} shipping = $${totalCost}`);
            } else {
                console.log(`  ✗ Product not found`);
            }

        } catch (error) {
            console.error(`  Error checking ${retailer.name}:`, error.message);
        }

        await page.close();
    }

    // Sort by total cost
    results.sort((a, b) => a.totalCost - b.totalCost);

    // Display comparison
    console.log('\n=== PRICE COMPARISON RESULTS ===\n');

    if (results.length === 0) {
        console.log('No results found');
    } else {
        results.forEach((result, index) => {
            const badge = index === 0 ? '🏆 BEST DEAL' : '';
            console.log(`${index + 1}. ${result.retailer} ${badge}`);
            console.log(`   Price: $${result.price}`);
            console.log(`   Shipping: $${result.shippingCost}`);
            console.log(`   Total: $${result.totalCost}`);
            console.log(`   Rating: ${result.rating}`);
            console.log(`   Availability: ${result.availability}`);
            console.log(`   URL: ${result.url}`);
            console.log('');
        });

        const savings = results[results.length - 1].totalCost - results[0].totalCost;
        console.log(`💰 You save $${savings.toFixed(2)} by choosing the best deal!`);
    }

    // Save results
    const report = {
        productName,
        searchDate: new Date().toISOString(),
        results: results,
        bestDeal: results[0] || null,
        potentialSavings: results.length > 1 ? savings : 0
    };

    fs.writeFileSync('price-comparison.json', JSON.stringify(report, null, 2));
    console.log('\n✓ Results saved to price-comparison.json');

    await browser.close();
    return results;
}

// Execute
priceComparison(
    'Sony WH-1000XM5',
    [
        {
            name: 'Amazon',
            url: 'https://www.amazon.com',
            searchSelector: '#twotabsearchtextbox',
            selectors: {
                product: '[data-component-type="s-search-result"]',
                title: 'h2 a span',
                price: '.a-price .a-offscreen',
                link: 'h2 a',
                rating: '.a-icon-star-small',
                availability: '.a-color-success',
                shipping: '#mir-layout-DELIVERY_BLOCK'
            }
        },
        {
            name: 'Best Buy',
            url: 'https://www.bestbuy.com',
            searchSelector: '#gh-search-input',
            selectors: {
                product: '.sku-item',
                title: '.sku-title a',
                price: '.priceView-customer-price span',
                link: '.sku-title a',
                rating: '.ratings-reviews',
                availability: '.fulfillment-add-to-cart-button',
                shipping: '.shipping-message'
            }
        },
        {
            name: 'Walmart',
            url: 'https://www.walmart.com',
            searchSelector: 'input[name="q"]',
            selectors: {
                product: '[data-item-id]',
                title: '[data-automation-id="product-title"]',
                price: '[data-automation-id="product-price"]',
                link: 'a',
                rating: '.stars-container',
                availability: '.fulfillment-badge',
                shipping: '.shipping-text'
            }
        }
    ]
);
```

**Benefits**:
- Automated price comparison
- Find best deals quickly
- Save money on purchases

---

### 15. **Automated Customer Support Testing**
**Scenario**: Test chatbot and support form functionality.

**Use Case**: Interact with customer support chatbots, submit test support tickets, verify automated responses, and ensure support systems are functioning.

**Implementation Example**:
```javascript
// User request: "Test our customer support chatbot and ticketing system functionality"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function customerSupportTesting(config) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const testResults = {
        timestamp: new Date().toISOString(),
        tests: [],
        chatbotTests: [],
        ticketingTests: [],
        allPassed: true
    };

    console.log('Starting customer support system tests...\n');

    // Test 1: Chatbot Interaction
    if (config.chatbotUrl) {
        console.log('1. Testing Chatbot Functionality...');

        try {
            await page.goto(config.chatbotUrl, { waitUntil: 'networkidle2' });

            // Wait for chatbot to load
            await page.waitForSelector(config.chatbot.triggerSelector, { timeout: 10000 });
            await page.click(config.chatbot.triggerSelector);
            await page.waitForTimeout(2000);

            console.log('   Chatbot opened');

            // Test multiple conversation flows
            for (const testCase of config.chatbot.testCases) {
                const startTime = Date.now();

                // Send message
                await page.waitForSelector(config.chatbot.inputSelector);
                await page.type(config.chatbot.inputSelector, testCase.message);

                const sendButton = await page.$(config.chatbot.sendSelector);
                await sendButton.click();

                // Wait for response
                await page.waitForTimeout(3000);

                const responseTime = Date.now() - startTime;

                // Get bot response
                const response = await page.evaluate((selector) => {
                    const messages = document.querySelectorAll(selector);
                    const lastMessage = messages[messages.length - 1];
                    return lastMessage ? lastMessage.textContent : '';
                }, config.chatbot.responseSelector);

                const testPassed = response.length > 0 && responseTime < 5000;

                testResults.chatbotTests.push({
                    query: testCase.message,
                    response: response.substring(0, 100),
                    responseTime: responseTime + 'ms',
                    expectedKeywords: testCase.expectedKeywords,
                    containsKeywords: testCase.expectedKeywords.some(kw =>
                        response.toLowerCase().includes(kw.toLowerCase())
                    ),
                    passed: testPassed
                });

                console.log(`   ✓ Query: "${testCase.message}"`);
                console.log(`     Response time: ${responseTime}ms`);
                console.log(`     Response received: ${testPassed ? 'Yes' : 'No'}`);

                if (!testPassed) testResults.allPassed = false;

                await page.waitForTimeout(1000);
            }

        } catch (error) {
            console.error('   Chatbot test failed:', error.message);
            testResults.allPassed = false;
            testResults.chatbotTests.push({ error: error.message, passed: false });
        }
    }

    // Test 2: Support Ticket Submission
    if (config.ticketingUrl) {
        console.log('\n2. Testing Support Ticket System...');

        try {
            await page.goto(config.ticketingUrl, { waitUntil: 'networkidle2' });

            // Fill support form
            await page.waitForSelector(config.ticketing.nameSelector);

            const testTicket = {
                name: 'Test User',
                email: 'test@example.com',
                subject: `Automated Test - ${new Date().toISOString()}`,
                message: 'This is an automated test of the support ticketing system. Please disregard.',
                priority: 'Low'
            };

            console.log('   Filling support form...');

            await page.type(config.ticketing.nameSelector, testTicket.name);
            await page.type(config.ticketing.emailSelector, testTicket.email);
            await page.type(config.ticketing.subjectSelector, testTicket.subject);
            await page.type(config.ticketing.messageSelector, testTicket.message);

            // Select priority if available
            if (config.ticketing.prioritySelector) {
                await page.select(config.ticketing.prioritySelector, 'low');
            }

            // Take screenshot before submission
            await page.screenshot({ path: 'support-form-filled.png' });

            // Submit form
            const submitStart = Date.now();
            await page.click(config.ticketing.submitSelector);

            // Wait for confirmation
            try {
                await page.waitForSelector(config.ticketing.confirmationSelector, { timeout: 10000 });
                const submitTime = Date.now() - submitStart;

                const confirmationText = await page.$eval(
                    config.ticketing.confirmationSelector,
                    el => el.textContent
                );

                // Extract ticket number if available
                const ticketNumberMatch = confirmationText.match(/#(\d+)|ticket.*?(\d+)/i);
                const ticketNumber = ticketNumberMatch ? ticketNumberMatch[1] || ticketNumberMatch[2] : null;

                testResults.ticketingTests.push({
                    submitted: true,
                    submissionTime: submitTime + 'ms',
                    ticketNumber: ticketNumber,
                    confirmationReceived: true,
                    confirmationText: confirmationText.substring(0, 100),
                    passed: true
                });

                console.log('   ✓ Ticket submitted successfully');
                console.log(`     Submission time: ${submitTime}ms`);
                if (ticketNumber) console.log(`     Ticket #: ${ticketNumber}`);

            } catch (error) {
                console.log('   ✗ No confirmation received');
                testResults.ticketingTests.push({
                    submitted: true,
                    confirmationReceived: false,
                    error: 'Confirmation timeout',
                    passed: false
                });
                testResults.allPassed = false;
            }

            // Take screenshot of confirmation
            await page.screenshot({ path: 'support-form-confirmation.png' });

        } catch (error) {
            console.error('   Ticketing test failed:', error.message);
            testResults.allPassed = false;
            testResults.ticketingTests.push({ error: error.message, passed: false });
        }
    }

    // Test 3: Response Time and Availability
    console.log('\n3. Testing Support Page Load Times...');

    const pages = [config.chatbotUrl, config.ticketingUrl, config.faqUrl].filter(Boolean);

    for (const url of pages) {
        const startTime = Date.now();
        try {
            const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
            const loadTime = Date.now() - startTime;
            const statusCode = response.status();

            const passed = statusCode === 200 && loadTime < 3000;

            testResults.tests.push({
                page: url,
                loadTime: loadTime + 'ms',
                statusCode: statusCode,
                passed: passed
            });

            console.log(`   ${url}`);
            console.log(`     Status: ${statusCode}, Load time: ${loadTime}ms - ${passed ? '✓' : '✗'}`);

            if (!passed) testResults.allPassed = false;

        } catch (error) {
            console.log(`   ${url} - ✗ FAILED`);
            testResults.tests.push({ page: url, error: error.message, passed: false });
            testResults.allPassed = false;
        }
    }

    // Generate Summary Report
    console.log('\n=== CUSTOMER SUPPORT TEST SUMMARY ===');
    console.log(`Overall Status: ${testResults.allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
    console.log(`Chatbot Tests: ${testResults.chatbotTests.length} executed`);
    console.log(`Ticketing Tests: ${testResults.ticketingTests.length} executed`);
    console.log(`Page Load Tests: ${testResults.tests.length} executed`);

    const passedChatbot = testResults.chatbotTests.filter(t => t.passed).length;
    const passedTicketing = testResults.ticketingTests.filter(t => t.passed).length;
    const passedPages = testResults.tests.filter(t => t.passed).length;

    console.log(`\nPass Rates:`);
    console.log(`  Chatbot: ${passedChatbot}/${testResults.chatbotTests.length}`);
    console.log(`  Ticketing: ${passedTicketing}/${testResults.ticketingTests.length}`);
    console.log(`  Page Loads: ${passedPages}/${testResults.tests.length}`);

    // Save detailed report
    fs.writeFileSync('support-test-results.json', JSON.stringify(testResults, null, 2));
    console.log('\n✓ Detailed results saved to support-test-results.json');

    await browser.close();
    return testResults;
}

// Execute
customerSupportTesting({
    chatbotUrl: 'https://www.example.com/support',
    chatbot: {
        triggerSelector: '#chat-widget-trigger',
        inputSelector: '#chat-input',
        sendSelector: '#chat-send-button',
        responseSelector: '.chat-message.bot-message',
        testCases: [
            {
                message: 'How do I reset my password?',
                expectedKeywords: ['password', 'reset', 'email', 'link']
            },
            {
                message: 'What are your business hours?',
                expectedKeywords: ['hours', 'open', 'monday', 'friday', '9', '5']
            },
            {
                message: 'How can I contact support?',
                expectedKeywords: ['email', 'phone', 'contact', 'support']
            }
        ]
    },
    ticketingUrl: 'https://www.example.com/support/ticket',
    ticketing: {
        nameSelector: '#ticket-name',
        emailSelector: '#ticket-email',
        subjectSelector: '#ticket-subject',
        messageSelector: '#ticket-message',
        prioritySelector: '#ticket-priority',
        submitSelector: '#submit-ticket',
        confirmationSelector: '.confirmation-message'
    },
    faqUrl: 'https://www.example.com/support/faq'
});
```

**Benefits**:
- Continuous support monitoring
- Verify customer experience
- Early issue detection

---

### 16. **Automated Document Download**
**Scenario**: Download reports and documents from web portals.

**Use Case**: Log into business portals, navigate to reports section, download monthly statements, invoices, and analytics reports automatically.

**Implementation Example**:
```javascript
// User request: "Download all monthly reports from our business portal"

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function automatedDocumentDownload(config) {
    const downloadPath = path.resolve('./downloads');

    // Create download directory
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: false,
        args: [`--disable-blink-features=AutomationControlled`]
    });

    const page = await browser.newPage();

    // Set download path
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    const downloadedFiles = [];

    console.log(`Download directory: ${downloadPath}\n`);

    try {
        // Login to portal
        console.log('1. Logging into portal...');
        await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });

        await page.type(config.usernameSelector, config.credentials.username);
        await page.type(config.passwordSelector, config.credentials.password);
        await page.click(config.loginButtonSelector);
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('   ✓ Logged in successfully\n');

        // Navigate to reports section
        console.log('2. Navigating to reports section...');
        await page.goto(config.reportsUrl, { waitUntil: 'networkidle2' });

        // Apply filters if needed (date range, document type, etc.)
        if (config.filters) {
            console.log('3. Applying filters...');

            if (config.filters.dateFromSelector && config.filters.dateFrom) {
                await page.type(config.filters.dateFromSelector, config.filters.dateFrom);
            }

            if (config.filters.dateToSelector && config.filters.dateTo) {
                await page.type(config.filters.dateToSelector, config.filters.dateTo);
            }

            if (config.filters.typeSelector && config.filters.type) {
                await page.select(config.filters.typeSelector, config.filters.type);
            }

            // Apply filter
            if (config.filters.applyButtonSelector) {
                await page.click(config.filters.applyButtonSelector);
                await page.waitForTimeout(2000);
            }

            console.log('   ✓ Filters applied\n');
        }

        // Get list of documents to download
        console.log('4. Finding documents...');

        const documents = await page.evaluate((selector) => {
            const docElements = document.querySelectorAll(selector);
            return Array.from(docElements).map((el, index) => {
                const nameEl = el.querySelector('.document-name, .report-name, h3, h4');
                const dateEl = el.querySelector('.document-date, .report-date, time');
                const downloadBtn = el.querySelector('a[download], button[data-download], .download-btn');

                return {
                    index: index,
                    name: nameEl ? nameEl.textContent.trim() : `Document_${index}`,
                    date: dateEl ? dateEl.textContent.trim() : '',
                    hasDownloadButton: !!downloadBtn
                };
            });
        }, config.documentSelector);

        console.log(`   Found ${documents.length} documents\n`);

        // Download each document
        console.log('5. Downloading documents...');

        for (let i = 0; i < documents.length; i++) {
            try {
                const doc = documents[i];
                console.log(`   [${i + 1}/${documents.length}] Downloading: ${doc.name}`);

                // Get the download button for this document
                const downloadButtons = await page.$$(config.downloadButtonSelector);

                if (downloadButtons[i]) {
                    const filesBefore = fs.readdirSync(downloadPath);

                    // Click download button
                    await downloadButtons[i].click();

                    // Wait for download to complete
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // Check for new file
                    const filesAfter = fs.readdirSync(downloadPath);
                    const newFiles = filesAfter.filter(file => !filesBefore.includes(file));

                    if (newFiles.length > 0) {
                        const downloadedFile = newFiles[0];
                        const oldPath = path.join(downloadPath, downloadedFile);

                        // Rename file with document name
                        const ext = path.extname(downloadedFile);
                        const newFileName = `${doc.name.replace(/[^a-z0-9]/gi, '_')}${ext}`;
                        const newPath = path.join(downloadPath, newFileName);

                        fs.renameSync(oldPath, newPath);

                        downloadedFiles.push({
                            originalName: doc.name,
                            fileName: newFileName,
                            date: doc.date,
                            path: newPath,
                            size: fs.statSync(newPath).size
                        });

                        console.log(`      ✓ Saved as: ${newFileName}`);
                    } else {
                        console.log(`      ✗ Download may have failed`);
                    }
                } else {
                    console.log(`      ✗ No download button found`);
                }

                // Small delay between downloads
                await page.waitForTimeout(1000);

            } catch (error) {
                console.error(`      ✗ Error downloading: ${error.message}`);
            }
        }

        // Generate download report
        console.log('\n=== DOWNLOAD SUMMARY ===');
        console.log(`Total documents found: ${documents.length}`);
        console.log(`Successfully downloaded: ${downloadedFiles.length}`);
        console.log(`Failed downloads: ${documents.length - downloadedFiles.length}`);

        if (downloadedFiles.length > 0) {
            console.log('\nDownloaded Files:');
            downloadedFiles.forEach((file, i) => {
                console.log(`  ${i + 1}. ${file.fileName} (${(file.size / 1024).toFixed(2)} KB)`);
            });

            const totalSize = downloadedFiles.reduce((sum, file) => sum + file.size, 0);
            console.log(`\nTotal size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        }

        // Save manifest
        const manifest = {
            downloadDate: new Date().toISOString(),
            portal: config.loginUrl,
            totalFound: documents.length,
            totalDownloaded: downloadedFiles.length,
            files: downloadedFiles
        };

        fs.writeFileSync(
            path.join(downloadPath, 'download-manifest.json'),
            JSON.stringify(manifest, null, 2)
        );

        console.log(`\n✓ Download manifest saved to ${downloadPath}/download-manifest.json`);

    } catch (error) {
        console.error('Error during download process:', error.message);
        await page.screenshot({ path: 'download-error.png' });
    }

    await browser.close();
    return downloadedFiles;
}

// Execute
automatedDocumentDownload({
    loginUrl: 'https://portal.example.com/login',
    credentials: {
        username: 'user@company.com',
        password: process.env.PORTAL_PASSWORD
    },
    usernameSelector: '#username',
    passwordSelector: '#password',
    loginButtonSelector: '#login-button',
    reportsUrl: 'https://portal.example.com/reports',
    documentSelector: '.report-item',
    downloadButtonSelector: '.download-button',
    filters: {
        dateFromSelector: '#date-from',
        dateToSelector: '#date-to',
        dateFrom: '2025-01-01',
        dateTo: '2025-12-31',
        typeSelector: '#report-type',
        type: 'monthly',
        applyButtonSelector: '#apply-filters'
    }
});
```

**Benefits**:
- Automated document retrieval
- Consistent filing system
- No missed reports

---

### 17. **Real Estate Listing Monitoring**
**Scenario**: Track new property listings matching criteria.

**Use Case**: Monitor real estate websites for new listings matching location, price, and feature requirements, then send notifications with property details and screenshots.

**Implementation Example**:
```javascript
// User request: "Monitor Zillow for new homes in Seattle under $800k with 3+ bedrooms"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function realEstateMonitoring(criteria) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Load previous listings to detect new ones
    let previousListings = [];
    if (fs.existsSync('previous-listings.json')) {
        previousListings = JSON.parse(fs.readFileSync('previous-listings.json', 'utf8'));
    }

    const previousIds = new Set(previousListings.map(l => l.id));

    console.log(`Monitoring real estate listings for: ${criteria.location}`);
    console.log(`Price range: $${criteria.minPrice} - $${criteria.maxPrice}`);
    console.log(`Min bedrooms: ${criteria.bedrooms}\n`);

    try {
        // Build search URL
        const searchUrl = buildSearchUrl(criteria);
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        console.log('Searching for properties...\n');

        // Extract listings
        const listings = await page.evaluate(() => {
            const listingElements = document.querySelectorAll('[data-test="property-card"], .list-card');

            return Array.from(listingElements).map(card => {
                const zpidEl = card.querySelector('[data-zpid]');
                const priceEl = card.querySelector('[data-test="property-card-price"], .list-card-price');
                const addressEl = card.querySelector('[data-test="property-card-addr"], .list-card-addr');
                const bedsEl = card.querySelector('[data-test="property-card-beds"], .list-card-details');
                const linkEl = card.querySelector('a[href*="/homedetails/"]');

                const bedsText = bedsEl ? bedsEl.textContent : '';
                const bedsMatch = bedsText.match(/(\d+)\s*bd/);

                return {
                    id: zpidEl ? zpidEl.getAttribute('data-zpid') : null,
                    price: priceEl ? priceEl.textContent.trim() : 'N/A',
                    address: addressEl ? addressEl.textContent.trim() : 'Unknown',
                    beds: bedsMatch ? parseInt(bedsMatch[1]) : 0,
                    baths: bedsText.match(/(\d+)\s*ba/) ? parseInt(bedsText.match(/(\d+)\s*ba/)[1]) : 0,
                    sqft: bedsText.match(/([\d,]+)\s*sqft/) ? bedsText.match(/([\d,]+)\s*sqft/)[1] : 'N/A',
                    url: linkEl ? 'https://www.zillow.com' + linkEl.getAttribute('href') : null
                };
            }).filter(listing => listing.id);
        });

        console.log(`Found ${listings.length} total listings\n`);

        // Identify new listings
        const newListings = listings.filter(listing => !previousIds.has(listing.id));

        if (newListings.length === 0) {
            console.log('No new listings found since last check.');
        } else {
            console.log(`🏠 ${newListings.length} NEW LISTINGS FOUND!\n`);

            // Process each new listing
            for (const listing of newListings) {
                console.log('─'.repeat(60));
                console.log(`Address: ${listing.address}`);
                console.log(`Price: ${listing.price}`);
                console.log(`Details: ${listing.beds} beds, ${listing.baths} baths, ${listing.sqft} sqft`);
                console.log(`URL: ${listing.url}`);

                // Visit property page and capture screenshot
                if (listing.url) {
                    try {
                        await page.goto(listing.url, { waitUntil: 'networkidle2', timeout: 15000 });
                        await page.waitForTimeout(2000);

                        // Capture screenshot
                        const screenshotPath = `listing-${listing.id}.png`;
                        await page.screenshot({
                            path: screenshotPath,
                            fullPage: false
                        });

                        listing.screenshot = screenshotPath;
                        console.log(`Screenshot saved: ${screenshotPath}`);

                        // Extract additional details
                        const details = await page.evaluate(() => {
                            const descEl = document.querySelector('[data-test="description-text"]');
                            const hoaEl = document.querySelector('[data-test="price-HOA"]');
                            const yearEl = document.querySelector('[data-test="year-built"]');

                            return {
                                description: descEl ? descEl.textContent.substring(0, 200) : '',
                                hoa: hoaEl ? hoaEl.textContent : 'N/A',
                                yearBuilt: yearEl ? yearEl.textContent : 'N/A'
                            };
                        });

                        listing.details = details;

                    } catch (error) {
                        console.log(`Error capturing screenshot: ${error.message}`);
                    }
                }

                console.log('');
            }

            // Send notification (example - would integrate with email/Slack/etc.)
            sendNotification(newListings, criteria);

            // Save all listings for next comparison
            fs.writeFileSync('previous-listings.json', JSON.stringify(listings, null, 2));

            // Generate alert report
            const report = {
                searchDate: new Date().toISOString(),
                criteria: criteria,
                totalListings: listings.length,
                newListings: newListings.length,
                properties: newListings
            };

            fs.writeFileSync('new-listings-report.json', JSON.stringify(report, null, 2));
            console.log('✓ Report saved to new-listings-report.json');
        }

    } catch (error) {
        console.error('Error monitoring listings:', error.message);
    }

    await browser.close();
    return newListings;
}

function buildSearchUrl(criteria) {
    // Example Zillow URL builder
    const location = encodeURIComponent(criteria.location);
    const params = new URLSearchParams({
        searchQueryState: JSON.stringify({
            pagination: {},
            mapBounds: {},
            filterState: {
                price: { min: criteria.minPrice, max: criteria.maxPrice },
                beds: { min: criteria.bedrooms }
            }
        })
    });

    return `https://www.zillow.com/homes/${location}/?${params.toString()}`;
}

function sendNotification(listings, criteria) {
    console.log('\n📧 NOTIFICATION SENT');
    console.log(`${listings.length} new properties matching your criteria in ${criteria.location}`);
    // Would integrate with email service, Slack, SMS, etc.
}

// Execute
realEstateMonitoring({
    location: 'Seattle, WA',
    minPrice: 0,
    maxPrice: 800000,
    bedrooms: 3,
    propertyType: 'house'
});
```

**Benefits**:
- Early awareness of new listings
- Competitive advantage in hot markets
- Automated property research

---

### 18. **SEO and SERP Monitoring**
**Scenario**: Track search engine rankings for keywords.

**Use Case**: Search Google for target keywords, identify website rankings, track competitor positions, and monitor SERP changes over time.

**Implementation Example**:
```javascript
// User request: "Track our rankings for key SEO terms and monitor competitors"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function serpMonitoring(config) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    const results = {
        timestamp: new Date().toISOString(),
        domain: config.targetDomain,
        keywords: []
    };

    console.log(`SEO Monitoring for: ${config.targetDomain}\n`);

    for (const keyword of config.keywords) {
        console.log(`Searching: "${keyword}"`);

        try {
            // Search Google
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, {
                waitUntil: 'networkidle2'
            });

            await page.waitForTimeout(2000);

            // Extract SERP data
            const serpData = await page.evaluate((targetDomain, competitors) => {
                const results = [];
                let targetPosition = null;
                const competitorPositions = {};

                // Get organic results
                const searchResults = document.querySelectorAll('div.g');

                searchResults.forEach((result, index) => {
                    const titleEl = result.querySelector('h3');
                    const linkEl = result.querySelector('a');
                    const snippetEl = result.querySelector('.VwiC3b, .yXK7lf');

                    if (titleEl && linkEl) {
                        const url = linkEl.href;
                        const position = index + 1;

                        const domain = new URL(url).hostname.replace('www.', '');

                        results.push({
                            position: position,
                            title: titleEl.textContent,
                            url: url,
                            domain: domain,
                            snippet: snippetEl ? snippetEl.textContent.substring(0, 150) : ''
                        });

                        // Check if it's our target domain
                        if (domain.includes(targetDomain)) {
                            targetPosition = position;
                        }

                        // Check for competitors
                        competitors.forEach(comp => {
                            if (domain.includes(comp)) {
                                if (!competitorPositions[comp]) {
                                    competitorPositions[comp] = position;
                                }
                            }
                        });
                    }
                });

                // Check for featured snippet
                const featuredSnippet = document.querySelector('.kp-blk, .IZ6rdc');
                let featuredSnippetData = null;

                if (featuredSnippet) {
                    const snippetLink = featuredSnippet.querySelector('a');
                    if (snippetLink) {
                        const snippetDomain = new URL(snippetLink.href).hostname.replace('www.', '');
                        featuredSnippetData = {
                            domain: snippetDomain,
                            isOurs: snippetDomain.includes(targetDomain)
                        };
                    }
                }

                return {
                    results: results.slice(0, 10), // Top 10
                    targetPosition: targetPosition,
                    competitorPositions: competitorPositions,
                    featuredSnippet: featuredSnippetData
                };

            }, config.targetDomain, config.competitors || []);

            // Display results
            if (serpData.targetPosition) {
                console.log(`  ✓ Your site: Position #${serpData.targetPosition}`);
            } else {
                console.log(`  ✗ Your site: Not in top 10`);
            }

            if (serpData.featuredSnippet) {
                if (serpData.featuredSnippet.isOurs) {
                    console.log(`  🌟 Featured Snippet: YOU`);
                } else {
                    console.log(`  Featured Snippet: ${serpData.featuredSnippet.domain}`);
                }
            }

            // Show competitor positions
            Object.entries(serpData.competitorPositions).forEach(([comp, pos]) => {
                console.log(`  Competitor ${comp}: Position #${pos}`);
            });

            // Store keyword data
            results.keywords.push({
                keyword: keyword,
                yourPosition: serpData.targetPosition || 'Not ranked',
                competitors: serpData.competitorPositions,
                featuredSnippet: serpData.featuredSnippet,
                topResults: serpData.results
            });

            console.log('');

            // Delay between searches to avoid rate limiting
            await page.waitForTimeout(3000 + Math.random() * 2000);

        } catch (error) {
            console.error(`  Error searching "${keyword}":`, error.message);
            results.keywords.push({
                keyword: keyword,
                error: error.message
            });
        }
    }

    // Load historical data
    let historical = {};
    if (fs.existsSync('serp-history.json')) {
        historical = JSON.parse(fs.readFileSync('serp-history.json', 'utf8'));
    }

    // Compare with previous results
    console.log('=== RANKING CHANGES ===\n');

    results.keywords.forEach(kw => {
        const prevData = historical[kw.keyword];

        if (prevData && prevData.yourPosition !== kw.yourPosition) {
            const prev = prevData.yourPosition;
            const curr = kw.yourPosition;

            if (curr === 'Not ranked') {
                console.log(`📉 "${kw.keyword}": Dropped out of top 10 (was #${prev})`);
            } else if (prev === 'Not ranked') {
                console.log(`📈 "${kw.keyword}": Entered top 10 at #${curr}`);
            } else if (curr < prev) {
                console.log(`📈 "${kw.keyword}": Improved from #${prev} to #${curr} (+${prev - curr})`);
            } else {
                console.log(`📉 "${kw.keyword}": Dropped from #${prev} to #${curr} (-${curr - prev})`);
            }
        } else if (prevData) {
            console.log(`➡️  "${kw.keyword}": No change (Position #${kw.yourPosition})`);
        }
    });

    // Update historical data
    results.keywords.forEach(kw => {
        historical[kw.keyword] = {
            yourPosition: kw.yourPosition,
            timestamp: results.timestamp
        };
    });

    fs.writeFileSync('serp-history.json', JSON.stringify(historical, null, 2));

    // Save detailed report
    fs.writeFileSync('serp-report.json', JSON.stringify(results, null, 2));

    console.log('\n✓ SERP report saved to serp-report.json');
    console.log('✓ Historical data updated in serp-history.json');

    await browser.close();
    return results;
}

// Execute
serpMonitoring({
    targetDomain: 'example.com',
    keywords: [
        'best project management software',
        'team collaboration tools',
        'agile project management',
        'remote work software',
        'task management app'
    ],
    competitors: [
        'asana.com',
        'trello.com',
        'monday.com',
        'jira.atlassian.com'
    ]
});
```

**Benefits**:
- Track SEO performance
- Competitive analysis
- Identify ranking opportunities

---

### 19. **Automated Account Creation and Management**
**Scenario**: Create test accounts for application testing.

**Use Case**: Automate creation of test user accounts with various configurations for QA testing, including email verification if needed.

**Implementation Example**:
```javascript
// User request: "Create 10 test accounts with different user profiles for QA testing"

const puppeteer = require('puppeteer');
const fs = require('fs');

async function createTestAccounts(config) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const createdAccounts = [];
    const testData = generateTestData(config.numberOfAccounts);

    console.log(`Creating ${config.numberOfAccounts} test accounts...\n`);

    for (let i = 0; i < testData.length; i++) {
        const user = testData[i];

        try {
            console.log(`[${i + 1}/${testData.length}] Creating account: ${user.email}`);

            // Navigate to registration page
            await page.goto(config.registrationUrl, { waitUntil: 'networkidle2' });

            // Fill registration form
            await page.waitForSelector(config.selectors.firstName);

            await page.type(config.selectors.firstName, user.firstName);
            await page.type(config.selectors.lastName, user.lastName);
            await page.type(config.selectors.email, user.email);
            await page.type(config.selectors.password, user.password);

            // Confirm password if needed
            if (config.selectors.confirmPassword) {
                await page.type(config.selectors.confirmPassword, user.password);
            }

            // Fill optional fields
            if (config.selectors.username) {
                await page.type(config.selectors.username, user.username);
            }

            if (config.selectors.phone) {
                await page.type(config.selectors.phone, user.phone);
            }

            if (config.selectors.dateOfBirth) {
                await page.type(config.selectors.dateOfBirth, user.dateOfBirth);
            }

            // Accept terms if checkbox exists
            if (config.selectors.termsCheckbox) {
                await page.click(config.selectors.termsCheckbox);
            }

            // Take screenshot before submission
            await page.screenshot({ path: `account-${i + 1}-form.png` });

            // Submit form
            await page.click(config.selectors.submitButton);

            // Wait for success or error
            try {
                await Promise.race([
                    page.waitForSelector(config.selectors.successIndicator, { timeout: 10000 }),
                    page.waitForSelector(config.selectors.errorIndicator, { timeout: 10000 })
                ]);

                const error = await page.$(config.selectors.errorIndicator);

                if (error) {
                    const errorText = await page.$eval(config.selectors.errorIndicator, el => el.textContent);
                    console.log(`  ✗ Failed: ${errorText}`);
                    user.status = 'failed';
                    user.error = errorText;
                } else {
                    console.log(`  ✓ Account created successfully`);
                    user.status = 'created';

                    // Handle email verification if needed
                    if (config.emailVerification) {
                        console.log(`  Waiting for email verification...`);

                        // In production, would integrate with email service API
                        // For demo, simulating verification
                        const verificationLink = await getVerificationLink(user.email);

                        if (verificationLink) {
                            await page.goto(verificationLink);
                            await page.waitForTimeout(2000);
                            console.log(`  ✓ Email verified`);
                            user.emailVerified = true;
                        }
                    }

                    // Complete profile if needed
                    if (config.profileSetup) {
                        console.log(`  Setting up profile...`);
                        await setupProfile(page, user, config.profileSetup);
                        console.log(`  ✓ Profile setup complete`);
                    }

                    // Capture final state
                    await page.screenshot({ path: `account-${i + 1}-success.png` });
                }

            } catch (error) {
                console.log(`  ✗ Timeout or error during creation`);
                user.status = 'timeout';
            }

            createdAccounts.push(user);

            // Logout if needed
            if (config.selectors.logoutButton) {
                try {
                    await page.click(config.selectors.logoutButton);
                    await page.waitForTimeout(1000);
                } catch (e) {
                    // Logout may not be available
                }
            }

            // Small delay between account creations
            await page.waitForTimeout(2000);

        } catch (error) {
            console.error(`  ✗ Error: ${error.message}`);
            user.status = 'error';
            user.error = error.message;
            createdAccounts.push(user);
        }

        console.log('');
    }

    // Generate summary
    const successful = createdAccounts.filter(a => a.status === 'created').length;
    const failed = createdAccounts.length - successful;

    console.log('=== ACCOUNT CREATION SUMMARY ===');
    console.log(`Total attempts: ${createdAccounts.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success rate: ${((successful / createdAccounts.length) * 100).toFixed(1)}%\n`);

    // Save account data
    const report = {
        timestamp: new Date().toISOString(),
        totalAccounts: createdAccounts.length,
        successful: successful,
        failed: failed,
        accounts: createdAccounts
    };

    fs.writeFileSync('test-accounts.json', JSON.stringify(report, null, 2));

    // Create CSV for easy reference
    const csv = generateCSV(createdAccounts);
    fs.writeFileSync('test-accounts.csv', csv);

    console.log('✓ Account data saved to test-accounts.json');
    console.log('✓ CSV report saved to test-accounts.csv');

    await browser.close();
    return createdAccounts;
}

function generateTestData(count) {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const testAccounts = [];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[i % lastNames.length];
        const timestamp = Date.now() + i;

        testAccounts.push({
            firstName: firstName,
            lastName: lastName,
            username: `test_${firstName.toLowerCase()}_${timestamp}`,
            email: `test_${timestamp}@example.com`,
            password: 'Test123!@#',
            phone: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            dateOfBirth: '01/01/1990',
            accountType: i % 2 === 0 ? 'standard' : 'premium',
            createdAt: new Date().toISOString()
        });
    }

    return testAccounts;
}

async function getVerificationLink(email) {
    // In production, would query email service API (Gmail API, temp-mail service, etc.)
    // Simulating for demo
    return null;
}

async function setupProfile(page, user, selectors) {
    // Additional profile setup steps if needed
    try {
        if (selectors.bioSelector) {
            await page.type(selectors.bioSelector, `Test user profile for ${user.username}`);
        }
        if (selectors.saveButton) {
            await page.click(selectors.saveButton);
        }
    } catch (error) {
        // Profile setup is optional
    }
}

function generateCSV(accounts) {
    const headers = 'Email,Username,Password,First Name,Last Name,Phone,Status,Created At\n';
    const rows = accounts.map(acc =>
        `${acc.email},${acc.username},${acc.password},${acc.firstName},${acc.lastName},${acc.phone},${acc.status},${acc.createdAt}`
    ).join('\n');

    return headers + rows;
}

// Execute
createTestAccounts({
    numberOfAccounts: 10,
    registrationUrl: 'https://www.example.com/register',
    selectors: {
        firstName: '#first-name',
        lastName: '#last-name',
        email: '#email',
        username: '#username',
        password: '#password',
        confirmPassword: '#confirm-password',
        phone: '#phone',
        dateOfBirth: '#dob',
        termsCheckbox: '#accept-terms',
        submitButton: '#submit-registration',
        successIndicator: '.success-message',
        errorIndicator: '.error-message',
        logoutButton: '#logout'
    },
    emailVerification: false,
    profileSetup: null
});
```

**Benefits**:
- Rapid test environment setup
- Consistent test data
- Scalable test account creation

---

### 20. **Multi-Step Workflow Automation**
**Scenario**: Automate complex multi-system workflows.

**Use Case**: Example - Employee onboarding: Create account in HR system, enroll in benefits portal, set up email account, register for training platform, and generate completion report.

**Implementation Example**:
```javascript
// User request: "Automate complete employee onboarding workflow across all systems"

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function multiStepWorkflowAutomation(employee, systems) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const workflowResults = {
        employee: employee,
        timestamp: new Date().toISOString(),
        steps: [],
        completedSteps: 0,
        failedSteps: 0,
        screenshots: []
    };

    console.log(`Starting onboarding workflow for: ${employee.firstName} ${employee.lastName}\n`);

    // Step 1: HR System - Create Employee Account
    try {
        console.log('STEP 1: Creating HR System Account...');

        await page.goto(systems.hrSystem.url, { waitUntil: 'networkidle2' });

        // Admin login
        await page.type(systems.hrSystem.adminLogin.username, systems.hrSystem.adminLogin.user);
        await page.type(systems.hrSystem.adminLogin.password, systems.hrSystem.adminLogin.pass);
        await page.click(systems.hrSystem.adminLogin.submitBtn);
        await page.waitForNavigation();

        // Navigate to new employee form
        await page.goto(systems.hrSystem.newEmployeeUrl);

        // Fill employee details
        await page.type('#first-name', employee.firstName);
        await page.type('#last-name', employee.lastName);
        await page.type('#email', employee.email);
        await page.type('#employee-id', employee.employeeId);
        await page.type('#department', employee.department);
        await page.type('#position', employee.position);
        await page.type('#start-date', employee.startDate);
        await page.select('#employment-type', employee.employmentType);

        const screenshot1 = `step1-hr-account.png`;
        await page.screenshot({ path: screenshot1, fullPage: true });
        workflowResults.screenshots.push(screenshot1);

        await page.click('#submit-employee');
        await page.waitForTimeout(3000);

        const hrAccountId = await page.$eval('#employee-account-id', el => el.textContent);

        workflowResults.steps.push({
            step: 1,
            system: 'HR System',
            action: 'Create employee account',
            status: 'completed',
            details: { accountId: hrAccountId },
            screenshot: screenshot1
        });
        workflowResults.completedSteps++;

        console.log(`  ✓ HR account created: ${hrAccountId}\n`);

    } catch (error) {
        console.error(`  ✗ HR system failed: ${error.message}\n`);
        workflowResults.steps.push({
            step: 1,
            system: 'HR System',
            status: 'failed',
            error: error.message
        });
        workflowResults.failedSteps++;
    }

    // Step 2: Benefits Portal - Enrollment
    try {
        console.log('STEP 2: Enrolling in Benefits Portal...');

        await page.goto(systems.benefitsPortal.url);

        // Employee self-registration
        await page.click('#new-employee-signup');
        await page.type('#ssn', employee.ssn);
        await page.type('#dob', employee.dateOfBirth);
        await page.type('#email-verify', employee.email);
        await page.click('#verify-identity');
        await page.waitForTimeout(2000);

        // Select benefits
        await page.click('#health-plan-standard');
        await page.click('#dental-plan-basic');
        await page.click('#vision-plan-standard');

        // Add dependents if any
        if (employee.dependents && employee.dependents.length > 0) {
            for (const dependent of employee.dependents) {
                await page.click('#add-dependent');
                await page.type('.dependent-name', dependent.name);
                await page.type('.dependent-relation', dependent.relation);
                await page.type('.dependent-dob', dependent.dob);
            }
        }

        const screenshot2 = `step2-benefits.png`;
        await page.screenshot({ path: screenshot2, fullPage: true });
        workflowResults.screenshots.push(screenshot2);

        await page.click('#submit-benefits');
        await page.waitForTimeout(3000);

        const enrollmentId = await page.$eval('#enrollment-confirmation', el => el.textContent.match(/\d+/)[0]);

        workflowResults.steps.push({
            step: 2,
            system: 'Benefits Portal',
            action: 'Complete benefits enrollment',
            status: 'completed',
            details: { enrollmentId: enrollmentId },
            screenshot: screenshot2
        });
        workflowResults.completedSteps++;

        console.log(`  ✓ Benefits enrolled: ${enrollmentId}\n`);

    } catch (error) {
        console.error(`  ✗ Benefits portal failed: ${error.message}\n`);
        workflowResults.steps.push({
            step: 2,
            system: 'Benefits Portal',
            status: 'failed',
            error: error.message
        });
        workflowResults.failedSteps++;
    }

    // Step 3: Email System - Create Email Account
    try {
        console.log('STEP 3: Creating Email Account...');

        await page.goto(systems.emailSystem.adminUrl);

        // Admin portal login
        await page.type('#admin-email', systems.emailSystem.adminLogin.user);
        await page.type('#admin-password', systems.emailSystem.adminLogin.pass);
        await page.click('#admin-login');
        await page.waitForNavigation();

        // Create new mailbox
        await page.click('#create-mailbox');
        await page.type('#new-email-address', employee.email.split('@')[0]);
        await page.select('#email-domain', employee.email.split('@')[1]);
        await page.type('#temp-password', employee.tempPassword);

        // Set mailbox size and permissions
        await page.select('#mailbox-size', '50GB');
        await page.click('#enable-mobile-sync');
        await page.click('#enable-calendar');

        const screenshot3 = `step3-email.png`;
        await page.screenshot({ path: screenshot3, fullPage: true });
        workflowResults.screenshots.push(screenshot3);

        await page.click('#create-account-btn');
        await page.waitForTimeout(2000);

        workflowResults.steps.push({
            step: 3,
            system: 'Email System',
            action: 'Create email account',
            status: 'completed',
            details: {
                email: employee.email,
                tempPassword: employee.tempPassword
            },
            screenshot: screenshot3
        });
        workflowResults.completedSteps++;

        console.log(`  ✓ Email created: ${employee.email}\n`);

    } catch (error) {
        console.error(`  ✗ Email system failed: ${error.message}\n`);
        workflowResults.steps.push({
            step: 3,
            system: 'Email System',
            status: 'failed',
            error: error.message
        });
        workflowResults.failedSteps++;
    }

    // Step 4: Training Platform - Registration
    try {
        console.log('STEP 4: Registering for Training Platform...');

        await page.goto(systems.trainingPlatform.url);

        // Corporate SSO login
        await page.click('#sso-login');
        await page.type('#corporate-email', employee.email);
        await page.type('#corporate-password', employee.tempPassword);
        await page.click('#sso-submit');
        await page.waitForNavigation();

        // Complete profile
        await page.type('#display-name', `${employee.firstName} ${employee.lastName}`);
        await page.type('#job-title', employee.position);
        await page.select('#department-select', employee.department);

        // Enroll in required courses
        const requiredCourses = [
            'New Employee Orientation',
            'Company Policies and Procedures',
            'Information Security Training',
            'Workplace Safety'
        ];

        for (const course of requiredCourses) {
            await page.type('#course-search', course);
            await page.waitForTimeout(1000);
            await page.click('.course-result:first-child .enroll-btn');
            await page.waitForTimeout(500);
        }

        const screenshot4 = `step4-training.png`;
        await page.screenshot({ path: screenshot4, fullPage: true });
        workflowResults.screenshots.push(screenshot4);

        workflowResults.steps.push({
            step: 4,
            system: 'Training Platform',
            action: 'Register and enroll in courses',
            status: 'completed',
            details: { coursesEnrolled: requiredCourses.length },
            screenshot: screenshot4
        });
        workflowResults.completedSteps++;

        console.log(`  ✓ Training enrollment complete: ${requiredCourses.length} courses\n`);

    } catch (error) {
        console.error(`  ✗ Training platform failed: ${error.message}\n`);
        workflowResults.steps.push({
            step: 4,
            system: 'Training Platform',
            status: 'failed',
            error: error.message
        });
        workflowResults.failedSteps++;
    }

    // Step 5: IT Asset Management - Equipment Assignment
    try {
        console.log('STEP 5: Assigning Equipment...');

        await page.goto(systems.assetManagement.url);

        // Login
        await page.type('#it-username', systems.assetManagement.adminLogin.user);
        await page.type('#it-password', systems.assetManagement.adminLogin.pass);
        await page.click('#it-login');
        await page.waitForNavigation();

        // Create asset assignment
        await page.click('#new-assignment');
        await page.type('#assign-to-employee', employee.employeeId);

        // Assign equipment
        await page.select('#laptop-model', 'Dell Latitude 5420');
        await page.select('#monitor', 'Dell 27" UltraSharp');
        await page.click('#keyboard-mouse-set');
        await page.click('#headset');
        await page.click('#docking-station');

        const screenshot5 = `step5-equipment.png`;
        await page.screenshot({ path: screenshot5, fullPage: true });
        workflowResults.screenshots.push(screenshot5);

        await page.click('#submit-assignment');
        await page.waitForTimeout(2000);

        workflowResults.steps.push({
            step: 5,
            system: 'Asset Management',
            action: 'Assign equipment',
            status: 'completed',
            screenshot: screenshot5
        });
        workflowResults.completedSteps++;

        console.log(`  ✓ Equipment assigned\n`);

    } catch (error) {
        console.error(`  ✗ Asset management failed: ${error.message}\n`);
        workflowResults.steps.push({
            step: 5,
            system: 'Asset Management',
            status: 'failed',
            error: error.message
        });
        workflowResults.failedSteps++;
    }

    // Generate comprehensive onboarding report
    console.log('=== ONBOARDING WORKFLOW SUMMARY ===');
    console.log(`Employee: ${employee.firstName} ${employee.lastName}`);
    console.log(`Employee ID: ${employee.employeeId}`);
    console.log(`Total Steps: ${workflowResults.steps.length}`);
    console.log(`Completed: ${workflowResults.completedSteps}`);
    console.log(`Failed: ${workflowResults.failedSteps}`);
    console.log(`Success Rate: ${((workflowResults.completedSteps / workflowResults.steps.length) * 100).toFixed(1)}%\n`);

    workflowResults.steps.forEach((step, i) => {
        const status = step.status === 'completed' ? '✓' : '✗';
        console.log(`${status} Step ${step.step}: ${step.system} - ${step.action}`);
    });

    // Save detailed report
    fs.writeFileSync(
        `onboarding-report-${employee.employeeId}.json`,
        JSON.stringify(workflowResults, null, 2)
    );

    console.log(`\n✓ Onboarding report saved to onboarding-report-${employee.employeeId}.json`);

    await browser.close();
    return workflowResults;
}

// Execute
multiStepWorkflowAutomation(
    {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@company.com',
        employeeId: 'EMP2025001',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        startDate: '2025-01-15',
        employmentType: 'full-time',
        ssn: '123-45-6789',
        dateOfBirth: '1990-05-15',
        tempPassword: 'Welcome2025!',
        dependents: [
            { name: 'Alex Johnson', relation: 'Spouse', dob: '1988-03-20' }
        ]
    },
    {
        hrSystem: {
            url: 'https://hr.company.com',
            newEmployeeUrl: 'https://hr.company.com/employees/new',
            adminLogin: {
                user: 'hr.admin@company.com',
                pass: process.env.HR_ADMIN_PASSWORD,
                submitBtn: '#login-submit'
            }
        },
        benefitsPortal: {
            url: 'https://benefits.company.com'
        },
        emailSystem: {
            adminUrl: 'https://mail-admin.company.com',
            adminLogin: {
                user: 'it.admin@company.com',
                pass: process.env.EMAIL_ADMIN_PASSWORD
            }
        },
        trainingPlatform: {
            url: 'https://training.company.com'
        },
        assetManagement: {
            url: 'https://assets.company.com',
            adminLogin: {
                user: 'it.assets@company.com',
                pass: process.env.ASSET_ADMIN_PASSWORD
            }
        }
    }
);
```

**Benefits**:
- End-to-end process automation
- Consistent workflow execution
- Reduced manual coordination
- Complete audit trail

---

## Advanced Configuration

### Launch Options
```json
{
  "launchOptions": {
    "headless": true,
    "args": ["--no-sandbox", "--disable-setuid-sandbox"]
  },
  "allowDangerous": false
}
```

### Security Considerations
- Set `allowDangerous: false` to prevent potentially unsafe browser arguments
- Use headless mode for production environments
- Implement proper authentication management
- Sanitize user inputs for JavaScript execution

## Best Practices

### Performance Optimization
- Use headless mode for faster execution
- Implement wait strategies for dynamic content
- Close browser instances after completion
- Reuse browser contexts when possible

### Reliability
- Implement retry logic for network failures
- Use explicit waits instead of fixed delays
- Handle common errors gracefully
- Validate element existence before interaction

### Debugging
- Capture screenshots at failure points
- Monitor console logs for errors
- Use non-headless mode during development
- Log all automation steps

## Integration Examples

### With AI Assistants
```
User: "Go to example.com, find the contact form,
      fill it with my details, and submit it"

AI: Executes Puppeteer commands to:
    1. Navigate to example.com
    2. Locate contact form
    3. Fill form fields
    4. Click submit button
    5. Verify submission success
```

### Common Patterns
- **Data Extraction**: Navigate → Extract → Transform → Export
- **Form Automation**: Navigate → Fill → Submit → Verify
- **Monitoring**: Navigate → Capture → Compare → Alert
- **Testing**: Setup → Execute → Assert → Report

## Troubleshooting

### Common Issues
- **Timeouts**: Increase wait times for slow-loading pages
- **Element Not Found**: Verify selectors, check for dynamic content
- **Authentication**: Handle session management properly
- **Resource Loading**: Wait for network idle before interaction

## Conclusion

Puppeteer MCP transforms browser automation by making it accessible through natural language. From automated testing to data scraping, competitive research to workflow automation, these 20 use cases demonstrate how AI-assisted browser automation can streamline operations, save time, and enable sophisticated web interactions at scale.

---

*Official Package: @modelcontextprotocol/server-puppeteer*
*Repository: https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer*
*Documentation: https://modelcontextprotocol.io/examples*
