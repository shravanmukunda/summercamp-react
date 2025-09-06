// src/components/institution/InstitutionDetail.jsx
import { useState } from 'react';

const InstitutionDetail = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="relative">
          <img 
            src={data.heroImage} 
            alt={data.name} 
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{data.name}</h1>
              <p className="text-lg opacity-90">{data.tagline}</p>
              <div className="flex items-center mt-3">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < Math.floor(data.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-white font-medium">
                  {data.rating} ({data.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{data.totalStudents}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{data.totalInstructors}</p>
            <p className="text-sm text-gray-600">Instructors</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{data.established}</p>
            <p className="text-sm text-gray-600">Established</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'instructors', label: 'Instructors' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'gallery', label: 'Gallery' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About {data.name}</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{data.description}</p>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Why Choose Us?</h3>
                    <ul className="space-y-2">
                      {data.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-3 mt-1">✓</span>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Achievements & Recognition</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.achievements.map((achievement, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-md">
                        <span className="text-blue-700 font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Policies & Guidelines</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(data.policies).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900 capitalize mb-2">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </h4>
                        <p className="text-sm text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-600 mt-1">📍</span>
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">{data.contact.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">📞</span>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a href={`tel:${data.contact.phone}`} className="text-sm text-blue-600 hover:underline">
                          {data.contact.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">✉️</span>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a href={`mailto:${data.contact.email}`} className="text-sm text-blue-600 hover:underline">
                          {data.contact.email}
                        </a>
                      </div>
                    </div>
                    
                    {data.contact.website && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600">🌐</span>
                        <div>
                          <p className="font-medium text-gray-900">Website</p>
                          <a 
                            href={`https://${data.contact.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {data.contact.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Enquire Now
                    </button>
                    <a 
                      href={`tel:${data.contact.phone}`}
                      className="block w-full text-center border border-blue-600 text-blue-600 py-3 px-4 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>

                {/* Timing */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Timing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekdays:</span>
                      <span className="font-medium">{data.timing.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekends:</span>
                      <span className="font-medium">{data.timing.weekends}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Closed:</span>
                      <span className="font-medium text-red-600">{data.timing.closed}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Summary */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Google Rating Summary</h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-yellow-500">
                      {data.rating.toFixed(1)}
                    </div>
                    <div className="flex justify-center text-yellow-400 text-lg mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(data.rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {data.reviewCount} reviews
                    </p>
                  </div>

                  {data.ratingBreakdown && (
                    <div className="space-y-2">
                      {Object.entries(data.ratingBreakdown).reverse().map(([stars, count]) => (
                        <div key={stars} className="flex items-center space-x-2">
                          <span className="text-sm w-8">{stars}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${(count / data.reviewCount) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructors Tab */}
          {activeTab === 'instructors' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Our Expert Instructors</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.instructors.map((instructor, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                    <img 
                      src={instructor.image} 
                      alt={instructor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                    />
                    <h3 className="text-lg font-semibold mb-2">{instructor.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{instructor.specialization}</p>
                    <p className="text-sm text-gray-600 mb-2">{instructor.experience} Experience</p>
                    <p className="text-xs text-gray-500 mb-3">{instructor.qualification}</p>
                    {instructor.bio && (
                      <p className="text-sm text-gray-700 italic">{instructor.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">World-Class Facilities</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.facilities.map((facility, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">{facility.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{facility.name}</h3>
                    <p className="text-sm text-gray-600">{facility.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`${data.name} Gallery ${index + 1}`}
                      className="w-full h-40 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage(index)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-md"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetail;