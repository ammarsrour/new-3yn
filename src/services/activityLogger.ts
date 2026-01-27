import { supabase } from './supabaseAuth';

// Helper to verify current user is admin
async function verifyAdminAccess(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

export type ActivityType =
  | 'page_view'
  | 'upload'
  | 'analysis'
  | 'download'
  | 'login'
  | 'logout'
  | 'location_select';

export type FileAction = 'upload' | 'download';

interface ActivityMetadata {
  [key: string]: any;
}

interface FileMetadata {
  location?: string;
  analysisType?: string;
  [key: string]: any;
}

class ActivityLogger {
  private getUserAgent(): string {
    return navigator.userAgent || 'Unknown';
  }

  async logActivity(
    userId: string,
    activityType: ActivityType,
    description: string,
    metadata: ActivityMetadata = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_description: description,
          metadata,
          user_agent: this.getUserAgent(),
        });

      // Silently fail - activity logging should not interrupt user flow
    } catch {
      // Silently fail - activity logging should not interrupt user flow
    }
  }

  async logFileActivity(
    userId: string,
    fileName: string,
    fileType: string,
    fileSize: number,
    action: FileAction,
    metadata: FileMetadata = {},
    fileUrl?: string,
    storagePath?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_files')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          action,
          metadata,
          file_url: fileUrl,
          storage_path: storagePath,
        });

      // Silently fail - file logging should not interrupt user flow
    } catch {
      // Silently fail - file logging should not interrupt user flow
    }
  }

  async logPageView(userId: string, page: string): Promise<void> {
    await this.logActivity(
      userId,
      'page_view',
      `Viewed ${page}`,
      { page }
    );
  }

  async logUpload(
    userId: string,
    fileName: string,
    fileSize: number,
    fileType: string
  ): Promise<void> {
    await this.logActivity(
      userId,
      'upload',
      `Uploaded file: ${fileName}`,
      { fileName, fileSize, fileType }
    );

    await this.logFileActivity(
      userId,
      fileName,
      fileType,
      fileSize,
      'upload'
    );
  }

  async logAnalysis(
    userId: string,
    location: string,
    analysisType: string = 'billboard'
  ): Promise<void> {
    await this.logActivity(
      userId,
      'analysis',
      `Performed ${analysisType} analysis for ${location}`,
      { location, analysisType }
    );
  }

  async logDownload(
    userId: string,
    fileName: string,
    fileType: string = 'application/pdf',
    fileSize: number = 0,
    fileUrl?: string,
    storagePath?: string
  ): Promise<void> {
    await this.logActivity(
      userId,
      'download',
      `Downloaded file: ${fileName}`,
      { fileName, fileType, fileUrl }
    );

    await this.logFileActivity(
      userId,
      fileName,
      fileType,
      fileSize,
      'download',
      { generatedFile: true },
      fileUrl,
      storagePath
    );
  }

  async logLogin(userId: string, email: string): Promise<void> {
    await this.logActivity(
      userId,
      'login',
      `User logged in: ${email}`,
      { email }
    );
  }

  async logLogout(userId: string): Promise<void> {
    await this.logActivity(
      userId,
      'logout',
      'User logged out',
      {}
    );
  }

  async logLocationSelect(
    userId: string,
    location: string,
    coordinates?: { lat: number; lng: number }
  ): Promise<void> {
    await this.logActivity(
      userId,
      'location_select',
      `Selected location: ${location}`,
      { location, coordinates }
    );
  }

  async getUserActivities(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch {
      return [];
    }
  }

  async getAllActivities(limit: number = 100) {
    try {
      // Server-side admin verification
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const userIds = [...new Set(data.map(a => a.user_id))];
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, company_name')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data.map(activity => ({
        ...activity,
        user_profiles: profileMap.get(activity.user_id) || null
      }));
    } catch {
      return [];
    }
  }

  async getAllFileActivities(limit: number = 100) {
    try {
      // Server-side admin verification
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const userIds = [...new Set(data.map(f => f.user_id))];
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, company_name')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data.map(file => ({
        ...file,
        user_profiles: profileMap.get(file.user_id) || null
      }));
    } catch {
      return [];
    }
  }

  async getActivitySummary() {
    try {
      // Server-side admin verification
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        return { totalActivities: 0, analyses: 0, uploads: 0, downloads: 0 };
      }

      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('activity_type');

      const { data: uploads, error: uploadsError } = await supabase
        .from('user_files')
        .select('action')
        .eq('action', 'upload');

      const { data: downloads, error: downloadsError } = await supabase
        .from('user_files')
        .select('action')
        .eq('action', 'download');

      if (activitiesError || uploadsError || downloadsError) {
        return { totalActivities: 0, analyses: 0, uploads: 0, downloads: 0 };
      }

      const analysisCount = activities?.filter(a => a.activity_type === 'analysis').length || 0;
      const uploadCount = uploads?.length || 0;
      const downloadCount = downloads?.length || 0;

      return {
        totalActivities: activities?.length || 0,
        analyses: analysisCount,
        uploads: uploadCount,
        downloads: downloadCount,
      };
    } catch {
      return {
        totalActivities: 0,
        analyses: 0,
        uploads: 0,
        downloads: 0,
      };
    }
  }
}

export const activityLogger = new ActivityLogger();
