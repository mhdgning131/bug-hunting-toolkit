export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItemDefinition[];
}

export interface ChecklistItemDefinition {
  id: string;
  text: string;
}

export const reconChecklist: ChecklistCategory[] = [
  {
    id: "infra",
    title: "Infrastructure & Protections",
    items: [
      { id: "1", text: "What is the main domain/subdomain you’re testing ?" },
      { id: "2", text: "Is the website hosted on a CDN or directly on an IP ?" },
      { id: "3", text: "Is HTTPS enforced site-wide? Are there mixed content issues ?" },
      { id: "4", text: "What is the domain age and registrar ( via whois ) ?" },
      { id: "5", text: "Are there related domains owned by the same organization ?" },
      { id: "6", text: "What WAF is in place ( e.g., Cloudflare, Akamai, AWS Shield ) ?" },
      { id: "7", text: "Are there rate-limiting protections ? What happens after multiple requests ?" },
      { id: "8", text: "Are generic attack payloads ( e.g., <script>, ' OR 1=1 --) being blocked ?" },
      { id: "9", text: "Are there any CAPTCHA systems in place ?" },
      { id: "10", text: "Is there a bot protection system like Datadome or PerimeterX ?" },
      { id: "11", text: "What hosting provider or ASN is the server using ?" },
      { id: "12", text: "Is the website hosted on cloud infrastructure ( AWS, GCP, Azure ) ?" },
      { id: "13", text: "Is the backend on the same domain or routed to other services ?" },
      { id: "14", text: "Are there load balancers or reverse proxies in front of the server ?" },
    ]
  },
  {
    id: "stack",
    title: "Tech Stack Analysis",
    items: [
      { id: "15", text: "What is the frontend framework used ( React, Angular, Vue, etc. ) ?" },
      { id: "16", text: "What is the backend language or framework ( Laravel, Django, Spring, Express ) ?" },
      { id: "17", text: "What web server is used ( Apache, Nginx, etc. ) ?" },
      { id: "18", text: "What database seems to be used ( MySQL, PostgreSQL, MongoDB, etc. ) ?" },
      { id: "19", text: "Are there any CMS platforms detected ( WordPress, Joomla ) ?" },
      { id: "20", text: "Are there any known third-party libraries or JS plugins ?" },
      { id: "21", text: "Are there version numbers visible in HTML, headers, or JS files ?" },
      { id: "22", text: "Are any outdated or vulnerable versions detected ?" },
    ]
  },
  {
    id: "content",
    title: "Content & Files",
    items: [
      { id: "23", text: "Are there admin paths exposed for these services ( e.g., /wp-admin, /phpmyadmin ) ?" },
      { id: "24", text: "What hidden paths or directories are discovered ( e.g., /admin, /backup, /test ) ?" },
      { id: "25", text: "Are there .git, .svn, .DS_Store, or other sensitive files accessible ?" },
      { id: "26", text: "Are any exposed configuration files found ( e.g., .env, config.json ) ?" },
      { id: "27", text: "Is directory listing enabled on any path ?" },
      { id: "28", text: "Are there backup or old versions of files (.bak, .old, index~) ?" },
      { id: "29", text: "Are there server-related headers that leak information (e.g., Server: Apache/2.4.7) ?" },
    ]
  },
  {
    id: "params",
    title: "Parameters & Inputs",
    items: [
      { id: "30", text: "What are the GET and POST parameters found on the application ?" },
      { id: "31", text: "Are there hidden parameters ( e.g., from old APIs, JS files ) ?" },
      { id: "32", text: "Are parameters predictable, numeric, or UUID-based ?" },
      { id: "33", text: "Are there any debug or verbose parameters ( e.g., debug=true, verbose=1 )?" },
      { id: "34", text: "Are parameters sent in JSON, URL-encoded, or multipart form ?" },
    ]
  },
  {
    id: "api",
    title: "APIs & JavaScript",
    items: [
      { id: "35", text: "Are there any third-party APIs being called ( payment, auth, analytics ) ?" },
      { id: "36", text: "Are any internal API endpoints exposed publicly ( e.g., /api/admin ) ?" },
      { id: "37", text: "Is there a Swagger or OpenAPI definition exposed ?" },
      { id: "38", text: "Are GraphQL endpoints present ?" },
      { id: "39", text: "Are any WebSocket connections initiated ?" },
      { id: "40", text: "What JavaScript files are loaded externally ?" },
      { id: "41", text: "Do any JS files contain sensitive endpoints, secrets, or API keys ?" },
      { id: "42", text: "Are environment variables or base URLs hardcoded in JS ?" },
      { id: "43", text: "Are there old or unminified versions of JS available ?" },
    ]
  },
  {
    id: "auth",
    title: "Access Control & Logic",
    items: [
      { id: "44", text: "What pages require login ? Which are public ?" },
      { id: "45", text: "What input fields are available ( forms, search, uploads ) ?" },
      { id: "46", text: "What roles exist on the application ( guest, user, admin ) ?" },
      { id: "47", text: "What actions can a logged-in user perform ( upload, delete, modify ) ?" },
      { id: "48", text: "Are there multi-step actions like password reset, email change, etc. ?" },
    ]
  },
  {
    id: "org",
    title: "Subdomains & Organization",
    items: [
      { id: "49", text: "Are any subdomains pointing to unclaimed cloud resources ( S3, Azure Blob ) ?" },
      { id: "50", text: "Are there development or staging subdomains exposed ?" },
      { id: "51", text: "Are any inactive or broken subdomains responding to requests ?" },
      { id: "52", text: "Are there login portals on any subdomains ?" },
      { id: "53", text: "What company owns the domain ( whois, Censys ) ?" },
      { id: "54", text: "What other domains or brands belong to the same company ?" },
      { id: "55", text: "What are the company's recent acquisitions or mergers ?" },
      { id: "56", text: "Are there developers or IT staff linked to the company ( LinkedIn, GitHub ) ?" },
      { id: "57", text: "Do they have public bug bounty/disclosure policies ?" },
    ]
  },
  {
    id: "other",
    title: "Other Vectors",
    items: [
      { id: "58", text: "Are there any mobile applications tied to this web app ?" },
      { id: "59", text: "Does the site integrate with IoT or smart devices ?" },
      { id: "60", text: "Is there a desktop/web hybrid ( e.g., Electron-based ) client ?" },
      { id: "61", text: "Are there 3rd-party login integrations ( OAuth: Google, Facebook ) ?" },
      { id: "62", text: "Are there legacy endpoints still working ( e.g., /v1/api/) ?" },
    ]
  }
];
