# Development Guide - Kosek III Dashboard

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Project Architecture

### State Management

The app uses React Context API for state management:

#### AuthContext
- Manages authentication state
- Handles login/logout
- Role-based permissions
- Quick login and role switching

#### DataContext
- Manages cooperatives data
- Manages audits data
- Manages tasks data
- CRUD operations (in-memory)

### Routing

React Router v6 is used for navigation:
- `/` - Login page (redirects to /dashboard if authenticated)
- `/dashboard` - Dashboard home
- `/cooperatives` - List of cooperatives
- `/cooperatives/new` - Add new cooperative
- `/cooperatives/:id` - Cooperative detail
- `/cooperatives/:id/edit` - Edit cooperative
- `/analysis` - Analysis and comparison
- `/audits` - Audit and follow-up tracking
- `/reports` - Reports and analytics
- `/settings` - Demo settings and role switching

All routes except login are protected and require authentication.

### Component Structure

#### Layout Components
- `Layout` - Main layout wrapper with sidebar and topbar
- `Sidebar` - Navigation sidebar
- `Topbar` - Top bar with page title and logout

#### Common Components
- `Card` - Card container
- `MetricCard` - Card with metrics
- `Badge` - Status badge
- `Button` - Reusable button
- `Table` - Table components (Table, TableHead, TableBody, TableRow, TableHeader, TableCell)

### Data Flow

1. Mock data is defined in `src/data/mockData.js`
2. Data is loaded into `DataContext` on app initialization
3. Components access data via `useData()` hook
4. Changes are made through context methods (addCooperative, updateCooperative, etc.)
5. All changes are in-memory and reset on page refresh

### Role-Based Access

Permissions are checked using `hasPermission()` from AuthContext:

- `view_all` - View all cooperatives (Admin, Auditor, Analyst)
- `edit_all` - Edit any cooperative (Admin only)
- `manage_users` - Manage users (Admin only)
- `add_audit` - Add audits (Admin, Auditor)
- `view_analytics` - View analytics (Admin, Auditor, Analyst)
- `view_own` - View own cooperative (Manager)
- `edit_own` - Edit own cooperative (Manager)

### Adding New Features

#### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/layout/Sidebar.jsx`
4. Set appropriate permissions

#### Adding New Data Type

1. Add initial data to `src/data/mockData.js`
2. Add state to `DataContext.jsx`
3. Add CRUD methods to context
4. Create components to display/edit data

#### Adding New Chart

Use Recharts components:
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

## Styling

The app uses Tailwind CSS. Common patterns:

### Colors
- Primary: `blue-600`, `blue-700`
- Success: `green-600`, `green-700`
- Warning: `yellow-600`, `yellow-700`
- Danger: `red-600`, `red-700`
- Gray: `gray-50` to `gray-900`

### Spacing
- Use Tailwind spacing utilities: `p-4`, `m-6`, `space-y-4`, etc.
- Consistent spacing: 4 (1rem), 6 (1.5rem), 8 (2rem)

### Components
- Cards: `bg-white rounded-lg shadow-md p-6`
- Buttons: Use `Button` component with variants
- Inputs: `px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`

## Utilities

### Helper Functions

Located in `src/utils/helpers.js`:

- `formatCurrency(amount)` - Format number as IDR currency
- `formatNumber(number)` - Format number with thousand separator
- `formatDate(dateString)` - Format date as Indonesian locale
- `getRiskColor(riskLevel)` - Get Tailwind classes for risk badge
- `getStatusColor(status)` - Get Tailwind classes for status badge
- `getHealthScoreColor(score)` - Get color class for health score
- `exportToCSV(data, filename)` - Export data to CSV file
- `calculateCompliancePercentage(items)` - Calculate compliance percentage

## Testing

Currently, there are no automated tests in this demo. For production:

1. Add unit tests with Jest/Vitest
2. Add component tests with React Testing Library
3. Add E2E tests with Playwright/Cypress

## Performance

### Current Optimizations
- Vite for fast builds
- React 18 for concurrent features
- Lazy loading can be added for routes

### Future Improvements
- Code splitting with dynamic imports
- Memoization with useMemo/useCallback
- Virtual scrolling for large lists
- Image optimization

## Deployment

### Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Use gh-pages package to deploy
```

## Troubleshooting

### Build fails
- Check Node.js version (should be 16+)
- Delete node_modules and package-lock.json, then run `npm install`

### Charts not rendering
- Check data format matches Recharts requirements
- Ensure ResponsiveContainer has width/height

### Permission issues
- Check role in AuthContext
- Verify permission strings match context definitions

## Production Considerations

If converting to production:

1. **Backend Integration**
   - Replace Context with API calls
   - Use axios or fetch for HTTP requests
   - Add loading states and error handling

2. **Data Persistence**
   - Connect to database (PostgreSQL, MySQL, MongoDB)
   - Implement proper authentication (JWT, OAuth)
   - Add session management

3. **Security**
   - Implement HTTPS
   - Add CSRF protection
   - Sanitize inputs
   - Add rate limiting

4. **Monitoring**
   - Add error tracking (Sentry)
   - Add analytics (Google Analytics, Mixpanel)
   - Add logging

5. **Performance**
   - Add caching
   - Optimize images
   - Add CDN
   - Implement pagination on backend
