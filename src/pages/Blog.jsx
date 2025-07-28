const Blog = () => {
    const blogPosts = [
      {
        id: 1,
        title: "Sports1 Summer Camp, Hosakerehalli, Bangalore – Best to Cultivate your kids different talents",
        excerpt: "Located in Hosakerehalli, Bangalore. This is a golden opportunity for your child to Explore Sports and Cultural activities on one platform...",
        date: "March 15, 2025",
        readTime: "5 min read"
      }
      // Add more blog posts here
    ]
  
    return (
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Summer Camp Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <button className="mt-4 text-red-600 font-medium hover:text-red-700">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    )
  }
  
  export default Blog
  