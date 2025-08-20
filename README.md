# Training Resource Library

A lightweight, SharePoint-integrated web application for managing and organizing training materials and documentation. Built as a Progressive Web App (PWA) that can be hosted on GitHub Pages and installed for offline access.

## 🌟 Features

### Core Functionality
- **Resource Management** - Add, view, and delete training resources
- **Dual Link Support** 
  - Embedded documents (viewable within the app via iframe)
  - External links (open in SharePoint)
- **Smart URL Extraction** - Automatically extracts URLs from SharePoint iframe embed codes
- **Tag System** - Organize resources with customizable tags
- **Search & Filter** - Find resources quickly by title or tags
- **Data Persistence** - All data stored locally in browser localStorage
- **Import/Export** - Backup and share resource libraries via JSON files

### Progressive Web App
- **Installable** - Add to home screen on desktop and mobile
- **Offline Capable** - Works without internet connection once installed
- **Responsive Design** - Adapts to all screen sizes
- **SharePoint Integration** - Seamlessly works with SharePoint embedded content

## 🚀 Quick Start

### Option 1: Direct Usage
1. Download the `index.html` file
2. Open it in any modern web browser
3. Start adding your SharePoint resources

### Option 2: GitHub Pages Deployment
1. Create a new GitHub repository
2. Upload the `index.html` file
3. Go to Settings → Pages
4. Select "Deploy from a branch" and choose main branch
5. Access your app at `https://[username].github.io/[repo-name]`

### Option 3: SharePoint Deployment
1. Upload to a SharePoint document library
2. Embed in a SharePoint page using the Embed web part
3. Or add as a link in SharePoint navigation

## 📖 User Guide

### Adding Resources

1. Click the **"➕ New"** button
2. Enter a descriptive title
3. Select link type:
   - **Embedded Document** - For viewing within the app
   - **External Link** - For opening in SharePoint
4. Paste the SharePoint URL or iframe code
   - The app automatically extracts URLs from iframe embed codes
5. Select relevant tags
6. Click **Save**

### Getting SharePoint Embed Links

1. Navigate to your document in SharePoint
2. Click **File → Embed**
3. Copy the entire iframe code
4. Paste it directly into the app (URL will be extracted automatically)

Example iframe code:
```html
<iframe src="https://yourcompany.sharepoint.com/sites/Training/_layouts/15/embed.aspx?UniqueId=..." 
        width="640" height="360" frameborder="0" scrolling="no" allowfullscreen></iframe>
```

### Managing Tags

1. Click **"🏷️ Manage tags"**
2. Add new tags or remove existing ones
3. Tags in use will warn before deletion

### Searching and Filtering

- Use the search box to find resources by title
- Click tags to filter resources by category
- Active filters show in blue
- Click active filters again to remove them

### Importing/Exporting Data

**Export:**
1. Click **"💾 Export"**
2. Save the JSON file for backup or sharing

**Import:**
1. Click **"📁 Import"**
2. Select a previously exported JSON file
3. Confirm to replace existing data

## 🛠️ Technical Details

### Technologies Used
- Pure HTML5, CSS3, and JavaScript
- No external dependencies or frameworks
- localStorage for data persistence
- PWA manifest for installability

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Data Structure
```javascript
{
  "resources": [
    {
      "id": 1234567890,
      "title": "Resource Title",
      "link": "https://sharepoint.url",
      "linkType": "embed|share",
      "tags": ["Training", "Policy"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "tags": ["Training", "Documentation", "Policy", ...]
}
```

### Storage Limits
- localStorage capacity: ~5-10MB
- Approximately 1000-2000 resources depending on data

## 🔧 Customization

### Modifying Default Tags
Edit the `tags` array in the JavaScript section:
```javascript
let tags = ['Training', 'Documentation', 'Policy', 'Your Custom Tag'];
```

### Changing Colors
Modify CSS variables in the `:root` section:
```css
:root {
  --ms-primary: #0078d4;  /* Primary blue */
  --ms-gray-20: #f3f2f1;  /* Background */
}
```

### Adding PWA Icons
Replace the base64 icon in the manifest with your own:
1. Create a 192x192px icon
2. Convert to base64
3. Update the manifest link in the HTML head

## 🔒 Security & Privacy

- **No server required** - All data stored locally in browser
- **No external connections** - Except for SharePoint embeds
- **No tracking or analytics**
- **Data stays on device** - Export/import for sharing
- **SharePoint authentication** - Handled by SharePoint's native security

## 📝 Known Limitations

1. **SharePoint Authentication** - Users must be logged into SharePoint to view embedded documents
2. **CORS Restrictions** - Some SharePoint configurations may block embedding
3. **Storage Limits** - Browser localStorage has size limitations
4. **Browser Support** - Requires modern browsers with localStorage support

## 🆘 Troubleshooting

### Embedded Documents Not Loading
- Ensure you're logged into SharePoint
- Check if the document has proper sharing permissions
- Verify the embed link is from the same SharePoint tenant

### Data Not Saving
- Check browser's localStorage is enabled
- Ensure not in private/incognito mode
- Verify sufficient storage space

### PWA Not Installing
- Must be served over HTTPS (GitHub Pages works)
- Won't install from file:// protocol
- Check browser PWA support

## 📄 License

This project is provided as-is for internal organizational use. Feel free to modify and distribute within your organization.

## 🤝 Contributing

To contribute improvements:
1. Download the current version
2. Make your modifications
3. Test thoroughly
4. Share with your team via export/import

## 📧 Support

For issues or questions:
1. Check this README first
2. Verify browser compatibility
3. Try export/import to reset data
4. Contact your IT administrator for SharePoint-specific issues

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Compatible with:** SharePoint Online, SharePoint 2019+
