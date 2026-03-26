import { useLanguage } from '../contexts/LanguageContext';
function Legend(){
  const { t } = useLanguage();

  return(

    <div
      style={{
        position: "absolute",
        bottom: "30px",
        left: "30px",
        background: "white",
        padding: "10px",
        borderRadius: "6px",
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
        fontSize: "13px",
        zIndex: 1000
      }}
    >

      <b>{t('priorityLegend')}</b>

      <div>
        <span style={{color:"green"}}>■</span> {t('lowPriority')}
      </div>

      <div>
        <span style={{color:"orange"}}>■</span> {t('mediumPriority')}
      </div>

      <div>
        <span style={{color:"red"}}>■</span> {t('highPriority')}
      </div>

    </div>

  );

}

export default Legend;