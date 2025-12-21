import {
  Globe, ScanLine, Lock, Bug, FileCode, Network, Layers, Cpu, SearchCode, Zap,
  FolderSearch, Database, Hammer, Bomb, Ghost, Wrench, Search, Cloud, ShieldAlert, Code
} from "lucide-react";
import { CommandTool, ResourceTool, Extension, Writeup, Category } from "./types";

export const commandCategories: Category[] = [
  { id: "recon", title: "Subdomain Reconnaissance", icon: Globe, type: "web" },
  { id: "url", title: "URL Collection", icon: ScanLine, type: "web" },
  { id: "sensitive", title: "Sensitive Data Discovery", icon: Lock, type: "web" },
  { id: "xss", title: "XSS Testing", icon: Bug, type: "web" },
  { id: "lfi", title: "LFI Testing", icon: FileCode, type: "web" },
  { id: "cors", title: "CORS Testing", icon: Network, type: "web" },
  { id: "wordpress", title: "WordPress Scanning", icon: Layers, type: "web" },
  { id: "network", title: "Network Scanning", icon: Cpu, type: "system" },
  { id: "parameter", title: "Parameter Discovery", icon: SearchCode, type: "web" },
  { id: "directory", title: "Directory & Fuzzing", icon: FolderSearch, type: "web" },
  { id: "sql", title: "SQL Injection", icon: Database, type: "web" },
  { id: "bruteforce", title: "Brute Force", icon: Hammer, type: "system" },
  { id: "postexploit", title: "Post-Exploitation", icon: Ghost, type: "system" },
  { id: "js", title: "JavaScript Analysis", icon: FileCode, type: "web" },
  { id: "advanced", title: "Advanced Techniques", icon: Zap, type: "web" },
  // Google Dorks Categories
  { id: "dork_recon", title: "Google Dorks: Recon", icon: Search, type: "web" },
  { id: "dork_files", title: "Google Dorks: Files", icon: FileCode, type: "web" },
  { id: "dork_login", title: "Google Dorks: Login", icon: Lock, type: "web" },
  { id: "dork_cloud", title: "Google Dorks: Cloud", icon: Cloud, type: "web" },
  { id: "dork_vuln", title: "Google Dorks: Vulns", icon: ShieldAlert, type: "web" },
  { id: "dork_tech", title: "Google Dorks: Tech", icon: Code, type: "web" },
];

export const commandTools: CommandTool[] = [
  // Subdomain
  {
    id: "subfinder",
    name: "Basic Discovery",
    category: "recon",
    description: "Fast passive subdomain discovery using Subfinder.",
    commandTemplate: (t) => `subfinder -d ${t} -all -recursive > sub_${t}.txt`
  },
  {
    id: "live-sub",
    name: "Live Subdomain Filtering",
    category: "recon",
    description: "Filter for alive hosts using HTTPX toolkit.",
    commandTemplate: (t) => `cat sub_${t}.txt | httpx-toolkit -ports 80,443,8080,8000,8888 -threads 200 > sub_${t}_alive.txt`
  },
  {
    id: "subzy",
    name: "Subdomain Takeover Check",
    category: "recon",
    description: "Check for potential subdomain takeover vulnerabilities.",
    commandTemplate: (t) => `subzy run --targets sub_${t}.txt --concurrency 100 --hide_fails --verify_ssl`
  },

  // URL Collection
  {
    id: "katana-passive",
    name: "Passive URL Collection",
    category: "url",
    description: "Collects URLs via Katana (Wayback, CommonCrawl, AlienVault).",
    commandTemplate: (t) => `katana -u sub_${t}_alive.txt -d 5 -ps -pss waybackarchive,commoncrawl,alienvault -kf -jc -fx -ef woff,css,png,svg,jpg,woff2,jpeg,gif,svg -o allurls.txt`
  },
  {
    id: "advanced-fetch",
    name: "Advanced URL Fetching",
    category: "url",
    description: "Pipeline: Echo -> Katana -> URLDedupe -> Anew -> Sed cleanup.",
    commandTemplate: (t) => `echo ${t} | katana -d 5 -ps -pss waybackarchive,commoncrawl,alienvault -f qurl | urldedupe > output.txt && katana -u https://${t} -d 5 | grep '=' | urldedupe | anew output.txt && cat output.txt | sed 's/=.*/=/' > final.txt`
  },
  {
    id: "gau-pipeline",
    name: "GAU URL Collection",
    category: "url",
    description: "Get All Urls (GAU) with extension filtering and deduplication.",
    commandTemplate: (t) => `echo ${t} | gau --mc 200 | urldedupe > urls.txt && cat urls.txt | grep -E ".php|.asp|.aspx|.jspx|.jsp" | grep '=' | sort > output.txt && cat output.txt | sed 's/=.*/=/' > final.txt`
  },

  // Sensitive Data
  {
    id: "sensitive-files",
    name: "Sensitive File Detection",
    category: "sensitive",
    description: "Grep for sensitive file extensions (xls, xml, json, config, etc).",
    commandTemplate: (t) => `cat allurls.txt | grep -E "\\.xls|\\.xml|\\.xlsx|\\.json|\\.pdf|\\.sql|\\.doc|\\.docx|\\.pptx|\\.txt|\\.zip|\\.tar\\.gz|\\.tgz|\\.bak|\\.7z|\\.rar|\\.log|\\.cache|\\.secret|\\.db|\\.backup|\\.yml|\\.gz|\\.config|\\.csv|\\.yaml|\\.md|\\.md5"`
  },
  {
    id: "info-dork",
    name: "Information Disclosure Dork",
    category: "sensitive",
    description: "Google dork for exposed documents and config files.",
    commandTemplate: (t) => `site:*.${t} (ext:doc OR ext:docx OR ext:odt OR ext:pdf OR ext:rtf OR ext:ppt OR ext:pptx OR ext:csv OR ext:xls OR ext:xlsx OR ext:txt OR ext:xml OR ext:json OR ext:zip OR ext:rar OR ext:md OR ext:log OR ext:bak OR ext:conf OR ext:sql)`
  },
  {
    id: "git-repo",
    name: "Git Repository Detection",
    category: "sensitive",
    description: "Checks for exposed .git repositories using GF and HTTPX.",
    commandTemplate: (t) => `cat ${t}_subs.txt | grep "SUCCESS" | gf urls | httpx-toolkit -sc -server -cl -path "/.git/" -mc 200 -location -ms "Index of" -probe`
  },
  {
    id: "s3-scanner",
    name: "AWS S3 Bucket Finder",
    category: "sensitive",
    description: "Searches for AWS S3 buckets associated with the target.",
    commandTemplate: (t) => `s3scanner scan -d ${t}`
  },
  {
    id: "api-keys",
    name: "API Key Finder",
    category: "sensitive",
    description: "Searches for exposed API keys and tokens in JavaScript files.",
    commandTemplate: (t) => `cat allurls.txt | grep -E "\\.js$" | httpx-toolkit -mc 200 -content-type | grep -E "application/javascript|text/javascript" | cut -d' ' -f1 | xargs -I% curl -s % | grep -E "(API_KEY|api_key|apikey|secret|token|password)"`
  },

  // XSS
  {
    id: "xss-pipeline",
    name: "XSS Hunting Pipeline",
    category: "xss",
    description: "Comprehensive pipeline: GAU -> GF -> Uro -> Gxss -> Kxss.",
    commandTemplate: (t) => `echo https://${t}/ | gau | gf xss | uro | Gxss | kxss | tee xss_output.txt`
  },
  {
    id: "dalfox",
    name: "XSS with Dalfox",
    category: "xss",
    description: "Pipe parameters to Dalfox for active verification (Blind XSS).",
    commandTemplate: (t) => `cat xss_params.txt | dalfox pipe --blind https://your-collaborator-url --waf-bypass --silence`
  },
  {
    id: "stored-xss",
    name: "Stored XSS Finder",
    category: "xss",
    description: "Scans forms (login, register) using Nuclei templates.",
    commandTemplate: (t) => `cat urls.txt | grep -E "(login|signup|register|forgot|password|reset)" | httpx -silent | nuclei -t nuclei-templates/vulnerabilities/xss/ -severity critical,high`
  },
  {
    id: "dom-xss",
    name: "DOM XSS Detection",
    category: "xss",
    description: "Analyzes JS files for DOM-based XSS using Gxss and Dalfox.",
    commandTemplate: (t) => `cat js_files.txt | Gxss -c 100 | sort -u | dalfox pipe -o dom_xss_results.txt`
  },

  // LFI
  {
    id: "lfi-method",
    name: "LFI Methodology",
    category: "lfi",
    description: "Fuzzing for LFI using GF patterns, qsreplace, and FFUF.",
    commandTemplate: (t) => `echo "https://${t}/" | gau | gf lfi | uro | sed 's/=.*/=/' | qsreplace "FUZZ" | sort -u | xargs -I{} ffuf -u {} -w payloads/lfi.txt -c -mr "root:(x|\\*|\\$[^\\:]*):0:0:" -v`
  },

  // CORS
  {
    id: "cors-basic",
    name: "Basic CORS Check",
    category: "cors",
    description: "Manual check for Origin reflection in headers.",
    commandTemplate: (t) => `curl -H "Origin: http://${t}" -I https://${t}/wp-json/`
  },
  {
    id: "corscanner",
    name: "CORScanner",
    category: "cors",
    description: "Python-based CORS misconfiguration scanner.",
    commandTemplate: (t) => `python3 CORScanner.py -u https://${t} -d -t 10`
  },
  {
    id: "cors-nuclei",
    name: "CORS Nuclei Scan",
    category: "cors",
    description: "Automated CORS scan using Nuclei templates.",
    commandTemplate: (t) => `cat ${t}_alive.txt | httpx -silent | nuclei -t nuclei-templates/vulnerabilities/cors/ -o cors_results.txt`
  },
  {
    id: "cors-origin",
    name: "CORS Origin Reflection",
    category: "cors",
    description: "Tests for specific malicious origin reflection.",
    commandTemplate: (t) => `curl -H "Origin: https://evil.com" -I https://${t}/api/data | grep -i "access-control-allow-origin: https://evil.com"`
  },

  // WordPress
  {
    id: "wpscan",
    name: "Aggressive WordPress Scan",
    category: "wordpress",
    description: "Enumerates plugins, users, and themes with token authentication.",
    commandTemplate: (t) => `wpscan --url https://${t} -e at -e ap -e u --enumerate ap --plugins-detection aggressive --force`
  },

  // Network
  {
    id: "naabu",
    name: "Naabu Port Scan",
    category: "network",
    description: "Fast port scanner by ProjectDiscovery.",
    commandTemplate: (t) => `naabu -list ip.txt -c 50 -nmap-cli 'nmap -sV -SC' -o naabu-full.txt`
  },
  {
    id: "nmap",
    name: "Nmap Full Scan",
    category: "network",
    description: "Comprehensive Nmap scan for all ports.",
    commandTemplate: (t) => `nmap -p- --min-rate 1000 -T4 -A ${t} -oA fullscan`
  },
  {
    id: "masscan",
    name: "Masscan",
    category: "network",
    description: "High-speed port scanner for large ranges.",
    commandTemplate: (t) => `masscan -p0-65535 ${t} --rate 100000 -oG masscan-results.txt`
  },

  // Parameter Discovery
  {
    id: "arjun-passive",
    name: "Arjun Passive",
    category: "parameter",
    description: "Passive parameter discovery.",
    commandTemplate: (t) => `arjun -u https://${t}/endpoint.php -oT arjun_output.txt -t 10 --rate-limit 10 --passive -m GET,POST --headers "User-Agent: Mozilla/5.0"`
  },
  {
    id: "arjun-active",
    name: "Arjun Wordlist",
    category: "parameter",
    description: "Active parameter discovery with wordlist.",
    commandTemplate: (t) => `arjun -u https://${t}/endpoint.php -oT arjun_output.txt -m GET,POST -w /wordlists/params.txt -t 10 --rate-limit 10 --headers "User-Agent: Mozilla/5.0"`
  },

  // JS Analysis
  {
    id: "js-nuclei",
    name: "JS File Hunting",
    category: "js",
    description: "Collects and scans JS files using Nuclei exposures templates.",
    commandTemplate: (t) => `echo ${t} | katana -d 5 | grep -E "\\.js$" | nuclei -t nuclei-templates/http/exposures/ -c 30`
  },

  // Directory & Fuzzing
  {
    id: "ffuf-dir",
    name: "FFUF Directory Fuzzing",
    category: "directory",
    description: "Fast web fuzzer for directory discovery.",
    commandTemplate: (t) => `ffuf -w wordlist.txt -u https://${t}/FUZZ -mc 200 -c -recursion`
  },
  {
    id: "dirsearch",
    name: "Dirsearch",
    category: "directory",
    description: "Web path scanner with extension support.",
    commandTemplate: (t) => `dirsearch -u https://${t} -e php,html,js,json -x 404 --threads 50`
  },
  {
    id: "gobuster-dir",
    name: "Gobuster Directory",
    category: "directory",
    description: "Directory/File busting tool written in Go.",
    commandTemplate: (t) => `gobuster dir -u https://${t} -w wordlist.txt -k -o output.txt`
  },
  {
    id: "gobuster-dns",
    name: "Gobuster DNS",
    category: "directory",
    description: "DNS subdomain fuzzing mode.",
    commandTemplate: (t) => `gobuster dns -d ${t} -w wordlist.txt -t 50`
  },
  {
    id: "wfuzz",
    name: "Wfuzz",
    category: "directory",
    description: "Web application fuzzer.",
    commandTemplate: (t) => `wfuzz -w wordlist.txt -u https://${t}/FUZZ -z range,1-100 --hc 404`
  },

  // SQL Injection
  {
    id: "sqlmap-dbs",
    name: "SQLMap Enumerate DBs",
    category: "sql",
    description: "Detect and enumerate databases via SQL injection.",
    commandTemplate: (t) => `sqlmap -u "https://${t}/vulnerable.php?id=1" --dbs --batch --random-agent`
  },
  {
    id: "sqlmap-dump",
    name: "SQLMap Dump Data",
    category: "sql",
    description: "Dump database tables and columns.",
    commandTemplate: (t) => `sqlmap -u "https://${t}/vulnerable.php?id=1" -D dbname --tables --dump --batch`
  },

  // Brute Force
  {
    id: "hydra-http",
    name: "Hydra HTTP Login",
    category: "bruteforce",
    description: "Brute-force HTTP login forms.",
    commandTemplate: (t) => `hydra -l admin -P passwords.txt ${t} http-post-form "/login.php:user=^USER^&pass=^PASS^:F=Invalid"`
  },
  {
    id: "hydra-ssh",
    name: "Hydra SSH",
    category: "bruteforce",
    description: "Brute-force SSH credentials.",
    commandTemplate: (t) => `hydra -L users.txt -P passwords.txt ssh://${t} -t 4`
  },

  // Post-Exploitation
  {
    id: "john-crack",
    name: "John the Ripper",
    category: "postexploit",
    description: "Crack password hashes using wordlists.",
    commandTemplate: (t) => `john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt`
  },
  {
    id: "hashcat",
    name: "Hashcat",
    category: "postexploit",
    description: "Advanced password recovery using GPU.",
    commandTemplate: (t) => `hashcat -m 0 -a 0 hashes.txt wordlist.txt --force`
  },
  {
    id: "sshuttle",
    name: "Sshuttle VPN",
    category: "postexploit",
    description: "Transparent proxy server/VPN over SSH.",
    commandTemplate: (t) => `sshuttle -r user@target_host 0/0 -vv`
  },
  {
    id: "socat-listener",
    name: "Socat Listener",
    category: "postexploit",
    description: "Set up a fully interactive reverse shell listener.",
    commandTemplate: (t) => `socat file:\`tty\`,raw,echo=0 tcp-listen:4444`
  },

  // Advanced
  {
    id: "xss-ssrf-headers",
    name: "XSS/SSRF Header Testing",
    category: "advanced",
    description: "Injects payloads into various HTTP headers.",
    commandTemplate: (t) => `cat ${t}_alive.txt | assetfinder --subs-only| httprobe | while read url; do xss1=$(curl -s -L $url -H 'X-Forwarded-For: xss.collab'|grep xss) xss2=$(curl -s -L $url -H 'X-Forwarded-Host: xss.collab'|grep xss); echo -e "$url\n$xss1\n$xss2"; done`
  },
  {
    id: "altdns",
    name: "Permutation Scanning",
    category: "recon",
    description: "Generate and resolve permutations of found subdomains using Altdns.",
    commandTemplate: (t) => `altdns -i subdomains.txt -o data_output -w words.txt -r -s results_output.txt`
  },
  {
    id: "puredns",
    name: "Resolved DNS Validation",
    category: "recon",
    description: "High-speed mass DNS resolution using Puredns.",
    commandTemplate: (t) => `puredns resolve subdomains.txt -r resolvers.txt --write resolved_subs.txt`
  },
  {
    id: "feroxbuster",
    name: "Feroxbuster Fuzzing",
    category: "directory",
    description: "Fast, recursive content discovery tool written in Rust.",
    commandTemplate: (t) => `feroxbuster -u https://${t} -w wordlist.txt -t 50 --extract-links --json -o ferox_results.json`
  },
  {
    id: "kiterunner",
    name: "Kiterunner API Scan",
    category: "directory",
    description: "Fast API endpoint finder.",
    commandTemplate: (t) => `kr scan https://${t} -w routes-large.kite -x 20 -j output.json`
  },
  {
    id: "ssrf-nuclei",
    name: "SSRF Nuclei Scan",
    category: "advanced",
    description: "Scan for SSRF vulnerabilities using Nuclei templates.",
    commandTemplate: (t) => `cat urls.txt | nuclei -t vulnerabilities/ssrf -o ssrf.txt`
  },
  {
    id: "tplmap",
    name: "SSTI Scan (Tplmap)",
    category: "advanced",
    description: "Automated Server-Side Template Injection detection.",
    commandTemplate: (t) => `python2 tplmap.py -u "https://${t}/page?name=John" --os-shell`
  },
  {
    id: "trufflehog",
    name: "TruffleHog Secrets",
    category: "sensitive",
    description: "Deep scan of git history for secrets.",
    commandTemplate: (t) => `trufflehog git https://${t}.git --json > secret_findings.json`
  },

  // --- Google Dorks ---
  // Broad Reconnaissance
  {
    id: "dork-subdomains",
    name: "Subdomains",
    category: "dork_recon",
    description: "Find subdomains indexed by Google.",
    commandTemplate: (t) => `site:*.${t} -www`
  },
  {
    id: "dork-sub-subdomains",
    name: "Sub-subdomains",
    category: "dork_recon",
    description: "Find deeper level subdomains.",
    commandTemplate: (t) => `site:*.*.${t} -www`
  },
  {
    id: "dork-dir-listing",
    name: "Directory Listing",
    category: "dork_recon",
    description: "Find exposed directory listings.",
    commandTemplate: (t) => `site:${t} intitle:index.of`
  },
  {
    id: "dork-docs",
    name: "Exposed Documents",
    category: "dork_recon",
    description: "Find publicly exposed documents (PDF, DOC, etc).",
    commandTemplate: (t) => `site:${t} ext:doc | ext:docx | ext:odt | ext:pdf | ext:rtf | ext:sxw | ext:psw | ext:ppt | ext:pptx | ext:pps | ext:csv`
  },
  {
    id: "dork-pastebin",
    name: "Pastebin Leaks",
    category: "dork_recon",
    description: "Search Pastebin for target mentions.",
    commandTemplate: (t) => `site:pastebin.com ${t}`
  },
  {
    id: "dork-github",
    name: "Github Leaks",
    category: "dork_recon",
    description: "Search GitHub/GitLab for target mentions.",
    commandTemplate: (t) => `site:github.com | site:gitlab.com ${t}`
  },
  {
    id: "dork-stackoverflow",
    name: "StackOverflow",
    category: "dork_recon",
    description: "Search StackOverflow for developer discussions.",
    commandTemplate: (t) => `site:stackoverflow.com ${t}`
  },

  // Sensitive Files
  {
    id: "dork-config",
    name: "Config Files",
    category: "dork_files",
    description: "Find exposed configuration files.",
    commandTemplate: (t) => `site:${t} ext:xml | ext:conf | ext:cnf | ext:reg | ext:inf | ext:rdp | ext:cfg | ext:txt | ext:ora | ext:ini`
  },
  {
    id: "dork-db",
    name: "Database Files",
    category: "dork_files",
    description: "Find exposed database files.",
    commandTemplate: (t) => `site:${t} ext:sql | ext:dbf | ext:mdb`
  },
  {
    id: "dork-backup",
    name: "Backup Files",
    category: "dork_files",
    description: "Find exposed backup files.",
    commandTemplate: (t) => `site:${t} ext:bkf | ext:bkp | ext:bak | ext:old | ext:backup`
  },
  {
    id: "dork-log",
    name: "Log Files",
    category: "dork_files",
    description: "Find exposed log files.",
    commandTemplate: (t) => `site:${t} ext:log`
  },
  {
    id: "dork-env",
    name: "Env Files",
    category: "dork_files",
    description: "Find exposed .env files.",
    commandTemplate: (t) => `site:${t} ext:env | ext:env.example | ext:env.bak`
  },
  {
    id: "dork-git",
    name: "Git Folders",
    category: "dork_files",
    description: "Find exposed .git directories.",
    commandTemplate: (t) => `site:${t} inurl:/.git`
  },

  // Login & Portals
  {
    id: "dork-login",
    name: "Login Pages",
    category: "dork_login",
    description: "Find login pages.",
    commandTemplate: (t) => `site:${t} inurl:login | inurl:signin | intitle:Login | intitle:"sign in" | inurl:auth`
  },
  {
    id: "dork-admin",
    name: "Admin Panels",
    category: "dork_login",
    description: "Find admin panels.",
    commandTemplate: (t) => `site:${t} inurl:admin | inurl:administrator | intitle:Admin | intitle:"dashboard"`
  },
  {
    id: "dork-signup",
    name: "Signup Pages",
    category: "dork_login",
    description: "Find signup/registration pages.",
    commandTemplate: (t) => `site:${t} inurl:signup | inurl:register | intitle:Signup`
  },
  {
    id: "dork-portal",
    name: "Portal Pages",
    category: "dork_login",
    description: "Find portals and dashboards.",
    commandTemplate: (t) => `site:${t} inurl:portal | inurl:dashboard | intitle:Dashboard`
  },
  {
    id: "dork-vpn",
    name: "VPN/Citrix",
    category: "dork_login",
    description: "Find VPN or Citrix endpoints.",
    commandTemplate: (t) => `site:${t} inurl:vpn | inurl:citrix | inurl:remote`
  },

  // Cloud Infrastructure
  {
    id: "dork-s3",
    name: "S3 Buckets",
    category: "dork_cloud",
    description: "Find S3 buckets related to target.",
    commandTemplate: (t) => `site:s3.amazonaws.com ${t}`
  },
  {
    id: "dork-azure",
    name: "Azure Blobs",
    category: "dork_cloud",
    description: "Find Azure blobs related to target.",
    commandTemplate: (t) => `site:blob.core.windows.net ${t}`
  },
  {
    id: "dork-gcp",
    name: "Google Storage",
    category: "dork_cloud",
    description: "Find Google Storage buckets.",
    commandTemplate: (t) => `site:googleapis.com ${t}`
  },
  {
    id: "dork-digitalocean",
    name: "DigitalOcean Spaces",
    category: "dork_cloud",
    description: "Find DigitalOcean Spaces.",
    commandTemplate: (t) => `site:digitaloceanspaces.com ${t}`
  },
  {
    id: "dork-firebase",
    name: "Firebase",
    category: "dork_cloud",
    description: "Find Firebase instances.",
    commandTemplate: (t) => `site:firebaseio.com ${t}`
  },

  // Potential Vulnerabilities
  {
    id: "dork-sqli",
    name: "SQL Injection",
    category: "dork_vuln",
    description: "Find parameters potentially vulnerable to SQLi.",
    commandTemplate: (t) => `site:${t} inurl:id= | inurl:pid= | inurl:category= | inurl:cat= | inurl:action= | inurl:sid= | inurl:dir=`
  },
  {
    id: "dork-redirect",
    name: "Open Redirects",
    category: "dork_vuln",
    description: "Find parameters potentially vulnerable to Open Redirect.",
    commandTemplate: (t) => `site:${t} inurl:http | inurl:url= | inurl:path= | inurl:dest= | inurl:html= | inurl:data= | inurl:domain= | inurl:page=`
  },
  {
    id: "dork-lfi",
    name: "LFI / RFI",
    category: "dork_vuln",
    description: "Find parameters potentially vulnerable to LFI/RFI.",
    commandTemplate: (t) => `site:${t} inurl:include= | inurl:file= | inurl:folder= | inurl:inc= | inurl:locate= | inurl:conf= | inurl:env=`
  },
  {
    id: "dork-xss",
    name: "XSS Prone",
    category: "dork_vuln",
    description: "Find parameters potentially vulnerable to XSS.",
    commandTemplate: (t) => `site:${t} inurl:q= | inurl:s= | inurl:search= | inurl:query= | inurl:keyword= | inurl:lang=`
  },
  {
    id: "dork-php",
    name: "PHP Errors",
    category: "dork_vuln",
    description: "Find exposed PHP errors.",
    commandTemplate: (t) => `site:${t} "PHP Parse error" | "PHP Warning" | "PHP Error"`
  },

  // Technology Specific
  {
    id: "dork-wp",
    name: "WordPress",
    category: "dork_tech",
    description: "Find WordPress specific paths.",
    commandTemplate: (t) => `site:${t} inurl:wp-content | inurl:wp-includes`
  },
  {
    id: "dork-jira",
    name: "Jira / Atlassian",
    category: "dork_tech",
    description: "Find Jira/Atlassian instances.",
    commandTemplate: (t) => `site:atlassian.net ${t}`
  },
  {
    id: "dork-trello",
    name: "Trello Boards",
    category: "dork_tech",
    description: "Find public Trello boards.",
    commandTemplate: (t) => `site:trello.com ${t}`
  },
  {
    id: "dork-jenkins",
    name: "Jenkins",
    category: "dork_tech",
    description: "Find Jenkins dashboards.",
    commandTemplate: (t) => `site:${t} intitle:"Dashboard [Jenkins]"`
  },
  {
    id: "dork-struts",
    name: "Apache Struts",
    category: "dork_tech",
    description: "Find Apache Struts endpoints.",
    commandTemplate: (t) => `site:${t} ext:action | ext:struts | ext:do`
  },
];

export const toolLibrary: ResourceTool[] = [
  // Web Security
  { name: "Burp Suite", description: "The class-leading vulnerability scanning, penetration testing, and web app security platform.", link: "https://portswigger.net/burp", category: "Web Security", tags: ["Proxy", "Scanner", "GUI"] },
  { name: "OWASP ZAP", description: "The world's most widely used web app scanner. Free and open source.", link: "https://www.zaproxy.org/", category: "Web Security", tags: ["Proxy", "Scanner", "GUI"] },
  { name: "Caido", description: "A lightweight web security auditing toolkit for the modern web.", link: "https://caido.io/", category: "Web Security", tags: ["Proxy", "Modern"] },
  { name: "SQLmap", description: "Automatic SQL injection and database takeover tool.", link: "https://github.com/sqlmapproject/sqlmap", category: "Web Security", tags: ["SQLi", "Database", "CLI"] },
  { name: "WPscan", description: "WordPress vulnerability scanner.", link: "https://github.com/wpscanteam/wpscan", category: "Web Security", tags: ["CMS", "WordPress", "CLI"] },
  { name: "FFuF", description: "Fast and efficient web fuzzer written in Go.", link: "https://github.com/ffuf/ffuf", category: "Web Security", tags: ["Fuzzer", "Discovery", "CLI"] },
  { name: "Dalfox", description: "Parameter analysis and XSS scanning tool.", link: "https://github.com/hahwul/dalfox", category: "Web Security", tags: ["XSS", "Scanner", "CLI"] },
  { name: "Commix", description: "Automated command injection exploiter.", link: "https://github.com/commixproject/commix", category: "Web Security", tags: ["Injection", "Exploit", "CLI"] },
  { name: "Nikto", description: "Web server scanner.", link: "https://github.com/sullo/nikto", category: "Web Security", tags: ["Scanner", "Server", "CLI"] },
  { name: "Wappalyzer", description: "Identify technologies on websites.", link: "https://www.wappalyzer.com/", category: "Web Security", tags: ["Fingerprinting", "Extension"] },
  { name: "WhatWeb", description: "Next generation web scanner.", link: "https://github.com/urbanadventurer/WhatWeb", category: "Web Security", tags: ["Fingerprinting", "CLI"] },
  { name: "XSStrike", description: "Advanced XSS detection suite.", link: "https://github.com/s0md3v/XSStrike", category: "Web Security", tags: ["XSS", "Fuzzer", "CLI"] },
  { name: "Nuclei", description: "Fast and customizable vulnerability scanner based on templates.", link: "https://github.com/projectdiscovery/nuclei", category: "Web Security", tags: ["Scanner", "Templates", "CLI"] },
  { name: "Arjun", description: "HTTP parameter discovery suite.", link: "https://github.com/s0md3v/Arjun", category: "Web Security", tags: ["Parameters", "Discovery", "CLI"] },
  { name: "ParamSpider", description: "Mining parameters from Dark Web archives.", link: "https://github.com/devanshbatham/ParamSpider", category: "Web Security", tags: ["Parameters", "Archives", "CLI"] },

  // Reconnaissance & OSINT
  { name: "Subfinder", description: "Fast passive subdomain discovery tool.", link: "https://github.com/projectdiscovery/subfinder", category: "Reconnaissance", tags: ["Subdomains", "Passive", "CLI"] },
  { name: "Amass", description: "In-depth subdomain enumeration and OSINT.", link: "https://github.com/owasp-amass/amass", category: "Reconnaissance", tags: ["Subdomains", "OSINT", "CLI"] },
  { name: "Httpx", description: "Multi-purpose HTTP toolkit for probing.", link: "https://github.com/projectdiscovery/httpx", category: "Reconnaissance", tags: ["Probing", "HTTP", "CLI"] },
  { name: "Katana", description: "Next-generation crawling and spidering framework.", link: "https://github.com/projectdiscovery/katana", category: "Reconnaissance", tags: ["Crawler", "Spider", "CLI"] },
  { name: "Waybackurls", description: "Fetch URLs from the Wayback Machine.", link: "https://github.com/tomnomnom/waybackurls", category: "Reconnaissance", tags: ["Archives", "URLs", "CLI"] },
  { name: "Gau", description: "Fetch known URLs from AlienVault, Wayback, etc.", link: "https://github.com/lc/gau", category: "Reconnaissance", tags: ["Archives", "URLs", "CLI"] },
  { name: "Shodan", description: "Search engine for Internet-connected devices.", link: "https://www.shodan.io/", category: "Reconnaissance", tags: ["IoT", "Search Engine"] },
  { name: "Censys", description: "Search engine for finding devices and networks.", link: "https://censys.io/", category: "Reconnaissance", tags: ["Search Engine", "Network"] },
  { name: "Maltego", description: "Interactive data mining tool that renders directed graphs for link analysis.", link: "https://www.maltego.com/", category: "Reconnaissance", tags: ["OSINT", "Graph", "GUI"] },
  { name: "SpiderFoot", description: "OSINT automation tool.", link: "https://www.spiderfoot.net/", category: "Reconnaissance", tags: ["OSINT", "Automation"] },
  { name: "theHarvester", description: "E-mail, subdomain and people harvesting tool.", link: "https://github.com/laramies/theHarvester", category: "Reconnaissance", tags: ["OSINT", "Harvesting", "CLI"] },
  { name: "Assetfinder", description: "Find domains and subdomains related to a given domain.", link: "https://github.com/tomnomnom/assetfinder", category: "Reconnaissance", tags: ["Subdomains", "Discovery", "CLI"] },
  { name: "Sublist3r", description: "Fast subdomains enumeration tool for penetration testers.", link: "https://github.com/aboul3la/Sublist3r", category: "Reconnaissance", tags: ["Subdomains", "Python", "CLI"] },
  { name: "Recon-ng", description: "Full-featured Web Reconnaissance framework written in Python.", link: "https://github.com/lanmaster53/recon-ng", category: "Reconnaissance", tags: ["Framework", "OSINT", "CLI"] },

  // Network Security
  { name: "Nmap", description: "Network exploration and security auditing.", link: "https://nmap.org/", category: "Network Security", tags: ["Scanner", "Port", "CLI"] },
  { name: "Masscan", description: "Internet-scale port scanner.", link: "https://github.com/robertdavidgraham/masscan", category: "Network Security", tags: ["Scanner", "Fast", "CLI"] },
  { name: "Naabu", description: "Fast port scanner written in Go.", link: "https://github.com/projectdiscovery/naabu", category: "Network Security", tags: ["Scanner", "Go", "CLI"] },
  { name: "Wireshark", description: "The world's foremost network protocol analyzer.", link: "https://www.wireshark.org/", category: "Network Security", tags: ["Analyzer", "Packet", "GUI"] },
  { name: "Bettercap", description: "The Swiss Army knife for 802.11, BLE, IPv4 and IPv6 networks reconnaissance and MITM.", link: "https://www.bettercap.org/", category: "Network Security", tags: ["MITM", "Network", "CLI"] },
  { name: "Responder", description: "LLMNR/NBT-NS/mDNS Poisoner and NTLMv1/2 Relay.", link: "https://github.com/lgandx/Responder", category: "Network Security", tags: ["Poisoning", "Active Directory"] },
  { name: "Aircrack-ng", description: "Complete suite of tools to assess WiFi network security.", link: "https://www.aircrack-ng.org/", category: "Network Security", tags: ["WiFi", "Wireless", "CLI"] },
  { name: "Kismet", description: "Wireless network detector, sniffer, and intrusion detection system.", link: "https://www.kismetwireless.net/", category: "Network Security", tags: ["WiFi", "Sniffer", "GUI"] },

  // Cloud Security
  { name: "ScoutSuite", description: "Multi-cloud security-auditing tool.", link: "https://github.com/nccgroup/ScoutSuite", category: "Cloud Security", tags: ["Audit", "AWS", "Azure", "GCP"] },
  { name: "Prowler", description: "Security tool for AWS, Azure, and GCP to perform security assessments.", link: "https://github.com/prowler-cloud/prowler", category: "Cloud Security", tags: ["Audit", "Compliance"] },
  { name: "CloudSploit", description: "Cloud security posture management (CSPM).", link: "https://github.com/aquasecurity/cloudsploit", category: "Cloud Security", tags: ["CSPM", "Audit"] },
  { name: "Pacu", description: "The AWS exploitation framework.", link: "https://github.com/RhinoSecurityLabs/pacu", category: "Cloud Security", tags: ["Exploitation", "AWS"] },
  { name: "CloudMapper", description: "Analyze your Amazon Web Services (AWS) environments.", link: "https://github.com/duo-labs/cloudmapper", category: "Cloud Security", tags: ["AWS", "Visualization"] },

  // Mobile Security
  { name: "MobSF", description: "Mobile Security Framework (MobSF) is an automated, all-in-one mobile application (Android/iOS/Windows) pen-testing framework.", link: "https://github.com/MobSF/Mobile-Security-Framework-MobSF", category: "Mobile Security", tags: ["Static Analysis", "Dynamic Analysis"] },
  { name: "Frida", description: "Dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers.", link: "https://frida.re/", category: "Mobile Security", tags: ["Instrumentation", "Hooking"] },
  { name: "Objection", description: "A runtime mobile exploration toolkit, powered by Frida.", link: "https://github.com/sensepost/objection", category: "Mobile Security", tags: ["Exploration", "Frida"] },
  { name: "APKTool", description: "A tool for reverse engineering 3rd party, closed, binary Android apps.", link: "https://ibotpeaches.github.io/Apktool/", category: "Mobile Security", tags: ["Reverse Engineering", "Android"] },
  { name: "Qark", description: "Tool to look for several security related Android application vulnerabilities.", link: "https://github.com/linkedin/qark", category: "Mobile Security", tags: ["Android", "Scanner"] },

  // Exploitation & Post-Exploitation
  { name: "Metasploit", description: "The world's most used penetration testing framework.", link: "https://www.metasploit.com/", category: "Exploitation", tags: ["Framework", "Exploit"] },
  { name: "Searchsploit", description: "Command line search tool for Exploit-DB.", link: "https://www.exploit-db.com/searchsploit", category: "Exploitation", tags: ["Database", "Search"] },
  { name: "Hydra", description: "Parallelized login cracker which supports numerous protocols to attack.", link: "https://github.com/vanhauser-thc/thc-hydra", category: "Exploitation", tags: ["Brute Force", "Cracker"] },
  { name: "John the Ripper", description: "Fast password cracker.", link: "https://www.openwall.com/john/", category: "Exploitation", tags: ["Cracker", "Hash"] },
  { name: "Hashcat", description: "World's fastest and most advanced password recovery utility.", link: "https://hashcat.net/hashcat/", category: "Exploitation", tags: ["Cracker", "GPU"] },
  { name: "Mimikatz", description: "A little tool to play with Windows security.", link: "https://github.com/gentilkiwi/mimikatz", category: "Exploitation", tags: ["Windows", "Credentials"] },
  { name: "BloodHound", description: "Six Degrees of Domain Admin.", link: "https://github.com/BloodHoundAD/BloodHound", category: "Exploitation", tags: ["Active Directory", "Graph"] },
  { name: "BeEF", description: "The Browser Exploitation Framework.", link: "https://beefproject.com/", category: "Exploitation", tags: ["Browser", "Framework"] },
  { name: "SET", description: "Social-Engineer Toolkit.", link: "https://github.com/trustedsec/social-engineer-toolkit", category: "Exploitation", tags: ["Social Engineering", "Framework"] },

  // Utilities & Wordlists
  { name: "SecLists", description: "SecLists is the security tester's companion. It's a collection of multiple types of lists used during security assessments.", link: "https://github.com/danielmiessler/SecLists", category: "Utilities", tags: ["Wordlists", "Payloads"] },
  { name: "CyberChef", description: "The Cyber Swiss Army Knife - a web app for encryption, encoding, compression and data analysis.", link: "https://gchq.github.io/CyberChef/", category: "Utilities", tags: ["Decoding", "Analysis", "Web"] },
  { name: "Gf", description: "Wrapper around grep to avoid typing common patterns.", link: "https://github.com/tomnomnom/gf", category: "Utilities", tags: ["Grep", "Patterns"] },
  { name: "TruffleHog", description: "Find credentials all over the place.", link: "https://github.com/trufflesecurity/trufflehog", category: "Utilities", tags: ["Secrets", "Scanner"] },
  { name: "Gitleaks", description: "Protect and discover secrets using Gitleaks.", link: "https://github.com/gitleaks/gitleaks", category: "Utilities", tags: ["Secrets", "Git"] },
  { name: "Binwalk", description: "Firmware Analysis Tool.", link: "https://github.com/ReFirmLabs/binwalk", category: "Utilities", tags: ["Firmware", "Analysis"] },
  { name: "Unfurl", description: "Pull out bits of URLs provided on stdin.", link: "https://github.com/tomnomnom/unfurl", category: "Utilities", tags: ["URL", "Parsing"] },

  // More Reconnaissance
  { name: "massdns", description: "A high-performance DNS stub resolver for bulk lookups and reconnaissance.", link: "https://github.com/blechschmidt/massdns", category: "Reconnaissance", tags: ["DNS", "Resolver", "CLI"] },
  { name: "Findomain", description: "The fastest and cross-platform subdomain enumerator.", link: "https://github.com/Findomain/Findomain", category: "Reconnaissance", tags: ["Subdomains", "Fast", "CLI"] },
  { name: "dnsx", description: "Fast and multi-purpose DNS toolkit allow to run multiple DNS queries.", link: "https://github.com/projectdiscovery/dnsx", category: "Reconnaissance", tags: ["DNS", "Toolkit", "CLI"] },
  { name: "EyeWitness", description: "Take screenshots of websites, provide some server header info, and identify default credentials.", link: "https://github.com/FortyNorthSecurity/EyeWitness", category: "Reconnaissance", tags: ["Screenshots", "Reporting", "CLI"] },
  { name: "aquatone", description: "Visual inspection of websites across a large amount of hosts.", link: "https://github.com/michenriksen/aquatone", category: "Reconnaissance", tags: ["Screenshots", "Visual", "CLI"] },
  { name: "gowitness", description: "Golang web screenshot utility using Chrome Headless.", link: "https://github.com/sensepost/gowitness", category: "Reconnaissance", tags: ["Screenshots", "Go", "CLI"] },

  // More Web Security
  { name: "Gobuster", description: "Directory/File, DNS and VHost busting tool written in Go.", link: "https://github.com/OJ/gobuster", category: "Web Security", tags: ["Fuzzer", "Directory", "CLI"] },
  { name: "Feroxbuster", description: "A fast, simple, recursive content discovery tool written in Rust.", link: "https://github.com/epi052/feroxbuster", category: "Web Security", tags: ["Fuzzer", "Rust", "CLI"] },
  { name: "Dirsearch", description: "Web path scanner.", link: "https://github.com/maurosoria/dirsearch", category: "Web Security", tags: ["Scanner", "Directory", "CLI"] },
  { name: "Gospider", description: "Fast web spider written in Go.", link: "https://github.com/jaeles-project/gospider", category: "Web Security", tags: ["Spider", "Crawler", "CLI"] },
  { name: "Kiterunner", description: "Fast API endpoint bruteforcer and content discovery tool.", link: "https://github.com/assetnote/kiterunner", category: "Web Security", tags: ["API", "Bruteforce", "CLI"] },
  { name: "LinkFinder", description: "A python script that finds endpoints in JavaScript files.", link: "https://github.com/GerbenJavado/LinkFinder", category: "Web Security", tags: ["JS", "Endpoints", "CLI"] },
  { name: "Parameth", description: "Brute discover GET and POST parameters.", link: "https://github.com/maK-/parameth", category: "Web Security", tags: ["Parameters", "Bruteforce", "CLI"] },
  { name: "Wfuzz", description: "Web application fuzzer.", link: "https://github.com/xmendez/wfuzz", category: "Web Security", tags: ["Fuzzer", "Web", "CLI"] },
  { name: "Corsy", description: "CORS Misconfiguration Scanner.", link: "https://github.com/s0md3v/Corsy", category: "Web Security", tags: ["CORS", "Scanner", "CLI"] },
  { name: "XSRFProbe", description: "The Prime Cross Site Request Forgery (CSRF) Audit and Exploitation Toolkit.", link: "https://github.com/0xInfection/XSRFProbe", category: "Web Security", tags: ["CSRF", "Audit", "CLI"] },
  { name: "DotDotPwn", description: "The Directory Traversal Fuzzer.", link: "https://github.com/wireghoul/dotdotpwn", category: "Web Security", tags: ["Traversal", "Fuzzer", "CLI"] },
  { name: "LFISuite", description: "Totally Automatic LFI Exploiter (+ Reverse Shell) and Scanner.", link: "https://github.com/D35m0nd142/LFISuite", category: "Web Security", tags: ["LFI", "Exploit", "CLI"] },
  { name: "InQL", description: "A Burp Extension for GraphQL Security Testing.", link: "https://github.com/doyensec/inql", category: "Web Security", tags: ["GraphQL", "Burp", "Extension"] },
  { name: "SSRFmap", description: "Automatic SSRF fuzzer and exploitation tool.", link: "https://github.com/swisskyrepo/SSRFmap", category: "Web Security", tags: ["SSRF", "Fuzzer", "CLI"] },
  { name: "Gopherus", description: "Generates gopher link for exploiting SSRF and gaining RCE.", link: "https://github.com/tarunkant/Gopherus", category: "Web Security", tags: ["SSRF", "Payloads", "CLI"] },
  { name: "Tplmap", description: "Server-Side Template Injection and Code Injection Detection and Exploitation Tool.", link: "https://github.com/epinna/tplmap", category: "Web Security", tags: ["SSTI", "Injection", "CLI"] },
  { name: "Jaeles", description: "The Swiss Army knife for automated Web Application Testing.", link: "https://github.com/jaeles-project/jaeles", category: "Web Security", tags: ["Automation", "Scanner", "CLI"] },

  // More Exploitation
  { name: "Ysoserial", description: "A proof-of-concept tool for generating payloads that exploit unsafe Java object deserialization.", link: "https://github.com/frohoff/ysoserial", category: "Exploitation", tags: ["Deserialization", "Java", "CLI"] },
  { name: "Autorize", description: "Automatic authorization enforcement detection extension for burp suite.", link: "https://github.com/Quitten/Autorize", category: "Exploitation", tags: ["IDOR", "Burp", "Extension"] },
  { name: "Oralyzer", description: "Open Redirection Analyzer.", link: "https://github.com/r0075h3ll/Oralyzer", category: "Exploitation", tags: ["Redirect", "Analyzer", "CLI"] },
  { name: "NoSQLMap", description: "Automated NoSQL database enumeration and web application exploitation tool.", link: "https://github.com/codingo/NoSQLMap", category: "Exploitation", tags: ["NoSQL", "Injection", "CLI"] },
  { name: "XXEinjector", description: "Tool for automatic exploitation of XXE vulnerability.", link: "https://github.com/enjoiz/XXEinjector", category: "Exploitation", tags: ["XXE", "Exploit", "CLI"] },
  { name: "Subjack", description: "Subdomain Takeover tool written in Go.", link: "https://github.com/haccer/subjack", category: "Exploitation", tags: ["Takeover", "Subdomains", "CLI"] },

  // More Utilities
  { name: "Anew", description: "A tool for adding new lines to files, skipping duplicates.", link: "https://github.com/tomnomnom/anew", category: "Utilities", tags: ["Text", "Processing", "CLI"] },
  { name: "Uro", description: "Declutters url lists for crawling/pentesting.", link: "https://github.com/s0md3v/uro", category: "Utilities", tags: ["URL", "Cleaning", "CLI"] },
  { name: "Qsreplace", description: "Accept URLs on stdin, replace all query string values with a user-supplied value.", link: "https://github.com/tomnomnom/qsreplace", category: "Utilities", tags: ["URL", "Fuzzing", "CLI"] },
  { name: "Git-secrets", description: "Prevents you from committing secrets and credentials into git repositories.", link: "https://github.com/awslabs/git-secrets", category: "Utilities", tags: ["Git", "Secrets", "CLI"] },

  // More Cloud Security
  { name: "S3Scanner", description: "Scan for open AWS S3 buckets and dump the contents.", link: "https://github.com/sa7mon/S3Scanner", category: "Cloud Security", tags: ["AWS", "S3", "CLI"] },
  { name: "AWSBucketDump", description: "Security Tool to Look For Interesting Files in S3 Buckets.", link: "https://github.com/jordanpotti/AWSBucketDump", category: "Cloud Security", tags: ["AWS", "S3", "CLI"] },
];

export const extensions: Extension[] = [
  {
    name: "Wappalyzer",
    description: "Identify technologies, CMS, and frameworks.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/",
    chromeLink: "https://chromewebstore.google.com/detail/wappalyzer-technology-pro/gppongmhjkpfnbhagpmjfkannfbllamg",
    category: "Web Analysis",
    tags: ["Fingerprinting", "Tech"]
  },
  {
    name: "FoxyProxy",
    description: "Proxy management for Burp Suite.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/",
    chromeLink: "https://chromewebstore.google.com/detail/foxyproxy/gcknhkkoolaabfmlnjonogaaifnjlfnp",
    category: "Proxy & Network",
    tags: ["Proxy", "Management"]
  },
  {
    name: "Cookie Editor",
    description: "Manage cookies and security flags.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/",
    chromeLink: "https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm",
    category: "Utilities",
    tags: ["Cookies", "Session"]
  },
  {
    name: "HackTools",
    description: "Payloads and tools for pentesting.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/hacktools/",
    chromeLink: "https://chromewebstore.google.com/detail/hack-tools/cmbndhnoonmghfofefkcccljbkdpamhi",
    category: "Utilities",
    tags: ["Payloads", "Pentesting"]
  },
  {
    name: "DotGit",
    description: "Find exposed .git repositories.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/dotgit/",
    chromeLink: "https://chromewebstore.google.com/detail/dotgit/pampamgoihgcedonnphgehgondkhikel",
    category: "Reconnaissance",
    tags: ["Git", "Exposure"]
  },
  {
    name: "uBlock Origin",
    description: "Block ads and trackers for clean testing.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/",
    chromeLink: "https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm",
    category: "Utilities",
    tags: ["Blocker", "Privacy"]
  },
  {
    name: "Retire.js",
    description: "Identify vulnerable JS libraries.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/retire-js/",
    chromeLink: "https://chromewebstore.google.com/detail/retire-js/moibopkbhjceeedibkbkbchbjnkadmom",
    category: "Web Analysis",
    tags: ["Vulnerability", "Scanner"]
  },
  {
    name: "Shodan",
    description: "View hosting details and open ports.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/shodan-addon/",
    chromeLink: "https://chromewebstore.google.com/detail/shodan/jjalcfnidlmpjhdfepjhjbhnhkbgleap",
    category: "Reconnaissance",
    tags: ["OSINT", "Search"]
  },
  {
    name: "HackBar",
    description: "A toolbar for pentesting (SQLi, XSS, etc).",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/hackbar-quantum/",
    chromeLink: "https://chromewebstore.google.com/detail/hackbar/ginpbkfigcoaownonjdoghnkilgbbjhb",
    category: "Pentesting",
    tags: ["Payloads", "Manual"]
  },
  {
    name: "Penetration Testing Kit",
    description: "Web penetration testing toolkit.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/penetration-testing-kit/",
    chromeLink: "https://chromewebstore.google.com/detail/penetration-testing-kit/ojkchikaholjmcnefhjlbohackpeeknd",
    category: "Pentesting",
    tags: ["Toolkit", "Scanner"]
  },
  {
    name: "ModHeader",
    description: "Modify HTTP headers.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/modheader-firefox/",
    chromeLink: "https://chromewebstore.google.com/detail/modheader-modify-http-hea/idgpnmonknjnojddfkpgkljpfnnfcklj",
    category: "Utilities",
    tags: ["Headers", "Manipulation"]
  },
  {
    name: "User-Agent Switcher",
    description: "Switch User-Agent strings.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/user-agent-string-switcher/",
    chromeLink: "https://chromewebstore.google.com/detail/user-agent-switcher-and-m/bhchdcejhohfmigjafbampogmaanbfkg",
    category: "Utilities",
    tags: ["User-Agent", "Spoofing"]
  },
  {
    name: "Tampermonkey",
    description: "The world's most popular userscript manager.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/",
    chromeLink: "https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo",
    category: "Utilities",
    tags: ["Scripts", "Automation"]
  },
  {
    name: "Link Redirect Trace",
    description: "Analyze HTTP redirect paths.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/link-redirect-trace-addon/",
    chromeLink: "https://chromewebstore.google.com/detail/link-redirect-trace/nnpljppamoaalgkieeciijbcccohlpoh",
    category: "Web Analysis",
    tags: ["Redirects", "Analysis"]
  },
  {
    name: "WhatRuns",
    description: "Discover what runs a website.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/whatruns/",
    chromeLink: "https://chromewebstore.google.com/detail/whatruns/cmkdbmfndkfgebldhnkbfhlneefdaaip",
    category: "Web Analysis",
    tags: ["Fingerprinting", "Tech"]
  },
  {
    name: "BuiltWith",
    description: "Web technology profiler.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/builtwith/",
    chromeLink: "https://chromewebstore.google.com/detail/builtwith-technology-prof/dapjbgnjinbpoindlpdmhochffioedbn",
    category: "Web Analysis",
    tags: ["Fingerprinting", "Tech"]
  },
  {
    name: "PwnFox",
    description: "Firefox extension for multi-container pentesting.",
    firefoxLink: "https://addons.mozilla.org/en-US/firefox/addon/pwnfox/",
    chromeLink: "", // PwnFox is Firefox only usually, but I'll leave empty or put a placeholder if needed..
    category: "Pentesting",
    tags: ["Containers", "Firefox"]
  },
];

export const writeups: Writeup[] = [
  {
    title: "Securing AI Agents with Information Flow Control (Part II)",
    subtitle: "Inside the Planner: How Decisions, Memory, and Labels Can Shape Agent Behavior",
    link: "https://medium.com/bugbountywriteup/securing-ai-agents-with-information-flow-control-part-ii-d857e8937253",
    category: "AI Security",
    platform: "Ofir Yakovian",
    date: "Dec 9",
    readTime: "5 min"
  },
  {
    title: "HTB — EscapeTwo Writeup: Active Directory Attacks in Windows Environment",
    subtitle: "As a cybersecurity enthusiast and red teamer in training, I’ve always found the complexity of Active Directory (AD) environments both…",
    link: "https://medium.com/bugbountywriteup/htb-escapetwo-writeup-active-directory-attacks-in-windows-environment-d4ee339cb11a",
    category: "Active Directory",
    platform: "Aashraymt",
    date: "Jun 3",
    readTime: "10 min"
  },
  {
    title: "Hack The Box: Legacy Machine Writeup",
    subtitle: "Hack The Box: Legacy Machine Writeup",
    link: "https://medium.com/bugbountywriteup/hack-the-box-legacy-machine-writeup-166c93666fd2",
    category: "CTF & Walkthroughs",
    platform: "CyberQuestor",
    date: "Apr 18",
    readTime: "5 min"
  },
  {
    title: "🎯 One “Harmless” Parameter, Full Account Takeover — My Favorite Bug Bounty Find",
    subtitle: "Hey there!😁",
    link: "https://medium.com/bugbountywriteup/one-harmless-parameter-full-account-takeover-my-favorite-bug-bounty-find-1e4c9cf7c17d",
    category: "Web Security",
    platform: "Iski",
    date: "Dec 14",
    readTime: "5 min"
  },
  {
    title: "Buried in JavaScript: How One Comment Led Me to a Production API Key 💻🔑",
    subtitle: "Free Link 🎈",
    link: "https://medium.com/bugbountywriteup/buried-in-javascript-how-one-comment-led-me-to-a-production-api-key-65a33b1644bb",
    category: "Recon & OSINT",
    platform: "Iski",
    date: "Dec 13",
    readTime: "3 min"
  },
  {
    title: "Strutted Walkthrough — HTB",
    subtitle: "Strutted is an medium-difficulty Linux machine featuring a website for a company offering image hosting solutions.",
    link: "https://medium.com/bugbountywriteup/strutted-walkthrough-htb-69a002ba3488",
    category: "CTF & Walkthroughs",
    platform: "Aashraymt",
    date: "Jul 31",
    readTime: "8 min"
  },
  {
    title: "HTB — CAP Writeup",
    subtitle: "Hey there, and welcome to my blog! This space is where I share my journey through the world of ethical hacking.",
    link: "https://medium.com/bugbountywriteup/cap-htb-writeup-7e3ff9092b81",
    category: "CTF & Walkthroughs",
    platform: "Aashraymt",
    date: "Oct 17",
    readTime: "6 min"
  },
  {
    title: "HTB — Artificial Writeup: TensorFlow to Root",
    subtitle: "A full walkthrough of the Artificial HTB machine featuring TensorFlow RCE, database extraction, SSH pivoting, and Backrest abuse for root.",
    link: "https://medium.com/bugbountywriteup/htb-artificial-writeup-tensorflow-to-root-50ce32c56ae2",
    category: "AI Security",
    platform: "Aashraymt",
    date: "Nov 17",
    readTime: "12 min"
  },
  {
    title: "My OSCP+ Journey — Part 2: Success After Struggle, How I Cracked the OSCP+",
    subtitle: "Hey everyone, In Part 1 of my OSCP+ journey, I shared how my first attempt ended in failure...",
    link: "https://medium.com/bugbountywriteup/my-oscp-journey-part-2-success-after-struggle-how-i-cracked-the-oscp-cffa09914051",
    category: "Career & Certs",
    platform: "CyberQuestor",
    date: "Dec 3",
    readTime: "15 min"
  },
  {
    title: "My OSCP+ Journey — Part 1: Failure That Taught Me More Than Success",
    subtitle: "Hello everyone, this is the beginning of a very personal story...",
    link: "https://medium.com/bugbountywriteup/my-oscp-journey-part-1-failure-that-taught-me-more-than-success-09870c31e54d",
    category: "Career & Certs",
    platform: "CyberQuestor",
    date: "Dec 1",
    readTime: "10 min"
  },
  {
    title: "How I found IDOR in College’s Third-Party ERP Solution?",
    subtitle: "The discovery of vulnerabilities often arises from a nagging suspicion that something isn’t quite right.",
    link: "https://medium.com/bugbountywriteup/idor-vulnerability-in-colleges-third-party-erp-solution-61497724eda7",
    category: "Web Security",
    platform: "Vansh",
    date: "Apr 26, 2024",
    readTime: "4 min"
  },
  {
    title: "Don’t Just Patch; Predict: How I Used Dark Web Chatter to Find a Vulnerability Before It Was…",
    subtitle: "Free Link 🎈",
    link: "https://medium.com/bugbountywriteup/dont-just-patch-predict-how-i-used-dark-web-chatter-to-find-a-vulnerability-before-it-was-bc46d89f79f6",
    category: "Recon & OSINT",
    platform: "Iski",
    date: "Dec 13",
    readTime: "5 min"
  },
  {
    title: "XSS — Merry XSSMas — Writeup(DAY 11— Advent of Cyber TryHackMe 2025)",
    subtitle: "XSS — Merry XSSMas",
    link: "https://medium.com/bugbountywriteup/xss-merry-xssmas-writeup-day-11-advent-of-cyber-tryhackme-2025-5a1b014dc23d",
    category: "Web Security",
    platform: "Cyb3r-Kr4k3s",
    date: "Dec 12",
    readTime: "6 min"
  },
  {
    title: "PNPT Exam Review — 2025",
    subtitle: "Hello, I passed the Practical Network Penetration Tester (PNPT) certification on my first attempt",
    link: "https://medium.com/bugbountywriteup/pnpt-exam-review-2025-d1e0d5aded02",
    category: "Career & Certs",
    platform: "Hanzala Ghayas Abbasi",
    date: "Apr 22",
    readTime: "8 min"
  },
  {
    title: "Stop Using Free Wi-Fi: This Is How Attackers Steal Your Passwords in Seconds",
    subtitle: "At almost every café, airport, coworking space, and tech event, you’ll find a network called Free Wi-Fi.",
    link: "https://medium.com/bugbountywriteup/stop-using-free-wi-fi-this-is-how-attackers-steal-your-passwords-in-seconds-2a5a0b885608",
    category: "Network Security",
    platform: "Satyam Pathania",
    date: "Dec 11",
    readTime: "4 min"
  },
  {
    title: "🌍 Subdomain Roulette: How Forgotten Hosts Became My Golden Ticket to Admin Panels",
    subtitle: "Free link 🎈",
    link: "https://medium.com/bugbountywriteup/subdomain-roulette-how-forgotten-hosts-became-my-golden-ticket-to-admin-panels-73c6aa17cac5",
    category: "Recon & OSINT",
    platform: "Iski",
    date: "Dec 11",
    readTime: "5 min"
  },
  {
    title: "Agentic AI Red Teaming: The Hottest Cybersecurity Career of 2026",
    subtitle: "How to Start a Career in Agentic AI Red Teaming (New 2026 Path)",
    link: "https://medium.com/bugbountywriteup/agentic-ai-red-teaming-the-hottest-cybersecurity-career-of-2026-beginner-friendly-guide-ed2a2aa4812f",
    category: "AI Security",
    platform: "Taimur Ijlal",
    date: "Dec 11",
    readTime: "7 min"
  },
  {
    title: "React2Shell: CVE-2025–55182 | TryHackMe Write-Up",
    subtitle: "Non-members are welcome to access the full story here.",
    link: "https://medium.com/bugbountywriteup/react2shell-cve-2025-55182-tryhackme-write-up-9b2fa332ca8e",
    category: "Web Security",
    platform: "Mochammad Farros Fatchur Roji",
    date: "Dec 10",
    readTime: "5 min"
  },
  {
    title: "How to Hack an Entrepreneur",
    subtitle: "If you will find out you will win",
    link: "https://medium.com/bugbountywriteup/how-i-hacked-an-entrepreneur-19d270a62c5c",
    category: "Recon & OSINT",
    platform: "StvRoot",
    date: "Dec 10",
    readTime: "3 min"
  },
  {
    title: "The Return of The Luhn Algorithm",
    subtitle: "A deep dive into how BIN ranges, Luhn, and a design flaw revealed cardholder PIIs.",
    link: "https://medium.com/bugbountywriteup/the-return-of-the-luhn-algorithm-542d3d951576",
    category: "Web Security",
    platform: "Alp",
    date: "Dec 10",
    readTime: "6 min"
  },
  {
    title: "Known-Plaintext Attack on PHP-Proxy: From Broken Encryption to FastCGI RCE",
    subtitle: "How a Caesar cipher implementation turned URL encryption into a complete server compromise...",
    link: "https://medium.com/bugbountywriteup/known-plaintext-attack-on-php-proxy-from-broken-encryption-to-fastcgi-rce-4942523c7955",
    category: "Web Security",
    platform: "Muh. Fani Akbar",
    date: "Dec 9",
    readTime: "8 min"
  },
  {
    title: "HackSmarter Arasaka AD Lab Writeup",
    subtitle: "By: Vedant Bhalgama (@ActiveXSploit)",
    link: "https://medium.com/bugbountywriteup/hacksmarter-arasaka-ad-lab-writeup-b57d7e0b5e48",
    category: "Active Directory",
    platform: "Avyukt Security",
    date: "Dec 10",
    readTime: "10 min"
  },
  {
    title: "Call/Message anyone on Facebook directly, bypassing the message requests",
    subtitle: "An Interesting bug on a not-so-interesting Meta Platform — Messenger Kids",
    link: "https://medium.com/bugbountywriteup/call-message-anyone-on-facebook-directly-bypassing-the-message-request-c182055b1724",
    category: "Web Security",
    platform: "Samip Aryal",
    date: "Dec 9",
    readTime: "4 min"
  },
  {
    title: "Discovering Cloud Misconfigurations with Google Dorks",
    subtitle: "Find exposed sensitive data in AWS, Google Cloud, and other platforms when private information becomes searchable on Google.",
    link: "https://medium.com/bugbountywriteup/discovering-cloud-misconfigurations-with-google-dorks-c683274abc90",
    category: "Cloud Security",
    platform: "Reju Kole",
    date: "Dec 9",
    readTime: "5 min"
  },
  {
    title: "The Unconventional OSINT: How Dark Web Tools Gave Me the Edge to Find a Bug",
    subtitle: "Free Link🎈",
    link: "https://medium.com/bugbountywriteup/the-unconventional-osint-how-dark-web-tools-gave-me-the-edge-to-find-a-bug-%EF%B8%8F-%EF%B8%8F-29397e2d6a1a",
    category: "Recon & OSINT",
    platform: "Iski",
    date: "Dec 8",
    readTime: "5 min"
  }
];
