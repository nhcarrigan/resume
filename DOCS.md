---
title: Resume Builder
---

Resume Builder (hereinafter the "Application") is a static site generator that transforms a YAML or JSON resume source into a styled HTML resume website, along with downloadable formats. It is designed for easy customization and deployment, using TypeScript for parsing and rendering, and outputs a ready-to-host static site.

## 1. User Documentation

The Resume Builder generates a professional, accessible resume website from structured data. The live website displays:

### Features
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Print-Optimized**: Print or save as PDF with optimized styling
- **Multiple Formats**: Download resume data in YAML or JSON format
- **Professional Sections**: Employment, volunteer work, education, certifications, projects, and publications
- **Navigation Links**: Quick jump links to different resume sections
- **Contact Integration**: Direct links to testimonials and contact forms

### Using the Resume Website
1. **Browse Sections**: Use the navigation links to jump to specific sections (Employment, Education, etc.)
2. **Download Data**: Click "YAML" or "JSON" links to download the resume in structured formats
3. **Print/Save PDF**: Click the "print" link to open browser print dialog for PDF saving
4. **Contact**: Use the "submit your own request" link to contact for opportunities

### Resume Sections
- **Employment**: Current and past positions with company details, dates, and descriptions
- **Volunteer Work**: Community involvement and volunteer positions
- **Education**: Academic background and certifications
- **Certifications**: Professional certifications and credentials
- **Projects**: Notable projects and achievements
- **Publications**: Articles, papers, and published works

## 2. Technical Documentation

The Resume Builder is a Node.js-based static site generator that transforms YAML resume data into a complete website.

### Architecture
- **TypeScript Parser**: `src/parse.ts` - Main build script that processes YAML data
- **Data Schema**: `src/interfaces/resume.ts` - TypeScript interfaces defining resume structure
- **Source Data**: `src/source.yaml` - YAML file containing all resume information
- **Static Assets**: `src/static/` - CSS styles and JavaScript for the generated site
- **Output**: `site/` - Generated HTML, CSS, JS, YAML, and JSON files

### Requirements
- Node.js (latest LTS recommended)
- pnpm package manager
- TypeScript support via tsx

### Installation & Setup
```bash
# Clone the repository
git clone <repository-url>
cd resume

# Install dependencies
pnpm install

# Build the site
pnpm run build
```

### Available Scripts
- `pnpm run build` - Generate the static site from YAML data
- `pnpm run lint` - Run ESLint for code quality
- `pnpm run spelling` - Check spelling in source.yaml
- `pnpm run test` - Run validation tests

### Data Structure
The resume data follows this schema:
- `name`: Full name
- `contact`: Contact information
- `summary`: Professional summary
- `employment[]`: Array of employment positions
- `volunteer[]`: Array of volunteer positions  
- `education[]`: Array of educational background
- `certifications[]`: Array of certifications
- `projects[]`: Array of notable projects
- `publications[]`: Array of publications

### Customization
1. **Content**: Edit `src/source.yaml` with your resume data
2. **Styling**: Modify `src/static/style.css` for visual customization
3. **Structure**: Update `src/parse.ts` to change HTML generation
4. **Types**: Extend `src/interfaces/resume.ts` for new data fields

### Deployment
The `site/` directory contains all files needed for static hosting:
- `index.html` - Main resume webpage
- `style.css` - Styling
- `dates.js` - JavaScript for date handling
- `resume.yaml` - YAML format download
- `resume.json` - JSON format download

Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## 3. Legal Documentation

### License
This software is licensed under Naomi's Public License. Copyright held by Naomi Carrigan.

For complete legal terms, refer to:
- [Global Software License](https://docs.nhcarrigan.com/#/license)
- [LICENSE.md](LICENSE.md) in the repository
- [PRIVACY.md](PRIVACY.md) for privacy policy
- [TERMS.md](TERMS.md) for terms of service
- [SECURITY.md](SECURITY.md) for security policies

### Data Privacy
The resume website is a static site that:
- Does not collect user data
- Does not use cookies or tracking
- Does not store personal information
- Contains only publicly available professional information

### Third-Party Services
The generated website may include links to external services:
- Testimonials platform (testimonials.nhcarrigan.com)
- Contact forms (forms.nhcarrigan.com)
- External headers/scripts (cdn.nhcarrigan.com)

Users should review the privacy policies of any external services they choose to interact with.

## 4. Contributing Documentation

### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `pnpm install`
4. Make your changes
5. Test your changes: `pnpm run build && pnpm run test && pnpm run lint && pnpm run spelling`
6. Submit a pull request

### Contribution Guidelines
- Read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating
- Follow the existing code style and conventions
- Only modify `src/source.yaml` for content changes
- Do not commit files in the `site/` directory (auto-generated)
- Ensure all tests pass before submitting
- Provide clear commit messages and PR descriptions

### Development Workflow
1. **Content Updates**: Edit `src/source.yaml` with new resume information
2. **Code Changes**: Modify TypeScript files in `src/` directory
3. **Styling**: Update CSS in `src/static/style.css`
4. **Testing**: Add tests in `test/` directory using Vitest
5. **Build**: Run `pnpm run build` to generate the site

### Quality Checks
All contributions must pass:
- **ESLint**: Code quality and style checking
- **Spelling**: cspell validation of YAML content  
- **Tests**: Vitest validation of data structure
- **Build**: Successful site generation

### Reporting Issues
- Use GitHub Issues for bugs and feature requests
- Provide detailed reproduction steps for bugs
- Include relevant error messages and logs
- Tag issues appropriately (bug, enhancement, documentation)

### Contact
- [Chat Server](http://chat.nhcarrigan.com) for real-time discussion
- Email: contact@nhcarrigan.com for direct communication
- GitHub Issues for project-specific discussions

### Project Structure
```
src/
├── parse.ts              # Main build script
├── source.yaml          # Resume data (edit this)
├── interfaces/
│   └── resume.ts        # TypeScript type definitions
└── static/
    ├── style.css        # Website styling
    └── dates.js         # Date handling JavaScript

test/
└── validate.spec.ts     # Validation tests

site/                    # Generated output (do not edit)
├── index.html
├── style.css
├── dates.js
├── resume.yaml
└── resume.json
```
