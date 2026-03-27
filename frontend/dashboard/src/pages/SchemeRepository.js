import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, X, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getSchemes, searchSchemes } from '../services/api';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(2, 6, 23, 0.52)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 1200,
};

const panelStyle = {
  width: 'min(560px, 100%)',
  height: '100%',
  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%)',
  borderLeft: '1px solid rgba(251, 146, 60, 0.25)',
  boxShadow: '-24px 0 60px rgba(2, 6, 23, 0.35)',
  color: '#f8fafc',
  backdropFilter: 'blur(18px)',
  padding: '32px',
  overflowY: 'auto',
};

const SchemeRepository = ({ onViewImpact }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSchemes = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = searchQuery.trim() ? await searchSchemes(searchQuery) : await getSchemes();
        if (isMounted) {
          setSchemes(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(t('schemeRepositoryError'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(loadSchemes, searchQuery.trim() ? 200 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, t]);

  const schemeCountLabel = useMemo(
    () => t('schemeCountLabel').replace('{{count}}', String(schemes.length)),
    [schemes.length, t],
  );

  const handleImpactView = () => {
    if (!selectedScheme) return;
    onViewImpact(selectedScheme);
    navigate('/');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1500px', margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #172554 55%, #1e293b 100%)',
          borderRadius: '28px',
          padding: '28px',
          color: '#f8fafc',
          marginBottom: '24px',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(251, 146, 60, 0.18)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'rgba(251, 146, 60, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={28} color="#fb923c" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{t('pageSchemeRepository')}</h1>
            <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '1rem' }}>{t('schemeRepositorySubtitle')}</p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '14px 18px',
          }}
        >
          <Search size={20} color="#fb923c" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('schemeRepositorySearchPlaceholder')}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#f8fafc',
              width: '100%',
              fontSize: '1rem',
            }}
          />
        </div>

        <p style={{ margin: '14px 0 0 0', color: '#fdba74', fontWeight: 600 }}>{schemeCountLabel}</p>
      </div>

      {isLoading && <div className="gov-card">{t('loading')}</div>}
      {!isLoading && error && <div className="gov-card" style={{ color: '#b91c1c' }}>{error}</div>}

      {!isLoading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {schemes.map((scheme) => (
            <article
              key={scheme.id}
              style={{
                background: '#ffffff',
                borderRadius: '22px',
                padding: '22px',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    background: '#fff7ed',
                    color: '#c2410c',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                  }}
                >
                  {t(scheme.category)}
                </span>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', lineHeight: 1.45 }}>{scheme.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedScheme(scheme)}
                style={{
                  marginTop: '18px',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t('viewDetails')}
              </button>
            </article>
          ))}
        </div>
      )}

      {!isLoading && !error && schemes.length === 0 && (
        <div className="gov-card">{t('schemeRepositoryEmpty')}</div>
      )}

      {selectedScheme && (
        <div style={overlayStyle} onClick={() => setSelectedScheme(null)}>
          <div style={panelStyle} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <p style={{ margin: 0, color: '#fdba74', fontWeight: 700 }}>{t(selectedScheme.category)}</p>
                <h2 style={{ margin: '8px 0 0 0', fontSize: '1.8rem', lineHeight: 1.35 }}>{selectedScheme.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <section style={{ marginBottom: '22px' }}>
              <h3 style={{ marginBottom: '8px' }}>{t('schemeDescriptionTitle')}</h3>
              <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.7 }}>{selectedScheme.description}</p>
            </section>

            <section style={{ marginBottom: '22px' }}>
              <h3 style={{ marginBottom: '8px' }}>{t('schemeEligibilityTitle')}</h3>
              <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.7 }}>{selectedScheme.eligibility}</p>
            </section>

            <section style={{ marginBottom: '26px' }}>
              <h3 style={{ marginBottom: '8px' }}>{t('schemeWorkingTitle')}</h3>
              <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.7 }}>{selectedScheme.working_process}</p>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h3 style={{ marginBottom: '10px' }}>{t('schemeTargetDistrictsTitle')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {selectedScheme.target_districts.map((district) => (
                  <span
                    key={district}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '999px',
                      background: 'rgba(251, 146, 60, 0.14)',
                      border: '1px solid rgba(251, 146, 60, 0.25)',
                      color: '#fed7aa',
                    }}
                  >
                    {district}
                  </span>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={handleImpactView}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: '16px',
                padding: '14px 18px',
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                color: '#0f172a',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <ArrowUpRight size={18} />
              {t('schemeImpactLink')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeRepository;
