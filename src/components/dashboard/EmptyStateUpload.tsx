import React from 'react';
import { Upload, Eye, Target, FileText } from 'lucide-react';

interface EmptyStateUploadProps {
  isNewUser?: boolean;
}

const EmptyStateUpload: React.FC<EmptyStateUploadProps> = ({ isNewUser = false }) => {
  if (!isNewUser) {
    return null;
  }

  return (
    <div className="bg-surface-50 border border-surface-200 p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-white flex items-center justify-center flex-shrink-0">
          <Eye className="w-5 h-5 text-navy-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-navy-950 mb-1">
            How It Works
          </h3>
          <p className="text-secondary text-sm mb-4">
            Upload any billboard design and get instant feedback on how readable it will be for drivers at highway speeds.
          </p>

          {/* What you'll get */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white flex items-center justify-center flex-shrink-0">
                <Target className="w-3.5 h-3.5 text-navy-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-950">Readability Score</p>
                <p className="text-xs text-secondary">0-100 score based on font, contrast, and layout</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white flex items-center justify-center flex-shrink-0">
                <FileText className="w-3.5 h-3.5 text-navy-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-950">Specific Issues</p>
                <p className="text-xs text-secondary">Critical and minor issues with fix suggestions</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white flex items-center justify-center flex-shrink-0">
                <Eye className="w-3.5 h-3.5 text-navy-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-950">Distance Preview</p>
                <p className="text-xs text-secondary">See how it looks from 50m, 100m, and 150m</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateUpload;
