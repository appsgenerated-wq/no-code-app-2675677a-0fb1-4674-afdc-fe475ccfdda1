import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, discoveries, onLogout, onLoadDiscoveries, onCreateDiscovery, onDeleteDiscovery }) => {
  const [newDiscovery, setNewDiscovery] = useState({ title: '', content: '', category: 'Physics' });
  const [lunarPhotoFile, setLunarPhotoFile] = useState(null);

  useEffect(() => {
    onLoadDiscoveries();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setLunarPhotoFile(e.target.files[0]);
    }
  }

  const handleCreateDiscovery = async (e) => {
    e.preventDefault();
    const discoveryPayload = {
      ...newDiscovery,
      discoveryDate: new Date().toISOString(),
      ...(lunarPhotoFile && { lunarPhoto: lunarPhotoFile })
    }
    await onCreateDiscovery(discoveryPayload);
    setNewDiscovery({ title: '', content: '', category: 'Physics' });
    setLunarPhotoFile(null);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lunar Journal</h1>
            <p className="text-sm text-gray-500">Welcome, Sir {user.name}!</p>
          </div>
          <div className="flex items-center gap-x-4">
             <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                Admin Panel
              </a>
            <button
              onClick={onLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Log a New Discovery</h2>
              <form onSubmit={handleCreateDiscovery} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g., The Nature of Lunar Gravity"
                    value={newDiscovery.title}
                    onChange={(e) => setNewDiscovery({ ...newDiscovery, title: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    id="content"
                    placeholder="My observations on..."
                    value={newDiscovery.content}
                    onChange={(e) => setNewDiscovery({ ...newDiscovery, content: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select id="category" value={newDiscovery.category} onChange={(e) => setNewDiscovery({...newDiscovery, category: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Physics</option>
                    <option>Astronomy</option>
                    <option>Geology</option>
                    <option>Philosophy</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="lunar-photo" className="block text-sm font-medium text-gray-700">Lunar Photograph</label>
                  <input id="lunar-photo" type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition-colors">Record Discovery</button>
              </form>
            </div>
          </div>

          {/* Discoveries List Column */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recorded Discoveries</h2>
            <div className="space-y-4">
              {discoveries.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No discoveries logged yet. The moon awaits your genius.</p>
              ) : (
                discoveries.map(discovery => (
                  <div key={discovery.id} className="bg-white p-5 rounded-lg shadow-md relative">
                    {discovery.lunarPhoto && (
                        <img src={discovery.lunarPhoto.thumbnail.url} alt={discovery.title} className="w-full h-48 object-cover rounded-t-lg mb-4" />
                    )}
                    <div className="flex justify-between items-start">
                        <div>
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800`}>
                             {discovery.category}
                           </span>
                           <h3 className="text-lg font-bold text-gray-900 mt-2">{discovery.title}</h3>
                        </div>
                        {user.id === discovery.owner.id && (
                            <button onClick={() => onDeleteDiscovery(discovery.id)} className='text-gray-400 hover:text-red-500'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </button>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm mt-2" dangerouslySetInnerHTML={{ __html: discovery.content }}></p>
                    <p className="text-xs text-gray-400 mt-4">Discovered on {new Date(discovery.discoveryDate).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
