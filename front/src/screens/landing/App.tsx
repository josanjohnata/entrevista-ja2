import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../GlobalStyles';
import { theme } from '../../GlobalStyles';

import { Navbar } from '../../components/sections/Navbar';
import { Hero } from '../../components/sections/Hero';
import { Features } from '../../components/sections/Features';
import { Extension } from '../../components/sections/Extension';
import { FinalCTA } from '../../components/sections/FinalCTA';
import { Footer } from '../../components/sections/Footer';

export default function LandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Extension />
        <FinalCTA />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
