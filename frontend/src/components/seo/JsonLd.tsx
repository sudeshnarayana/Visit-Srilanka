interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders a schema.org object as a <script type="application/ld+json"> tag. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
