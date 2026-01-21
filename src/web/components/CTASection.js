"use client";

import { useEffect, useState } from "react";
import { Download, ArrowRight, Star } from "lucide-react";
import { detectPlatform, getDownloadUrl } from "@/utils/detectPlatform";

export default function CTASection() {
  const [downloadUrl, setDownloadUrl] = useState("/downloads");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const platform = detectPlatform();
    if (platform) {
      setDownloadUrl(getDownloadUrl(platform));
    }
  }, []);

  const handleDownload = (url) => {
    setDownloading(true);
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <section className="relative py-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-gradient-1 absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl" />
        <div className="hero-gradient-2 absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="relative container mx-auto px-6">
        <div className="animate-fade-in-up max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Download DB Toolkit now and simplify your database workflow
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/downloads"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Download size={20} />
              Download
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="https://github.com/db-toolkit/db-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Star size={20} />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
