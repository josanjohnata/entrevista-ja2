import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    lineHeight: 1.6,
  },
  content: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify',
    color: '#000000',
  },
  closing: {
    marginTop: 20,
    marginBottom: 8,
  },
  signature: {
    marginTop: 8,
  },
});

interface PDFCoverLetterProps {
  content: string;
}

export const PDFCoverLetter = ({ content }: PDFCoverLetterProps) => {
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = normalizedContent.split(/\n\s*\n/).filter(p => p.trim());
  
  const processedParagraphs: Array<{ text: string; isClosing: boolean; isSignature: boolean }> = [];

  paragraphs.forEach((paragraph, index) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return;

    const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l);
    const joinedText = lines.join(' ');

    const isClosing = /^(Atenciosamente|Sinceramente|Cordiais saudações|Respeitosamente)/i.test(joinedText);
    const isSignature = index === paragraphs.length - 1 && 
      joinedText.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/) && 
      !isClosing &&
      joinedText.split(' ').length <= 4;

    processedParagraphs.push({
      text: joinedText,
      isClosing,
      isSignature,
    });
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          {processedParagraphs.map((item, index) => {
            if (item.isClosing) {
              return (
                <Text key={index} style={[styles.paragraph, styles.closing]}>
                  {item.text}
                </Text>
              );
            }

            if (item.isSignature) {
              return (
                <Text key={index} style={[styles.paragraph, styles.signature]}>
                  {item.text}
                </Text>
              );
            }

            return (
              <Text key={index} style={styles.paragraph}>
                {item.text}
              </Text>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

