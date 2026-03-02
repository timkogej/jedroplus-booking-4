export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">
          The booking page you&apos;re looking for doesn&apos;t exist. Please check the link and try again.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-indigo-500 text-white rounded-2xl font-semibold text-sm hover:bg-indigo-600 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
