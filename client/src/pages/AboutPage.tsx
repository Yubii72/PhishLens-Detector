import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { InfoSections } from "../components/InfoSections";

export function AboutPage() {
  return (
    <>
      <Header active="about" />
      <main className="page-wrap">
        <div className="dashboard">
          <img className="about-logo" src="/logo.png" alt="PhishLens logo" />
          <h1 className="page-heading">About <span>PhishLens.</span></h1>
          <p className="page-subhead">What the analyzer looks at, what it never does, and answers to common questions.</p>
        </div>
        <InfoSections />
      </main>
      <Footer />
    </>
  );
}