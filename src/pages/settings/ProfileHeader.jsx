import { User, Camera, Award } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function ProfileHeader({ user, guideData, isGuide, photoUploading, fileInputRef, onPhotoChange }) {
  return (
    <ScrollReveal delay={50} className="mb-8">
      <div className="card-dark p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-dark-700 border-2 border-gold overflow-hidden">
            {photoUploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
              </div>
            ) : user?.photo || guideData?.profileImage ? (
              <img
                src={user?.photo || guideData?.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-dark-600 text-muted">
                <User size={36} opacity={0.5} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-dark-900 flex items-center justify-center border-2 border-dark-900 group-hover:scale-110 transition-transform shadow-lg"
            title="Change profile photo"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-2xl font-bold text-cream">{user?.name}</h3>
          <p className="text-gold text-sm font-medium flex items-center gap-2 justify-center sm:justify-start mt-1">
            {isGuide ? (
              <> <Award size={14} /> Local Guide Account</>
            ) : (
              <> <User size={14} /> Visitor Account</>
            )}
          </p>
          <p className="text-muted-dark text-xs mt-2">Member since {user?.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}
