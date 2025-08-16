const InstitutionDetail = ({ data }) => (
  <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
    {/* LEFT */}
    <article>
      <img src={data.banner} alt={data.name} className="rounded-lg" />

      <h1 className="mt-6 text-3xl font-bold">{data.name}</h1>
      <p className="text-gray-600 mt-2">{data.description}</p>

      {/* courses */}
      <h2 className="mt-8 text-2xl font-semibold">Courses Offered</h2>
      <ul className="mt-3 space-y-2">
        {data.courses.map((c) => (
          <li
            key={c.id}
            className="border p-4 rounded-md flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-gray-500">{c.duration}</p>
            </div>
            <span className="font-semibold text-blue-600">
              ₹{c.fee.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </article>

    {/* RIGHT */}
    <aside className="space-y-6">
      <div className="border p-5 rounded-md shadow">
        <h3 className="text-xl font-semibold">Contact</h3>
        <p className="mt-2">{data.address}</p>
        <p className="text-sm text-gray-500">{data.phone}</p>
        <a
          href={`mailto:${data.email}`}
          className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-md"
        >
          Send Email
        </a>
      </div>

      <div className="border p-5 rounded-md shadow">
        <h3 className="text-xl font-semibold">Rating</h3>
        <p className="text-3xl font-bold text-yellow-500">
          {data.rating.toFixed(1)} / 5
        </p>
        <p className="text-sm text-gray-600">{data.reviewCount} reviews</p>
      </div>
    </aside>
  </section>
);

export default InstitutionDetail;
