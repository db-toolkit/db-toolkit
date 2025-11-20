import { DocData } from '../data';

interface DocContentProps {
  data: DocData;
}

export default function DocContent({ data }: DocContentProps) {
  return (
    <main className="doc-content">
      <h1>{data.title}</h1>
      {data.sections.map((section, index) => (
        <section key={index} className="doc-section">
          <h2>{section.heading}</h2>
          <div className="content">
            {section.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
