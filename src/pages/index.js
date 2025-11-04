import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        Hello, I'm Cyril, and I'm currently in my final year at SUTD, studying computer science and design (CSD) with a minor in AI. I'm interested to learn more about cybersecurity, and along the way, I just figured that people exploring the same path as me could perhaps find my notes useful.
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main className="text-center px-4 py-12">
        {/* <HomepageFeatures /> */}
        <Heading as="h2" className="text-3xl hero__subtitle">Work Experiences</Heading>
        I have prior experience as a red team intern, but I also have worked as an ML intern and a web dev software engineer before.

        <br/><br/><Heading as="h3" className="hero__subtitle">Ensign Infosecurity (Aug - Dec 2024)</Heading>
        As a red team intern, I was involved in various penetration testing activities, including network and web application assessments. I collaborated with senior team members to identify vulnerabilities and recommend remediation strategies.<br/>
        I also developed a report automation tool using Python and Javascript, parsing Nessus files and allowing for further customization on the report details through a webapp.<br/>
        The tool streamlined the VAPT process and improved the team's efficiency.<br/>

        <br/><br/><Heading as="h2" className="text-3xl hero__subtitle">Projects</Heading>
        WIP!

        <br/><br/><Heading as="h2" className="text-3xl hero__subtitle">Education</Heading>
        WIP!

        <br/><br/><Heading as="h2" className="text-3xl hero__subtitle">CTFs</Heading>
        WIP!

        <br/><br/><Heading as="h2" className="text-3xl hero__subtitle">Other Awards and Achievements</Heading>
        WIP!
      </main>
    </Layout>
  );
}
