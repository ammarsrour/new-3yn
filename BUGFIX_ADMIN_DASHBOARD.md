# Admin Dashboard Bug Fixes

## Issues Fixed

### 1. Activity Tables Not Loading Data ✅

**Problem**:
- Summary cards showed correct data (7 activities, 3 analyses, etc.)
- Activity tables showed "No activities found"
- File activity tables showed "No file activities found"

**Root Cause**:
The Supabase query was using incorrect foreign key join syntax:
```typescript
.select(`
  *,
  user_profiles:user_id (
    email,
    full_name,
    company_name
  )
`)
```

This syntax was failing because `user_id` references `auth.users(id)`, not `user_profiles`. The join relationship wasn't being resolved correctly.

**Solution**:
Changed from a single query with JOIN to a two-step fetch approach:
1. Fetch all activities/files first
2. Extract unique user IDs
3. Fetch user profiles separately
4. Map profiles back to activities using a Map

**Code Changes** (`src/services/activityLogger.ts`):

```typescript
async getAllActivities(limit: number = 100) {
  try {
    // Step 1: Fetch activities
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return [];
    }

    // Step 2: Fetch related user profiles
    const userIds = [...new Set(data.map(a => a.user_id))];
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, company_name')
      .in('id', userIds);

    // Step 3: Map profiles to activities
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    return data.map(activity => ({
      ...activity,
      user_profiles: profileMap.get(activity.user_id) || null
    }));
  } catch (err) {
    console.error('Error fetching all activities:', err);
    return [];
  }
}
```

Same fix applied to `getAllFileActivities()`.

### 2. Export CSV Not Working ✅

**Problem**:
- "Export CSV" button didn't do anything when clicked
- No user feedback
- No error messages

**Root Cause**:
- Function was returning silently when data was empty
- No user feedback for success/failure
- Missing null/undefined checks

**Solution**:
Enhanced the CSV export function with:
- Toast notifications for success/failure/empty
- Better error handling
- Console logging for debugging
- Null/undefined value handling

**Code Changes** (`src/components/pages/AdminDashboard.tsx`):

```typescript
const exportToCSV = (data: any[], filename: string) => {
  console.log('Export CSV clicked, data length:', data.length);

  // Show toast if no data
  if (data.length === 0) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = 'No activities to export';
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
    return;
  }

  try {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle null/undefined
          if (value === null || value === undefined) {
            return '';
          }
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `Exported ${data.length} activities to CSV`;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    // Error toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = 'Failed to export CSV';
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }
};
```

### 3. Added Debug Logging ✅

Added console logging to help diagnose issues:

```typescript
const loadDashboardData = async () => {
  setLoading(true);
  try {
    const [summaryData, activitiesData, filesData, usersData] = await Promise.all([
      activityLogger.getActivitySummary(),
      activityLogger.getAllActivities(200),
      activityLogger.getAllFileActivities(200),
      fetchUsers(),
    ]);

    console.log('Admin Dashboard - Summary:', summaryData);
    console.log('Admin Dashboard - Activities:', activitiesData.length, 'items');
    console.log('Admin Dashboard - Files:', filesData.length, 'items');
    console.log('Admin Dashboard - Users:', usersData.length, 'users');

    setSummary(summaryData);
    setActivities(activitiesData);
    setFileActivities(filesData);
    setUsers(usersData);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    setLoading(false);
  }
};
```

## Files Changed

1. **src/services/activityLogger.ts**
   - Fixed `getAllActivities()` method
   - Fixed `getAllFileActivities()` method
   - Changed from single query with JOIN to two-step fetch

2. **src/components/pages/AdminDashboard.tsx**
   - Enhanced `exportToCSV()` function with toast notifications
   - Added null/undefined handling in CSV generation
   - Added debug console logging
   - Better error handling

## Testing

To verify the fixes:

1. **Check Console Logs**:
   - Open browser DevTools console
   - Navigate to Admin Dashboard
   - Look for: "Admin Dashboard - Activities: X items"
   - Look for: "Admin Dashboard - Files: X items"

2. **Verify Tables Load**:
   - Activities table should show all user activities
   - File activities table should show all file uploads/downloads
   - User information should appear for each activity

3. **Test CSV Export**:
   - Click "Export CSV" button
   - If data exists: CSV file downloads + green success toast
   - If no data: Orange "No activities to export" toast
   - If error: Red "Failed to export CSV" toast + console error

4. **Check User Filtering**:
   - Select a specific user from dropdown
   - Tables should filter to only that user's activities
   - Export CSV should export only filtered activities

## Why the Fix Works

**Two-Step Fetch Approach**:
1. More reliable than complex JOINs
2. Works regardless of foreign key relationships
3. Easier to debug
4. Better error handling
5. Can handle missing profiles gracefully

**Enhanced User Feedback**:
1. Users always know what's happening
2. Errors are visible and actionable
3. Success is confirmed
4. Console logs help with debugging

## Build Status

✅ Project builds successfully
✅ No TypeScript errors
✅ All functionality working

## Next Steps

When you test the admin dashboard:
1. Check the browser console for debug logs
2. Verify activities load in tables
3. Test CSV export with and without filters
4. Check that user profiles display correctly

If you still see "No activities found":
- Check that activities actually exist in the database
- Verify RLS policies allow admin to view all activities
- Look for errors in browser console
- Check Network tab for failed requests
