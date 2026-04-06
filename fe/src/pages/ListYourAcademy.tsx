import { useState } from 'react';

import { ApiError, submitListingApplication } from '../utils/api';
import { CATEGORIES, CITIES } from '../utils/constants';

function parseFacilitiesLines(text: string): string[] {
  return text
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const ListYourAcademy: React.FC = () => {
  const [academyName, setAcademyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('sports');
  const [dateEstablished, setDateEstablished] = useState('');
  const [address, setAddress] = useState('');
  const [facilitiesText, setFacilitiesText] = useState('');
  const [message, setMessage] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorDetail(null);
    setSuccessMessage(null);

    const facilities = parseFacilitiesLines(facilitiesText);
    if (facilities.length === 0) {
      setErrorDetail('Please list at least one facility (one per line).');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await submitListingApplication({
        academy_name: academyName,
        contact_name: contactName,
        email,
        phone,
        city,
        category,
        date_established: dateEstablished,
        address,
        facilities,
        message: message || null,
        website_url: websiteUrl || null,
      });
      setSuccessMessage(res.message);
      setSubmitStatus('success');
      setAcademyName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setCity('');
      setCategory('sports');
      setDateEstablished('');
      setAddress('');
      setFacilitiesText('');
      setMessage('');
      setWebsiteUrl('');
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Something went wrong.';
      setErrorDetail(msg);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-4">List your academy</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Tell us about your camp or academy. We&apos;ll review your application and get back to you, usually within 12
        hours.
      </p>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded relative">
              <span className="block sm:inline">{successMessage ?? 'Application received.'}</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">
                {errorDetail ?? 'Could not submit your application. Please try again.'}
              </span>
            </div>
          )}

          <div>
            <label htmlFor="academy_name" className="block text-sm font-medium text-gray-700 mb-1">
              Academy / camp name <span className="text-red-500">*</span>
            </label>
            <input
              id="academy_name"
              type="text"
              required
              value={academyName}
              onChange={(e) => setAcademyName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Elite Sports Academy"
            />
          </div>

          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              id="contact_name"
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              placeholder="Contact person"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                placeholder="+91 …"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="date_established" className="block text-sm font-medium text-gray-700 mb-1">
              Date established <span className="text-red-500">*</span>
            </label>
            <input
              id="date_established"
              type="date"
              required
              value={dateEstablished}
              onChange={(e) => setDateEstablished(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Full address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              placeholder="Street, area, landmark, PIN…"
            />
          </div>

          <div>
            <label htmlFor="facilities" className="block text-sm font-medium text-gray-700 mb-1">
              Facilities <span className="text-red-500">*</span>
            </label>
            <textarea
              id="facilities"
              required
              rows={5}
              value={facilitiesText}
              onChange={(e) => setFacilitiesText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              placeholder={'One facility per line, e.g.\nSwimming pool\nIndoor courts\nParking'}
            />
            <p className="text-xs text-gray-500 mt-1">List at least one; use one line per facility.</p>
          </div>

          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">
              Website (optional)
            </label>
            <input
              id="website_url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              placeholder="https://…"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message (optional)
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              placeholder="Anything else we should know?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting…
              </>
            ) : (
              'Submit application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListYourAcademy;
