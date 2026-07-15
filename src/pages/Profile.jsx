// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Profile = () => {
//   const { user, updateProfile, updateProfilePicture, logout } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     phone: user?.phone || '',
//     street: user?.address?.street || '',
//     city: user?.address?.city || '',
//     state: user?.address?.state || '',
//     pincode: user?.address?.pincode || ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     const address = {
//       street: formData.street,
//       city: formData.city,
//       state: formData.state,
//       pincode: formData.pincode
//     };

//     const result = await updateProfile({
//       name: formData.name,
//       phone: formData.phone,
//       address
//     });

//     if (result.success) {
//       setSuccess('Profile updated successfully!');
//     } else {
//       setError(result.error);
//     }
//     setLoading(false);
//   };

//   const handleProfilePicture = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     // Convert to base64
//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       const result = await updateProfilePicture(reader.result);
//       if (result.success) {
//         setSuccess('Profile picture updated!');
//       } else {
//         setError(result.error);
//       }
//       setLoading(false);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-gray-500">Please log in to view your profile.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-12 max-w-3xl">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-thin tracking-widest text-gray-800">My Profile</h1>
//         <button
//           onClick={handleLogout}
//           className="text-xs text-red-500 hover:text-red-700 transition px-4 py-2 border border-red-200 rounded-full"
//         >
//           LOGOUT
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
//         {/* Profile Picture */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative">
//             <img
//               src={user.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=000000&color=ffffff&size=128'}
//               alt={user.name}
//               className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
//             />
//             <label className="absolute bottom-0 right-0 bg-black text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-gray-800">
//               📷
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfilePicture}
//                 className="hidden"
//               />
//             </label>
//           </div>
//           <p className="text-sm font-medium text-gray-800 mt-2">{user.name}</p>
//           <p className="text-xs text-gray-400">{user.email}</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-200">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 border border-green-200">
//             {success}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Phone</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Street Address</label>
//               <input
//                 type="text"
//                 name="street"
//                 value={formData.street}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">City</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">State</label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Pincode</label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full mt-6 py-3 rounded-full text-white text-sm tracking-widest transition ${
//               loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
//             }`}
//           >
//             {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, updateProfilePicture, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 Image compression function
  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, or WebP).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB. Please compress your image.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // 🔥 Compress image before upload
      const compressedImage = await compressImage(file, 400, 400, 0.8);
      const result = await updateProfilePicture(compressedImage);
      if (result.success) {
        setSuccess('Profile picture updated successfully!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(result.error || 'Failed to update profile picture.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const address = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    };

    const result = await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address
    });

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(result.error || 'Failed to update profile.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If no user (shouldn't happen due to ProtectedRoute, but just in case)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  // Order stats (count from user data, but we don't have it, we can fetch from orders)
  // We'll keep it simple for now - show member since

  return (
    <>
      <Helmet>
        <title>Aether – My Profile</title>
        <meta name="description" content="Manage your Aether profile – update personal details and preferences." />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8 relative overflow-hidden font-sans">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/30 shadow-royal mb-6 flex flex-wrap justify-between items-center gap-4">
            <h1 className="font-serif text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0]">
              My Profile
            </h1>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 transition px-4 py-2 border border-red-900/30 rounded-full hover:border-red-400 hover:bg-red-900/20"
            >
              LOGOUT
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/20 border border-green-800 text-green-300 text-sm p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Profile Card */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/30 shadow-royal">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/10">
                  <img
                    src={previewUrl || user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d4af37&color=050505&size=128`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profilePicInput"
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black text-xs p-1.5 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-[#d4af37]/30"
                >
                  📷
                </label>
                <input
                  id="profilePicInput"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleProfilePicture}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <p className="text-sm font-medium text-gray-200 mt-2">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
              {uploading && (
                <p className="text-xs text-[#d4af37] mt-1 animate-pulse">Uploading...</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                    placeholder="Street, building, landmark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                    placeholder="110001"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-3 rounded-full font-semibold text-sm tracking-widest transition ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]'
                }`}
              >
                {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
              </button>
            </form>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-[#d4af37]/20">
              <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3">Quick Links</h3>
              <div className="flex flex-wrap gap-4">
                <Link to="/orders" className="text-xs text-gray-300 hover:text-[#d4af37] transition">
                  📦 My Orders
                </Link>
                <Link to="/cart" className="text-xs text-gray-300 hover:text-[#d4af37] transition">
                  🛒 My Cart
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-300 hover:text-red-400 transition"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;