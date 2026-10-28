import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getGuideBySlug, getAllGuides } from "@/lib/guides";
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Share2,
} from "lucide-react";

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const resolvedParams = await params;
  const guide = getGuideBySlug(resolvedParams.slug);

  if (!guide) {
    notFound();
  }

  const allGuides = getAllGuides();
  const otherGuides = allGuides.filter((g) => g.slug !== guide.slug).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1">
        {/* Article Header & Navigation */}
        <section className="bg-white border-b border-slate-200 pt-10 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/guides"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1769E0] hover:text-[#1255B8] mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Guides</span>
            </Link>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1769E0] bg-[#E8F2FF] px-3 py-1 rounded-full">
                  {guide.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{guide.readTime}</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Published {guide.publishedDate}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F33] tracking-tight leading-tight">
                {guide.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {guide.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Editorial Photo */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="relative aspect-16/9 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900">
            <Image
              src={guide.image}
              alt={guide.imageAlt}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Main Article Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Lead Paragraph */}
          <div className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium border-l-4 border-[#1769E0] pl-4 sm:pl-6 my-6 italic bg-white p-4 rounded-r-xl shadow-2xs">
            {guide.content.leadParagraph}
          </div>

          {/* Body Sections */}
          <div className="space-y-10 mt-8">
            {guide.content.sections.map((sec, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F33] tracking-tight">
                  {sec.heading}
                </h2>

                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {p}
                  </p>
                ))}

                {/* Key Points Bullet List */}
                {sec.keyPoints && sec.keyPoints.length > 0 && (
                  <div className="my-4 bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1769E0] block mb-2">
                      Key Takeaways
                    </span>
                    <ul className="space-y-2">
                      {sec.keyPoints.map((pt, ptIdx) => (
                        <li key={ptIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#107A47] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Callout box */}
                {sec.callout && (
                  <div
                    className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm leading-relaxed my-4 flex items-start space-x-3.5 ${
                      sec.callout.type === "warning"
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : sec.callout.type === "tip"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-[#E8F2FF] border-[#1769E0]/30 text-slate-800"
                    }`}
                  >
                    {sec.callout.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    ) : sec.callout.type === "tip" ? (
                      <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold block mb-0.5">{sec.callout.title}</span>
                      <span>{sec.callout.body}</span>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Article Regulatory Disclaimer */}
          <div className="mt-12 p-5 bg-white border border-slate-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-500 leading-relaxed shadow-xs">
            <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0B1F33]">Editorial Note: </span>
              {guide.content.disclaimer}
            </div>
          </div>

          {/* Action CTA inside article */}
          <div className="mt-10 p-8 bg-[#0B1F33] text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold">
                Ready to organize your travel documentation?
              </h3>
              <p className="text-xs text-slate-300">
                Generate an A4 flight itinerary or temporary reservation with transparent terms.
              </p>
            </div>
            <Link
              href="/create"
              className="shrink-0 px-6 py-3 bg-[#1769E0] hover:bg-[#1255B8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Create Itinerary
            </Link>
          </div>
        </article>

        {/* Related Guides Section */}
        {otherGuides.length > 0 && (
          <section className="bg-white border-t border-slate-200 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-[#0B1F33] mb-6">
                Related Travel Guides
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherGuides.map((og) => (
                  <Link
                    key={og.slug}
                    href={`/guides/${og.slug}`}
                    className="p-5 rounded-2xl bg-[#F8FAFC] hover:bg-[#E8F2FF]/40 border border-slate-200 hover:border-[#1769E0] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#1769E0] uppercase tracking-wider">
                        {og.category}
                      </span>
                      <h4 className="text-base font-bold text-[#0B1F33] group-hover:text-[#1769E0] transition-colors mt-1">
                        {og.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {og.subtitle}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#1769E0]">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
