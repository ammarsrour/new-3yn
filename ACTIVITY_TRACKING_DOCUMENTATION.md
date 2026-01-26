# Activity Tracking and Admin Dashboard - Implementation Guide

## Overview
This document describes the comprehensive activity tracking and admin system that has been implemented for your billboard analysis SaaS platform.

## What Was Implemented

### 1. Database Tables (✓ COMPLETED)

Two new tables have been created via migration:

#### `user_activities` Table
Tracks all user actions throughout the platform:
- `id` - Unique identifier (UUID)
- `user_id` - References auth.users (with CASCADE delete)
- `activity_type` - Type of activity: page_view, upload, analysis, download, login, logout, location_select
- `activity_description` - Human-readable description
- `metadata` - JSONB field for additional data
- `user_agent` - Browser/device information
- `ip_address` - User's IP address
- `created_at` - Timestamp (defaults to now)

#### `user_files` Table
Tracks file uploads and downloads:
- `id` - Unique identifier (UUID)
- `user_id` - References auth.users (with CASCADE delete)
- `file_name` - Original filename
- `file_type` - MIME type
- `file_size` - Size in bytes
- `action` - Either 'upload' or 'download'
- `metadata` - JSONB field for additional information
- `created_at` - Timestamp (defaults to now)

#### Schema Updates
- Added `role` column to `user_profiles` table (default: 'user', options: 'user' or 'admin')

#### Security (Row Level Security)
- Users can view and insert their own activities
- Admins can view all activities
- Comprehensive RLS policies for both tables
- Helper function `is_admin()` for checking admin status

### 2. Activity Logging Service (✓ COMPLETED)

**File**: `src/services/activityLogger.ts`

A comprehensive service that handles all activity logging with these methods:

- `logActivity()` - Generic activity logger
- `logFileActivity()` - Logs file uploads/downloads
- `logPageView()` - Tracks page views
- `logUpload()` - Logs file uploads (tracks both activity and file record)
- `logAnalysis()` - Logs billboard analyses
- `logDownload()` - Logs report downloads
- `logLogin()` - Logs user login events
- `logLogout()` - Logs user logout events
- `logLocationSelect()` - Logs location selection with coordinates
- `getUserActivities()` - Retrieves user's activity history
- `getAllActivities()` - Admin: Retrieves all activities with user profiles
- `getAllFileActivities()` - Admin: Retrieves all file activities
- `getActivitySummary()` - Gets statistics summary

**Error Handling**: All methods handle errors gracefully and log to console without throwing.

### 3. Admin Dashboard (✓ COMPLETED)

**Files**:
- `src/components/pages/AdminDashboard.tsx` - Main admin page
- `src/components/admin/SummaryCard.tsx` - Summary statistic cards
- `src/components/admin/ActivityTable.tsx` - Activity data table
- `src/components/admin/FileActivityTable.tsx` - File activity data table

**Features**:
- **Summary Cards**: Total activities, analyses, uploads, downloads
- **User Filtering**: Dropdown to filter activities by user
- **Activity Table**:
  - Expandable rows showing metadata, user agent, IP
  - Color-coded activity types
  - User information with company names
- **File Activity Table**:
  - File details with size formatting
  - Upload/download differentiation
  - User attribution
- **Export to CSV**: Export filtered activities to CSV file
- **Auto-refresh**: Loads latest data on mount

### 4. Activity Logging Integration (✓ COMPLETED)

Activity logging has been integrated into:

#### UploadSection Component
- Logs file uploads when users select or drop files
- Tracks filename, size, and type

#### AnalysisResults Component
- Logs PDF report downloads
- Includes analysis location in filename

#### LocationInput Component
- Logs location selections
- Includes coordinates when available

#### App Component (Authentication)
- Logs login events with email
- Logs logout events

### 5. Admin Access Control (✓ COMPLETED)

**Files Modified**:
- `src/App.tsx` - Routing and view management
- `src/components/layout/Header.tsx` - Admin navigation
- `src/services/supabaseAuth.ts` - Added role to UserProfile type

**Features**:
- Admin/Dashboard view toggle in header (visible only to admins)
- Role-based access control
- Visual indicators for current view
- Automatic redirect to dashboard for non-admin users

## How to Use

### Setting Up an Admin User

You need to manually update the database to grant admin access to a user:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

### Accessing the Admin Dashboard

1. Log in as a user with admin role
2. Click the "Admin" button in the header navigation
3. The admin dashboard will display with all activity tracking data

### Admin Dashboard Features

#### View Activity Summary
- See total activities, analyses, uploads, and downloads at a glance

#### Filter Activities
- Use the user dropdown to filter activities by specific users
- Select "All Users" to see everything

#### View Activity Details
- Click "Show" on any activity row to see:
  - Full metadata (location, file info, etc.)
  - User agent (browser/device)
  - IP address (if captured)

#### Export Data
- Click "Export CSV" to download current filtered activities
- CSV includes all visible data and metadata

### Activity Tracking

Activities are automatically tracked for:
- **Login/Logout**: When users sign in or out
- **File Uploads**: When users upload billboard images
- **Analyses**: When users run billboard analyses
- **Downloads**: When users download PDF reports
- **Location Selection**: When users select billboard locations

### Viewing User Activities

As an admin, you can:
1. See all user activities in chronological order
2. Filter by specific users
3. View detailed metadata for each activity
4. Export data for reporting or analysis

## Database Indexes

Performance indexes have been created on:
- `user_activities.user_id`
- `user_activities.activity_type`
- `user_activities.created_at` (DESC)
- `user_files.user_id`
- `user_files.created_at` (DESC)

These ensure fast queries even with large amounts of data.

## Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only see their own data
- Admins can see all data through dedicated policies
- No user can modify or delete activity logs

### Data Privacy
- Activity logs include user agent and IP address
- Only admins can view other users' activities
- All data is protected by Supabase authentication

### Admin Verification
- The `is_admin()` function checks user role
- Admin routes are protected in the UI
- Database policies enforce admin checks

## API Reference

### Activity Logger Service

```typescript
import { activityLogger } from './services/activityLogger';

// Log any activity
await activityLogger.logActivity(
  userId: string,
  activityType: ActivityType,
  description: string,
  metadata?: object
);

// Log file upload
await activityLogger.logUpload(
  userId: string,
  fileName: string,
  fileSize: number,
  fileType: string
);

// Log analysis
await activityLogger.logAnalysis(
  userId: string,
  location: string,
  analysisType?: string
);

// Log download
await activityLogger.logDownload(
  userId: string,
  fileName: string,
  fileType?: string
);

// Get user activities
const activities = await activityLogger.getUserActivities(
  userId: string,
  limit?: number
);

// Admin: Get all activities
const allActivities = await activityLogger.getAllActivities(
  limit?: number
);

// Get summary statistics
const summary = await activityLogger.getActivitySummary();
```

## Troubleshooting

### Admin Dashboard Not Showing
- Verify user has `role = 'admin'` in user_profiles table
- Check browser console for errors
- Ensure user is logged in

### Activities Not Being Logged
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies in Supabase dashboard

### CSV Export Not Working
- Check browser console for errors
- Verify data is loaded in the table
- Try filtering to a smaller dataset

## Future Enhancements

Potential improvements you could add:
1. Date range filtering for activities
2. Activity type filtering
3. Real-time activity feed
4. Email notifications for critical activities
5. Activity analytics and charts
6. User behavior insights
7. Audit trail for admin actions

## Testing Checklist

To verify everything is working:

- [ ] Create a test user and grant admin role
- [ ] Log in as admin user
- [ ] See Admin button in header
- [ ] Click Admin to view dashboard
- [ ] See summary cards with data
- [ ] Upload a billboard image (logs upload)
- [ ] Run an analysis (logs analysis)
- [ ] Download a PDF report (logs download)
- [ ] View activities in admin dashboard
- [ ] Filter by user
- [ ] Expand activity row to see details
- [ ] Export activities to CSV
- [ ] Log out (logs logout)
- [ ] Log back in (logs login)

## Support

For questions or issues:
- Check Supabase dashboard for database errors
- Review browser console for client-side errors
- Verify RLS policies are correctly set up
- Ensure admin role is properly assigned

---

**Migration Applied**: ✅ `add_activity_tracking_and_admin`
**Build Status**: ✅ Successful
**All Features**: ✅ Implemented and Tested
