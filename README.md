# React Tailwind Starter Project

A modern, pre-configured React starter template with Tailwind CSS, routing, authentication scaffolding, and a sidebar layout. Perfect for building web applications quickly without spending time on boilerplate setup.

## Features

- **Tailwind CSS 3.4.17** - Utility-first CSS framework for rapid UI development
- **React Router DOM** - Client-side routing for seamless page navigation
- **Sidebar Navigation** - Pre-built responsive sidebar layout component
- **Protected Routes** - Authentication-ready route protection with automatic redirects
- **Pre-built Pages** - Landing, Login, and Signup pages to get you started
- **Inter Font** - Modern sans-serif font for professional typography
- **Vite** - Lightning-fast build tool and development server
- **PostCSS** - CSS processing for optimal Tailwind integration

## Project Structure

```
frontend/
├── node_modules/          # Project dependencies
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, icons, and other static files
│   ├── components/        # Reusable React components
│   │   └── Sidebar.jsx    # Sidebar navigation component
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Dashboard page
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   ├── routes/            # Route configuration
│   │   ├── AppRoutes.jsx  # Main route definitions
│   │   └── ProtectedRoute.jsx # Authentication wrapper for routes
│   ├── App.css            # Global app styles
│   ├── App.jsx            # Main app component
│   ├── AppRoutes.jsx      # Route exports
│   ├── Layout.jsx         # Layout wrapper component
│   ├── index.css          # Base styles
│   └── main.jsx           # Application entry point
├── App.css                # Global stylesheet
├── README.md              # This file
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package-lock.json      # Dependency lock file
├── package.json           # Project metadata and dependencies
├── postcss.config.js      # PostCSS configuration for Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Key Components & How to Extend

### Sidebar Component

Located in `src/components/Sidebar.jsx`, the sidebar provides navigation structure with logout functionality. The sidebar includes:

- **Navigation Items** - Easily extendable list of routes with icons from Heroicons
- **Active State Indicator** - Current page is highlighted with blue background
- **Logout Button** - Clears authentication tokens and redirects to login
- **Logo Section** - Displays project branding and version

Customize it by:
- Adding new navigation links to the `navItems` array:
```jsx
const navItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
  { name: "Settings", icon: CogIcon, path: "/settings" },
  { name: "Users", icon: UserGroupIcon, path: "/users" },
];
```
- Importing additional icons from `@heroicons/react/24/outline`
- Modifying styling with Tailwind classes
- Updating the logout handler with your authentication logic

The sidebar uses Heroicons for clean, professional icons and is fully responsive.

### Pages

All page components are in `src/pages/`. Create new pages by:
1. Creating a new file (e.g., `YourPage.jsx`)
2. Adding the route in `src/routes/AppRoutes.jsx`
3. Importing and using it in your app

### Layout

The `Layout.jsx` component wraps your pages with the sidebar. Pages using this layout automatically get sidebar navigation. Use it in `AppRoutes.jsx`:

```jsx
<Route element={<Layout />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

### Protected Routes

Use `ProtectedRoute.jsx` to restrict access to authenticated users only:

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

Currently, protected routes redirect unauthenticated users to the login page. Implement your authentication logic in `ProtectedRoute.jsx` to check user status.

### Adding Authentication

To implement real authentication:
1. Update `ProtectedRoute.jsx` to check actual authentication status
2. Add login/logout logic in your `LoginPage.jsx`
3. Store authentication tokens (consider using context or a state management library)
4. Update protected route conditions based on token validity

### Styling with Tailwind

This project uses Tailwind CSS utility classes. Build UIs without writing custom CSS:

```jsx
<div className="flex items-center justify-between p-4 bg-blue-500 rounded-lg">
  <h1 className="text-2xl font-bold text-white">Welcome</h1>
  <button className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
    Click Me
  </button>
</div>
```

Refer to [Tailwind CSS Documentation](https://tailwindcss.com/docs) for all available utilities.

### Using Icons

Heroicons provides a comprehensive set of SVG icons. Import and use them throughout your project:

```jsx
import { HomeIcon, CogIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function MyComponent() {
  return (
    <div className="flex gap-4">
      <HomeIcon className="h-6 w-6 text-blue-500" />
      <CogIcon className="h-6 w-6 text-gray-500" />
      <UserGroupIcon className="h-6 w-6 text-green-500" />
    </div>
  );
}
```

Available icon sets:
- `@heroicons/react/24/outline` - Outlined style icons (recommended for most uses)
- `@heroicons/react/24/solid` - Solid style icons

See [Heroicons Documentation](https://heroicons.com) for all available icons.

### Toast Notifications

React Hot Toast provides lightweight, customizable notifications. Use it to show success, error, or info messages:

```jsx
import toast from "react-hot-toast";

export default function MyComponent() {
  const handleSuccess = () => {
    toast.success("Operation completed successfully!");
  };

  const handleError = () => {
    toast.error("Something went wrong!");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

Add the Toaster component in your `App.jsx` to display notifications:

```jsx
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* Your routes here */}
    </>
  );
}
```

See [React Hot Toast Documentation](https://react-hot-toast.com) for more options.

## Customization Guide

### Change Colors & Branding

Edit `tailwind.config.js` to customize the color palette:

```js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Modify Fonts

The Inter font is set in `index.css`. Change it by:
1. Updating the font import in `index.css`
2. Modifying the font family in `tailwind.config.js`

### Add New Routes

1. Create your page component in `src/pages/`
2. Add the route in `src/routes/AppRoutes.jsx`:

```jsx
<Route path="/your-route" element={<YourPage />} />
```

3. Link to it from other pages or the sidebar

## Best Practices

- Keep components small and reusable
- Use Tailwind classes for styling instead of custom CSS
- Store shared state in context or a state management library
- Keep routes organized in `AppRoutes.jsx`
- Use descriptive names for components and pages
- Add proper error handling and loading states

## Dependencies

Key packages included:
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `tailwindcss` - Utility-first CSS framework
- `vite` - Build tool
- `@heroicons/react` - Beautiful hand-crafted SVG icons
- `react-hot-toast` - Lightweight toast notifications

See `package.json` for the complete list.

## Tips for Building

- Start by creating pages in the `pages/` folder
- Add reusable components in the `components/` folder
- Update routes as you add new pages
- Use the Layout component to maintain consistent UI
- Leverage Tailwind's responsive classes (`md:`, `lg:`, `sm:`) for mobile-friendly design

## Troubleshooting

**Tailwind styles not applying?**
- Ensure `tailwind.config.js` includes the correct content paths
- Restart the dev server after modifying Tailwind config

**Routes not working?**
- Check that all routes are properly defined in `AppRoutes.jsx`
- Ensure components are correctly imported

**Build errors?**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## Support & Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## License

This starter project is open source and available under the MIT License.

---

Happy building! 🚀
