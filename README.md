# Photography Portfolio Website

A modern, fully-functional photography portfolio website built with vanilla HTML, CSS, and JavaScript.

## Features

✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
✅ **Photo Gallery** - 51+ photos across Portraits (29), Weddings (16), and Landscapes (6) with filtering  
✅ **Lightbox Viewer** - Click to expand and navigate through images  
✅ **Portfolio Showcase** - Display your best work with project details  
✅ **Contact Form** - Client inquiries with email validation and local storage  
✅ **Admin Dashboard** - Secure login to manage photos, messages, and projects  
✅ **Dedicated Category Pages** - Direct links from homepage to Portraits, Weddings, and Landscapes  
✅ **Keyboard Navigation** - Arrow keys and Escape support in lightbox  
✅ **Mobile Menu** - Hamburger navigation for mobile devices

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and Grid
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Local Storage** - Data persistence in browser

## Project Structure

```
my-web/
├── index.html              # Landing page
├── gallery.html            # Photo gallery with lightbox
├── portfolio.html          # Portfolio showcase
├── contact.html            # Contact form
├── portraits.html          # Dedicated portrait photography page
├── weddings.html           # Dedicated wedding photography page
├── landscapes.html         # Dedicated landscape photography page
├── admin/
│   └── index.html          # Admin dashboard
├── assets/
│   ├── css/
│   │   ├── style.css       # Global styles
│   │   ├── navbar.css      # Navigation styles
│   │   ├── gallery.css     # Gallery and lightbox styles
│   │   ├── portfolio.css   # Portfolio styles
│   │   ├── contact.css     # Contact form styles
│   │   └── admin.css       # Admin dashboard styles
│   ├── js/
│   │   ├── navbar.js       # Navigation functionality
│   │   ├── gallery.js      # Gallery and lightbox script
│   │   ├── contact.js      # Form validation
│   │   └── admin.js        # Admin dashboard logic
│   └── images/
│       ├── portrait/          # 29 portrait photos
│       ├── wedding/           # 16 wedding photos
│       ├── landscape/         # 6 landscape photos
│       └── placeholder-*.jpg  # Fallback images
└── .github/
    └── copilot-instructions.md
```

## Getting Started

### 1. **Setup**
- Clone or download this repository
- Open `index.html` in your web browser
- Or use VS Code's **Live Server** extension for development:
  - Right-click `index.html` → "Open with Live Server"

### 2. **Customize Content**
- Edit the text, contact information, and social links in HTML files
- Replace placeholder images in `/assets/images/` with your own photos
- Update image src attributes in HTML files

### 3. **Add Your Photos**
- Replace `placeholder-1.jpg`, `placeholder-2.jpg`, `placeholder-3.jpg` in `/assets/images/`
- Update gallery items and portfolio sections with your actual images

### 4. **Admin Dashboard**
Access the admin panel at `/admin/index.html`
- **Default Password**: `admin123`
- Upload and manage photos
- View contact form messages
- Add/manage portfolio projects

## Features in Detail

### Gallery & Lightbox
- Filter photos by category (Portraits, Weddings, Landscapes, Events)
- Click any image to open fullscreen lightbox viewer
- Navigate with arrow buttons or keyboard arrows
- Press ESC to close

### Dedicated Category Pages
- **Portraits**: `portraits.html` - 29 professional portrait photography photos
- **Weddings**: `weddings.html` - 16 wedding photography photos  
- **Landscapes**: `landscapes.html` - 6 landscape photography photos
- Direct links from homepage featured projects section
- Each page includes "Back to Full Gallery" navigation

### Contact Form
- Form validation with error messages
- Stores messages in browser's local storage
- Admin can view all messages in dashboard
- Email validation built-in

### Admin Dashboard
- **Dashboard Tab**: Overview of total photos, messages, and projects
- **Manage Photos Tab**: Upload new photos with categories and titles
- **Messages Tab**: View all contact form submissions
- **Portfolio Tab**: Add and manage portfolio projects

All data is stored in browser's **Local Storage** (persists between sessions)

## Customization

### Colors
Edit CSS variables in `/assets/css/style.css`:
```css
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #333;
    --accent-color: #c41e3a;
    /* ... */
}
```

### Fonts
Default font is 'Segoe UI'. Change in `style.css`:
```css
body {
    font-family: 'Your Font', sans-serif;
}
```

### Navigation
Edit navigation links in navbar:
- All HTML files have the same navbar structure
- Update links across all pages for consistency

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## Local Storage Data

The site uses browser's Local Storage to save:
- Contact form messages: `contactMessages`
- Uploaded photos: `photos`
- Portfolio projects: `projects`
- Admin login session: `adminLoggedIn`

To clear all data, open browser console and run:
```javascript
localStorage.clear();
```

## Performance Features

- No external dependencies or CDNs
- Fast loading (all CSS and JS embedded)
- Optimized for Core Web Vitals
- Responsive images with proper aspect ratios
- Smooth animations and transitions

## Deployment

This is a static site and can be deployed to:
- **GitHub Pages** - Free hosting, great for portfolios
- **Netlify** - Drag & drop deployment
- **Vercel** - Optimized static hosting
- Any traditional web host (copy files via FTP)

### GitHub Pages Deployment:
1. Push to GitHub repository
2. Go to Settings → Pages
3. Set source to main branch
4. Site will be live in minutes

## Tips for Photography Portfolio

1. **Use high-quality images** - Compress but maintain quality
2. **Organize categories** - Keep 15-20 best photos per category
3. **Update regularly** - Keep portfolio fresh with new work
4. **Mobile first** - Test on mobile during customization
5. **Backup data** - Export localStorage data regularly

## Troubleshooting

### Images not showing?
- Check image paths in HTML
- Ensure images are in `/assets/images/`
- Verify file names match exactly (case-sensitive on Linux/Mac)

### Lightbox not working?
- Check browser console for JavaScript errors
- Ensure `gallery.js` is loaded in gallery.html
- Clear browser cache and refresh

### Admin dashboard won't load?
- Check if you're accessing `/admin/index.html` correctly
- Click through from navbar Admin link
- Clear sessionStorage if having login issues

### Messages not saving?
- Check if Local Storage is enabled in browser
- Look at browser's Application tab to see saved data
- Try a different browser or private/incognito mode

## License

You are free to use and modify this template for personal and commercial projects.

## Support

For issues or questions:
1. Check the code comments
2. Review browser console for errors
3. Test in a different browser
4. Verify all files are in correct directories

---

**Happy photographing!** 📸
