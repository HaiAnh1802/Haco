import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnnouncementBar from "../../components/AnnouncementBar";
import { FOOTER_PAGES } from "../../data/footerPages";

export async function generateStaticParams() {
  return Object.keys(FOOTER_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = FOOTER_PAGES[slug];
  if (!page) return { title: "Không tìm thấy trang" };
  return { title: `${page.title} - Haco Cosmetics` };
}

export default async function InfoPage({ params }) {
  const { slug } = await params;
  const page = FOOTER_PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="info-page">
        <div className="info-page__inner">
          {page.group && <p className="info-page__group">{page.group}</p>}
          <h1 className="info-page__title">{page.title}</h1>

          {page.sections.map((sec, i) => (
            <section key={i} className="info-page__section">
              {sec.heading && <h2 className="info-page__heading">{sec.heading}</h2>}
              {sec.paragraphs?.map((p, j) => (
                <p key={j} className="info-page__para">{p}</p>
              ))}
              {sec.bullets && (
                <ul className="info-page__list">
                  {sec.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
              {sec.paragraphsAfter?.map((p, j) => (
                <p key={`after-${j}`} className="info-page__para">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
