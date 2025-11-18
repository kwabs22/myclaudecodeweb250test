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

**Automation Steps**:
- Navigate to competitor URLs
- Extract pricing data from product pages
- Screenshot key products
- Compare with historical data
- Generate comparison report

**Benefits**:
- Real-time competitive intelligence
- Automated price monitoring
- Visual proof of competitor offerings

---

### 2. **Automated Testing for Web Applications**
**Scenario**: End-to-end testing of web application workflows.

**Use Case**: Test a complete user journey: login, navigate to dashboard, create new record, verify creation, and logout. Capture screenshots at each step for test documentation.

**Automation Steps**:
- Navigate to application login page
- Fill username and password fields
- Click login button
- Verify successful authentication
- Navigate through application workflows
- Assert expected behaviors
- Screenshot each step for reporting

**Benefits**:
- Automated regression testing
- Consistent test execution
- Visual test documentation

---

### 3. **Data Scraping for Market Research**
**Scenario**: Collect product reviews and ratings from multiple e-commerce sites.

**Use Case**: Visit product pages on Amazon, eBay, and other marketplaces, extract reviews, ratings, and customer feedback for sentiment analysis.

**Automation Steps**:
- Navigate to product pages
- Scroll to load all reviews
- Extract review text, ratings, dates
- Handle pagination
- Export to structured format

**Benefits**:
- Comprehensive market insights
- Automated data collection
- Competitive sentiment analysis

---

### 4. **Automated Form Submission**
**Scenario**: Submit registration forms across multiple platforms.

**Use Case**: Automate employee onboarding by filling registration forms on HR platforms, benefits portals, and training systems with employee data.

**Automation Steps**:
- Read employee data from database
- Navigate to registration forms
- Fill all form fields (name, email, salary, etc.)
- Upload required documents
- Submit and verify confirmation

**Benefits**:
- Eliminates manual data entry
- Reduces onboarding time
- Ensures data consistency

---

### 5. **Website Performance Monitoring**
**Scenario**: Track website load times and performance metrics.

**Use Case**: Regularly visit website pages, measure load times, capture performance metrics, and alert if performance degrades below thresholds.

**Automation Steps**:
- Navigate to target pages
- Measure page load time
- Track resource loading
- Monitor console errors
- Log performance metrics
- Alert on performance issues

**Benefits**:
- Proactive performance monitoring
- Historical performance data
- Early problem detection

---

### 6. **Automated Social Media Posting**
**Scenario**: Schedule and post content across social media platforms.

**Use Case**: Log into social media accounts, navigate to post creation, fill content, upload images, and publish posts automatically.

**Automation Steps**:
- Authenticate to social platforms
- Navigate to post creation interface
- Fill post content and hashtags
- Upload media files
- Schedule or publish immediately
- Verify successful posting

**Benefits**:
- Consistent social media presence
- Time-saving automation
- Multi-platform posting

---

### 7. **Lead Generation from Business Directories**
**Scenario**: Extract business contact information from online directories.

**Use Case**: Search business directories like Yellow Pages or industry-specific sites, extract company names, phone numbers, emails, and addresses for sales prospecting.

**Automation Steps**:
- Search directories by category/location
- Navigate through search results
- Extract business information
- Handle pagination
- Export to CRM format

**Benefits**:
- Automated lead generation
- Comprehensive contact databases
- Time-efficient prospecting

---

### 8. **Job Application Automation**
**Scenario**: Apply to multiple job postings efficiently.

**Use Case**: Navigate to job boards, search for relevant positions, fill application forms with resume data, and submit applications automatically.

**Automation Steps**:
- Search job boards with criteria
- Filter relevant positions
- Fill application forms
- Upload resume and documents
- Submit applications
- Track submission status

**Benefits**:
- Apply to more positions quickly
- Consistent application data
- Application tracking

---

### 9. **E-commerce Inventory Monitoring**
**Scenario**: Monitor product availability and stock levels.

**Use Case**: Check multiple e-commerce sites for product availability, track when out-of-stock items become available, and send notifications.

**Automation Steps**:
- Navigate to product pages
- Check stock status
- Monitor price changes
- Detect availability changes
- Send alerts when available

**Benefits**:
- Never miss restocks
- Price drop notifications
- Automated shopping assistant

---

### 10. **Automated Invoice Generation**
**Scenario**: Extract data from web portals and generate invoices.

**Use Case**: Log into client portals, extract billing information, hours worked, and rates, then populate invoice templates automatically.

**Automation Steps**:
- Authenticate to client portals
- Navigate to billing sections
- Extract hours and rates
- Calculate totals
- Populate invoice template
- Generate PDF invoices

**Benefits**:
- Streamlined billing process
- Reduced manual errors
- Faster invoice generation

---

### 11. **Content Aggregation and Curation**
**Scenario**: Collect articles and content from multiple sources.

**Use Case**: Visit news sites, blogs, and industry publications, extract articles matching specific topics, and compile into a curated newsletter.

**Automation Steps**:
- Navigate to content sources
- Search for relevant topics
- Extract article titles, excerpts, URLs
- Check for duplicate content
- Compile into newsletter format

**Benefits**:
- Automated content curation
- Comprehensive topic coverage
- Time-saving research

---

### 12. **Automated Meeting Scheduling**
**Scenario**: Schedule meetings across calendar platforms.

**Use Case**: Log into calendar systems, find available time slots, create meeting events, and send invitations to participants automatically.

**Automation Steps**:
- Access calendar interface
- Check availability across participants
- Navigate to event creation
- Fill meeting details
- Add participants
- Send invitations

**Benefits**:
- Eliminates scheduling back-and-forth
- Finds optimal meeting times
- Automated coordination

---

### 13. **Web Application Accessibility Testing**
**Scenario**: Test website accessibility compliance.

**Use Case**: Navigate website with keyboard-only interaction, verify ARIA labels, check color contrast, and generate accessibility reports.

**Automation Steps**:
- Navigate using keyboard only
- Check for ARIA attributes
- Verify alt text on images
- Test form label associations
- Execute accessibility audits
- Generate compliance report

**Benefits**:
- Ensure accessibility compliance
- Identify accessibility gaps
- Automated audit reports

---

### 14. **Price Comparison and Deal Finding**
**Scenario**: Compare prices across multiple retailers.

**Use Case**: Search for specific products across e-commerce sites, extract prices, shipping costs, and availability to find the best deals.

**Automation Steps**:
- Search product on multiple sites
- Extract pricing information
- Calculate total costs including shipping
- Compare across retailers
- Identify best deals

**Benefits**:
- Automated price comparison
- Find best deals quickly
- Save money on purchases

---

### 15. **Automated Customer Support Testing**
**Scenario**: Test chatbot and support form functionality.

**Use Case**: Interact with customer support chatbots, submit test support tickets, verify automated responses, and ensure support systems are functioning.

**Automation Steps**:
- Navigate to support interfaces
- Interact with chatbots
- Submit test support tickets
- Verify automated responses
- Check response times
- Report functionality issues

**Benefits**:
- Continuous support monitoring
- Verify customer experience
- Early issue detection

---

### 16. **Automated Document Download**
**Scenario**: Download reports and documents from web portals.

**Use Case**: Log into business portals, navigate to reports section, download monthly statements, invoices, and analytics reports automatically.

**Automation Steps**:
- Authenticate to portals
- Navigate to documents section
- Filter by date range
- Click download buttons
- Organize downloaded files
- Verify completeness

**Benefits**:
- Automated document retrieval
- Consistent filing system
- No missed reports

---

### 17. **Real Estate Listing Monitoring**
**Scenario**: Track new property listings matching criteria.

**Use Case**: Monitor real estate websites for new listings matching location, price, and feature requirements, then send notifications with property details and screenshots.

**Automation Steps**:
- Search real estate sites with criteria
- Identify new listings
- Extract property details
- Capture property images
- Send notification with details
- Track listing history

**Benefits**:
- Early awareness of new listings
- Competitive advantage in hot markets
- Automated property research

---

### 18. **SEO and SERP Monitoring**
**Scenario**: Track search engine rankings for keywords.

**Use Case**: Search Google for target keywords, identify website rankings, track competitor positions, and monitor SERP changes over time.

**Automation Steps**:
- Perform searches for keywords
- Extract search result rankings
- Identify competitor positions
- Track featured snippets
- Monitor ranking changes
- Generate SEO reports

**Benefits**:
- Track SEO performance
- Competitive analysis
- Identify ranking opportunities

---

### 19. **Automated Account Creation and Management**
**Scenario**: Create test accounts for application testing.

**Use Case**: Automate creation of test user accounts with various configurations for QA testing, including email verification if needed.

**Automation Steps**:
- Navigate to registration pages
- Fill registration forms with test data
- Handle email verification (with email service integration)
- Complete profile setup
- Verify account creation
- Document test accounts

**Benefits**:
- Rapid test environment setup
- Consistent test data
- Scalable test account creation

---

### 20. **Multi-Step Workflow Automation**
**Scenario**: Automate complex multi-system workflows.

**Use Case**: Example - Employee onboarding: Create account in HR system, enroll in benefits portal, set up email account, register for training platform, and generate completion report.

**Automation Steps**:
- Authenticate to each system
- Navigate complex interfaces
- Fill multi-page forms
- Upload documents where needed
- Verify each step completion
- Screenshot confirmations
- Generate workflow report

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
