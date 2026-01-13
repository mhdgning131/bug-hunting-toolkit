# 🛡️ Bug Bounty Toolkit

![Project Status](https://img.shields.io/badge/Status-Active-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)

_This project is isnpired from [Coffinxp](https://github.com/coffinxp)'s lostsec.xyz ❤️_

**Bug HUnting Toolkit** is a specialized, all-in-one dashboard designed for Bug Bounty Hunters, Penetration Testers, and Red Teamers. It streamlines the reconnaissance workflow by generating complex tool commands, organizing resources, and visualizing intelligence data.

This application is a "Command Center" to help you structure your methodology, generate syntax-perfect CLI commands for popular tools (like Subfinder, Nuclei, HTTPX), and keep track of your learning resources.

---

## Features

### 1. Generator
Stop remembering complex flags. Enter your target domain once, and instantly generate optimized commands for:
- **Reconnaissance**: Subdomain enumeration (Subfinder, Amass), DNS resolution (Puredns), and live host checks.
- **Vulnerability Scanning**: XSS pipelines, SQL Injection (SQLMap), LFI/RFI fuzzing, and SSRF detection.
- **Content Discovery**: Directory bruteforcing (Feroxbuster, FFUF) and API endpoint scanning (Kiterunner).
- **Google Dorks**: Automated Dork generation for finding sensitive files, login pages, and cloud buckets.

### 2. Resource Library
A curated, filterable collection of the best tools in the industry.
- **Categorized**: Web Security, Network, Cloud, Mobile, and Utilities.
- **Searchable**: Instantly find tools for specific tasks.

### 3. Browser Extensions
A dedicated section for essential browser extensions (Firefox & Chrome) for web security testing, including Wappalyzer, FoxyProxy, and Cookie Editor.

### 4. Writeups Tracker
Stay sharp with a hand-picked list of high-quality bug bounty writeups and articles, categorized by vulnerability type (XSS, IDOR, Logic Bugs) and platform.

### 5. Profile (Beta)
*Currently under construction.* A future module to visualize the attack surface graph of your target.

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v18+)
- **NPM** or **Yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mhdgning131/bug-hunting-toolkit.git
    cd bug-hunting-toolkit
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser to `http://localhost:3000` (or the port shown in your terminal).

---

## Usage Guide

1.  **Define Scope**: On the **Generator** tab, enter your target domain (e.g., `target.com`). The interface validates the domain format.
2.  **Generate Commands**: Scroll through the categories (Recon, XSS, SQLi, etc.).
    *   Click on the **copy** button of any card to copy the command.
    *   The commands automatically update to include your specific target domain.
3.  **Explore Resources**: Use the **Tools**, **Extensions**, and **Writeups** tabs to find new utilities or read about vulnerability methodologies.
4.  **Persist Work**: Your target domain and active tab are saved automatically, so you pick up right where you left

---

<div align="center">
  <p><i>Happy Hunting!</i></p>
</div>
