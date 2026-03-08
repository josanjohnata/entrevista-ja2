import { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import * as S from './ErrorBoundary.styles';

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <S.ErrorContainer>
          <S.ScanBeam />
          <S.NoiseOverlay />

          {/* Fox logo — corrupted error state */}
          <S.FoxLogoSection>
            <S.CorruptedOrbitRing />
            <S.CorruptedOrbitRingInner />
            <S.FoxSvgWrapper>
              <svg
                width="80"
                height="80"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="foxErrorGrad" x1="10" y1="8" x2="54" y2="58">
                    <stop offset="0%" stopColor="#FF5500" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#cc4400" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="foxErrorEar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5500" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FF5500" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="foxErrorMask" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Fox body outline */}
                <path
                  d="M 10 8 L 24 26 L 32 20 L 40 26 L 54 8 L 50 42 L 32 58 L 14 42 Z"
                  fill="url(#foxErrorGrad)"
                  stroke="rgba(255, 85, 0, 0.2)"
                  strokeWidth="0.5"
                />

                {/* Mask / inner face */}
                <path
                  d="M 25 33 L 32 52 L 39 33 L 32 27 Z"
                  fill="url(#foxErrorMask)"
                  opacity="0.85"
                />

                {/* Left ear detail */}
                <path
                  d="M 12 12 L 20 24 L 18 16 Z"
                  fill="url(#foxErrorEar)"
                  opacity="0.6"
                />

                {/* Right ear detail */}
                <path
                  d="M 52 12 L 44 24 L 46 16 Z"
                  fill="url(#foxErrorEar)"
                  opacity="0.6"
                />

                {/* Nose */}
                <path
                  d="M 30 44 L 32 47 L 34 44 Z"
                  fill="rgba(255, 85, 0, 0.5)"
                />

                {/* Error X slash — left */}
                <S.FoxErrorSlash x1="22" y1="28" x2="28" y2="36" />
                {/* Error X slash — right */}
                <S.FoxErrorSlash x1="36" y1="28" x2="42" y2="36" />
              </svg>
            </S.FoxSvgWrapper>
          </S.FoxLogoSection>

          {/* Text content */}
          <S.ContentWrapper>
            <S.ErrorBadge>runtime exception</S.ErrorBadge>

            <S.ErrorTitle>
              {t('errorBoundary.title')}
            </S.ErrorTitle>

            <S.ErrorSubtitle>
              {t('errorBoundary.viewDetails')}
            </S.ErrorSubtitle>

            <S.GlitchDivider />

            {/* Error details — glassmorphic terminal */}
            <S.DetailsPanel>
              <S.DetailsSummary>
                {t('errorBoundary.error')}
              </S.DetailsSummary>

              <S.DetailsContent>
                <S.ErrorMessageBox>
                  {this.state.error && this.state.error.toString()}
                </S.ErrorMessageBox>

                {this.state.error?.stack && (
                  <>
                    <S.StackLabel>{t('errorBoundary.stack')}</S.StackLabel>
                    <S.StackTrace>{this.state.error.stack}</S.StackTrace>
                  </>
                )}

                {this.state.errorInfo && (
                  <>
                    <S.StackLabel>{t('errorBoundary.componentStack')}</S.StackLabel>
                    <S.StackTrace>
                      {this.state.errorInfo.componentStack}
                    </S.StackTrace>
                  </>
                )}
              </S.DetailsContent>
            </S.DetailsPanel>

            {/* Reload CTA */}
            <S.ReloadButton onClick={() => window.location.reload()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              {t('errorBoundary.reloadPage')}
            </S.ReloadButton>
          </S.ContentWrapper>

          <S.FooterHint>
            FoxApply &bull; Error Boundary
          </S.FooterHint>
        </S.ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
