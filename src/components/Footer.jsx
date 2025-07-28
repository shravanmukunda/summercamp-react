const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-start ml-2 mb-8">
            <a href="packages.html">
              <button className="bg-red-600 text-white font-roboto py-2 px-4 border-none rounded cursor-pointer mb-2">
                List Your Camp
              </button>
            </a>
            <p>Promote Your Academy or Summer Camp by clicking the above Button!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-5">
            <div>
              <h2 className="text-xl mb-2 border-b-2 border-white inline-block">
                Quick Links for Summer Camps
              </h2>
              <ul className="list-none p-0">
                <li className="my-2">
                  <a href="#" className="text-white hover:text-red-200 transition-colors">Home</a>
                </li>
                <li className="my-2">
                  <a href="contact.html" className="text-white hover:text-red-200 transition-colors">Contact</a>
                </li>
                <li className="my-2">
                  <a href="blog.html" className="text-white hover:text-red-200 transition-colors">Read Our Blog</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl mb-2 border-b-2 border-white inline-block">
                Follow Us
              </h2>
              <div className="mt-2">
                <a href="#" className="inline-block mr-2">
                  <img src="/facebook.svg" alt="Facebook" className="w-8 hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="inline-block mr-2">
                  <img src="/instagram.svg" alt="Instagram" className="w-8 hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="ml-5 mt-8">
            <h1>Best Summer Camps in Bangalore©</h1>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  