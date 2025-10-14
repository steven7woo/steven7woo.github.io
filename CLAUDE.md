# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal academic website for Steven Wu (zstevenwu.com), an Associate Professor at Carnegie Mellon University. The website is a static HTML site hosted via GitHub Pages.

## Project Structure

- `index.html` - Main homepage with sections for About, News, Group, Teaching, Service, and Talks
- `papers.html` - Publications listing page
- `prospective.html` - Information for prospective students
- `cv.pdf` - Curriculum vitae (binary file)
- `css/` - Stylesheets (Bootstrap, Font Awesome, custom styles)
- `js/` - JavaScript files for animations and interactions
- `images/` - Profile photo, favicon, and other images
- `courses/` - Course websites from previous teaching (f18, f19, s20 at UMN)
  - Contains standalone course sites with reveal.js presentations and KaTeX for math rendering
- `papers/` - PDF files of research papers
- `talks/` - Presentation slides

## Technology Stack

- **Frontend Framework**: Bootstrap 4.3.1
- **CSS**: Custom CSS (`css/main.css`) with animations (`css/animate.css`)
- **JavaScript Libraries**:
  - jQuery 3.4.1
  - WOW.js for scroll animations
  - Bootstrap JavaScript components
- **Icons**: Font Awesome for social/academic icons
- **Fonts**: Google Fonts (Quicksand, Work Sans)
- **Course Sites**: Reveal.js for slides, KaTeX for mathematical typesetting

## Site Architecture

### Main Navigation Structure
The site uses a fixed-top navbar with hash-based navigation to sections on the homepage:
- `#about` - Biography and research interests
- `#news` - Recent announcements and achievements
- `#group` - Current students, postdocs, and alumni
- `#teaching` - Course listings by semester
- `#service` - Academic service activities
- `#talks` - Recorded presentations and talks

### Content Management Pattern
The site follows a pattern where most news/updates are commented out in HTML rather than deleted, creating an archive of past announcements. Active content is uncommented at the top, with older items progressively commented out.

### Responsive Design
The site uses Bootstrap's grid system (col-md-*) with a mobile-first responsive approach. The navbar collapses into a hamburger menu on smaller screens.

## Common Development Tasks

### Updating Content

**Adding news items**: Insert new entries at the top of the News section (`<div class="news wow zoomIn" id="news">`). Follow the existing row/column structure with date in `col-md-2` and content in `col-md-8`.

**Updating student lists**: Modify the Group section. Students are organized by category (PhD, Postdocs, Undergrad/Master's, Alumni) with links to their personal websites.

**Adding courses**: Add new course entries to the Teaching section chronologically. Include semester, course number, and link to course website.

**Updating papers**: Modify `papers.html` to add new publications. The main list is linked from the homepage.

### Working with Courses
Course subdirectories (e.g., `courses/f19/csci5525/`) are self-contained sites with:
- Static HTML files
- Custom JavaScript assets (reveal.js, KaTeX)
- Course-specific stylesheets
- Lecture slides and resources

When updating course content, be aware that these use reveal.js for presentations and have their own navigation structures.

## Deployment

This site is deployed via GitHub Pages. The repository name `steven7woo.github.io` indicates this is a user site, served from the `master` branch. The `CNAME` file contains the custom domain `zstevenwu.com`.

Any commits to the `master` branch will automatically deploy to production.

## Important Notes

- The site uses cache-control meta tags to prevent aggressive caching during updates
- External links generally use `target="_blank"` for opening in new tabs
- Video embeds use YouTube and Vimeo
- PDF links use `onclick="_gaq.push(['_trackEvent', 'Download', 'PDF', this.href])"` for analytics (though Google Analytics code appears to be a placeholder)
- Most sections use the WOW.js animation library for scroll-based reveal effects (`class="wow zoomIn"`)
