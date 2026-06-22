export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              KOLO SEO Genius AI
            </span>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              AI-powered website auditing and SEO analysis platform for modern digital marketers.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">SEO Audit</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Competitor Analysis</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} KOLO SEO Genius AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
