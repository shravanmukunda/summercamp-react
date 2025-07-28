const Packages = () => {
    const packages = [
      {
        name: "Basic Listing",
        price: "₹2,999",
        features: [
          "Basic camp listing",
          "Contact information display",
          "1 photo upload",
          "30-day visibility"
        ]
      },
      {
        name: "Premium Listing",
        price: "₹5,999",
        features: [
          "Featured camp listing",
          "Multiple photo uploads",
          "Detailed description",
          "60-day visibility",
          "Priority support"
        ]
      },
      {
        name: "Elite Package",
        price: "₹9,999",
        features: [
          "Top banner placement",
          "Unlimited photos",
          "Video upload capability",
          "90-day visibility",
          "Dedicated support",
          "Social media promotion"
        ]
      }
    ]
  
    return (
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">List Your Summer Camp</h1>
          <p className="text-xl text-gray-600">Choose the perfect package to showcase your camp</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-center mb-4">{pkg.name}</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-red-600">{pkg.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default Packages
  