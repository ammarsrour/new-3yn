import { supabase } from './supabaseAuth';

export interface UploadReportResult {
  success: boolean;
  fileUrl?: string;
  storagePath?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export class ReportStorage {
  private readonly bucketName = 'reports';

  async uploadReport(
    userId: string,
    htmlContent: string,
    location: string
  ): Promise<UploadReportResult> {
    try {
      const timestamp = Date.now();
      const sanitizedLocation = location.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
      const fileName = `${timestamp}_${sanitizedLocation}_report.html`;
      const storagePath = `${userId}/${fileName}`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const fileSize = blob.size;

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(storagePath, blob, {
          contentType: 'text/html',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading report to storage:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);

      return {
        success: true,
        fileUrl: publicUrl,
        storagePath,
        fileName,
        fileSize,
      };
    } catch (error) {
      console.error('Error in uploadReport:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteReport(storagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([storagePath]);

      if (error) {
        console.error('Error deleting report:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteReport:', error);
      return false;
    }
  }

  async listUserReports(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(userId);

      if (error) {
        console.error('Error listing reports:', error);
        return [];
      }

      return data?.map(file => `${userId}/${file.name}`) || [];
    } catch (error) {
      console.error('Error in listUserReports:', error);
      return [];
    }
  }

  async downloadReport(fileUrl: string): Promise<void> {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileUrl.split('/').pop() || 'report.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  async bulkDownloadReports(fileUrls: string[]): Promise<void> {
    try {
      for (const fileUrl of fileUrls) {
        await this.downloadReport(fileUrl);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error in bulk download:', error);
      throw error;
    }
  }
}

export const reportStorage = new ReportStorage();
