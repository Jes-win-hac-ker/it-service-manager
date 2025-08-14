# IT Service Manager Web Application

A modern web-based IT Service Manager application converted from Python desktop app. Manage customer service reports with full CRUD functionality. Now optimized for GitHub Pages deployment with client-side data storage.

## Features

- **Submit Reports**: Create new service reports with customer details
- **Search Reports**: Find reports by serial number, customer name, or phone
- **Update Reports**: Modify existing reports with diagnostic and return dates  
- **Delete Reports**: Remove reports with confirmation dialogs
- **Real-time Search**: Live filtering and search results
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Data Management**: Export/import functionality for data backup and transfer
- **Client-side Storage**: Uses localStorage for data persistence (GitHub Pages compatible)

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React Icons
- **Storage**: Browser localStorage (no backend required)
- **UI**: Modern, production-ready interface with toast notifications
- **Deployment**: GitHub Pages compatible

## Getting Started

### For Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the frontend only** (GitHub Pages version):
   ```bash
   npm run dev
   ```
   This starts the frontend on port 5173 with localStorage.

3. **Alternative - Full stack version** (if you want to use the backend):
   ```bash
   npm run dev:full
   ```
   This starts both backend and frontend (requires the server files).

4. **Access the application**:
   Open http://localhost:5173 in your browser

## Deploying to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as the source
   - The workflow will automatically deploy on every push to main

3. **Access your app**:
   Your app will be available at: `https://yourusername.github.io/it-service-manager/`

### Method 2: Manual Deployment

1. **Build and deploy**:
   ```bash
   npm run deploy
   ```

2. **Enable GitHub Pages**:
   - Go to repository settings → Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch

## Data Storage

The GitHub Pages version uses browser localStorage instead of a database:
- Data persists between browser sessions
- Data is stored locally on each device/browser
- Use the Data Management tab to export/import data
- Export regularly for backup purposes

## Original Database Schema (for reference)

The SQLite database contains a `reports` table with:
- `id` (Primary Key, Auto Increment)
- `serial_number` (TEXT)
- `customer_name` (TEXT) 
- `phone_number` (TEXT)
- `problem_description` (TEXT)
- `date_given` (DATE)
- `date_diagnosed` (DATE)
- `date_returned` (DATE)
- `created_at` (DATETIME)

## Deployment

### GitHub Pages (Static Hosting)
✅ **Recommended for this version**
- Free hosting
- Automatic deployments
- No server costs
- Perfect for client-side applications

### Other Hosting Options

#### Netlify (Static)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Works with localStorage version

#### Vercel (Static)
1. Connect your GitHub repository
2. Vercel will automatically build and deploy
3. Works with localStorage version

#### Full-Stack Hosting (Railway/Render/Heroku)
*Only needed if you want to use the backend version*
1. Push to Git repository
2. Connect to hosting provider
3. Set build command: `npm run build`
4. Set start command: `npm run server`

## Features Comparison

| Feature | GitHub Pages Version | Full-Stack Version |
|---------|---------------------|-------------------|
| Data Storage | localStorage | SQLite Database |
| Hosting Cost | Free | Varies |
| Setup Complexity | Simple | Moderate |
| Data Sharing | Per device/browser | Centralized |
| Backup | Export/Import | Database backups |
| Scalability | Limited | High |

## License

MIT License - feel free to use and modify for your needs.
