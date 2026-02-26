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
  | 'analysis_complete'
  | 'analysis_failed'
  | 'download'
  | 'login'
  | 'logout'
  | 'signup'
  | 'location_select';

export type AdminActionType =
  | 'view_dashboard'
  | 'view_activities'
  | 'export_csv'
  | 'bulk_download'
  | 'filter_user'
  | 'view_user_detail';

export interface AnalysisMetadata {
  analysisId?: string;
  score: number;
  location: string;
  criticalIssuesCount: number;
  fontScore?: number;
  contrastScore?: number;
  layoutScore?: number;
  ctaScore?: number;
}

export interface ActivityFilterOptions {
  startDate?: Date;
  endDate?: Date;
  activityTypes?: ActivityType[];
  userId?: string;
}

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

  async logSignup(
    userId: string,
    email: string,
    name: string,
    company?: string
  ): Promise<void> {
    await this.logActivity(
      userId,
      'signup',
      `New user registered: ${email}`,
      { email, name, company }
    );
  }

  async logAnalysisComplete(
    userId: string,
    analysisData: AnalysisMetadata
  ): Promise<void> {
    await this.logActivity(
      userId,
      'analysis_complete',
      `Analysis completed with score ${analysisData.score} for ${analysisData.location}`,
      analysisData
    );
  }

  async logAnalysisFailed(
    userId: string,
    location: string,
    errorMessage: string
  ): Promise<void> {
    await this.logActivity(
      userId,
      'analysis_failed',
      `Analysis failed for ${location}: ${errorMessage}`,
      { location, errorMessage }
    );
  }

  async logAdminAction(
    adminId: string,
    actionType: AdminActionType,
    targetUserId?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_audit_log')
        .insert({
          admin_id: adminId,
          action_type: actionType,
          target_user_id: targetUserId || null,
          metadata,
        });

      // Silently fail - admin logging should not interrupt flow
    } catch {
      // Silently fail
    }
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

  async getAllActivities(limit: number = 100, options?: ActivityFilterOptions) {
    try {
      // Server-side admin verification
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        return [];
      }

      let query = supabase
        .from('user_activities')
        .select('*');

      // Apply filters if provided
      if (options?.userId) {
        query = query.eq('user_id', options.userId);
      }

      if (options?.activityTypes && options.activityTypes.length > 0) {
        query = query.in('activity_type', options.activityTypes);
      }

      if (options?.startDate) {
        query = query.gte('created_at', options.startDate.toISOString());
      }

      if (options?.endDate) {
        query = query.lte('created_at', options.endDate.toISOString());
      }

      const { data, error } = await query
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

  async getAllFileActivities(limit: number = 100, options?: ActivityFilterOptions) {
    try {
      // Server-side admin verification
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        return [];
      }

      let query = supabase
        .from('user_files')
        .select('*');

      // Apply filters if provided
      if (options?.userId) {
        query = query.eq('user_id', options.userId);
      }

      if (options?.startDate) {
        query = query.gte('created_at', options.startDate.toISOString());
      }

      if (options?.endDate) {
        query = query.lte('created_at', options.endDate.toISOString());
      }

      const { data, error } = await query
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

  async getActivitySummary(options?: { startDate?: Date; endDate?: Date }) {
    try {
      // Server-side admin verification
      const isAdmin = await verifyAdminAccess();
      if (!isAdmin) {
        return {
          totalActivities: 0,
          analyses: 0,
          uploads: 0,
          downloads: 0,
          logins: 0,
          signups: 0,
          activeUsers: 0,
          failedAnalyses: 0
        };
      }

      let activitiesQuery = supabase
        .from('user_activities')
        .select('activity_type, user_id');

      let uploadsQuery = supabase
        .from('user_files')
        .select('action')
        .eq('action', 'upload');

      let downloadsQuery = supabase
        .from('user_files')
        .select('action')
        .eq('action', 'download');

      // Apply date filters if provided
      if (options?.startDate) {
        const startStr = options.startDate.toISOString();
        activitiesQuery = activitiesQuery.gte('created_at', startStr);
        uploadsQuery = uploadsQuery.gte('created_at', startStr);
        downloadsQuery = downloadsQuery.gte('created_at', startStr);
      }

      if (options?.endDate) {
        const endStr = options.endDate.toISOString();
        activitiesQuery = activitiesQuery.lte('created_at', endStr);
        uploadsQuery = uploadsQuery.lte('created_at', endStr);
        downloadsQuery = downloadsQuery.lte('created_at', endStr);
      }

      const [activitiesRes, uploadsRes, downloadsRes] = await Promise.all([
        activitiesQuery,
        uploadsQuery,
        downloadsQuery
      ]);

      if (activitiesRes.error || uploadsRes.error || downloadsRes.error) {
        return {
          totalActivities: 0,
          analyses: 0,
          uploads: 0,
          downloads: 0,
          logins: 0,
          signups: 0,
          activeUsers: 0,
          failedAnalyses: 0
        };
      }

      const activities = activitiesRes.data || [];
      const analysisCount = activities.filter(a => a.activity_type === 'analysis' || a.activity_type === 'analysis_complete').length;
      const loginCount = activities.filter(a => a.activity_type === 'login').length;
      const signupCount = activities.filter(a => a.activity_type === 'signup').length;
      const failedAnalysesCount = activities.filter(a => a.activity_type === 'analysis_failed').length;
      const uniqueUsers = new Set(activities.map(a => a.user_id));

      return {
        totalActivities: activities.length,
        analyses: analysisCount,
        uploads: uploadsRes.data?.length || 0,
        downloads: downloadsRes.data?.length || 0,
        logins: loginCount,
        signups: signupCount,
        activeUsers: uniqueUsers.size,
        failedAnalyses: failedAnalysesCount
      };
    } catch {
      return {
        totalActivities: 0,
        analyses: 0,
        uploads: 0,
        downloads: 0,
        logins: 0,
        signups: 0,
        activeUsers: 0,
        failedAnalyses: 0
      };
    }
  }
}

export const activityLogger = new ActivityLogger();
