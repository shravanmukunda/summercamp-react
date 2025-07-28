const Contact = () => {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <span>info@mysummercamp.com</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span>
                  <span>+91 XXXXXXXXXX</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">Address:</span>
                  <span>Bangalore, Karnataka, India</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Contact
  