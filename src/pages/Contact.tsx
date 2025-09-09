import { useState } from 'react';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('https://formspree.io/f/xrbarovz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        // Reset form on success
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus('success');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <a href="mailto:findmycamp24@gmail.com" className="text-blue-600 hover:underline">
                  findmycamp24@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Phone:</span>
                <a href="tel:+91 8792841557" className="text-blue-600 hover:underline">
                  +91 87928 41557
                </a>
              </div>
              <div className="flex items-start">
                <span className="font-medium mr-2">Address:</span>
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">Thank you! Your message has been sent successfully.</span>
                </div>
              )}
              
              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">Sorry, there was an error sending your message. Please try again.</span>
                </div>
              )}
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;