<script>
  let { onClose } = $props()
</script>

<div
  class="overlay"
  role="dialog"
  aria-modal="true"
  aria-label="Rechtliches"
  tabindex="-1"
  onclick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
  onkeydown={(e) => e.key === 'Escape' && onClose?.()}
>
  <div class="modal">
    <div class="modal-header">
      <h2>Rechtliches</h2>
      <button class="close-btn" onclick={onClose} aria-label="Schließen">✕</button>
    </div>

    <div class="modal-body">
      <section>
        <h3>Impressum</h3>
        <p>
          Bromberger, Kemmer, Trommeshauser &amp; Wiederkehr GbR<br />
          Ludwig-Pfau-Straße 22<br />
          70176 Stuttgart<br /><br />
          Vertretungsberechtigte Gesellschafter: Aiko Bromberger, Saskia Kemmer, Nadine Trommeshauser, Aron Wiederkehr<br /><br />
          Telefon: +49 1702863044<br />
          E-Mail: <a href="mailto:info@saurer-siggi.de">info@saurer-siggi.de</a><br />
          Internet: <a href="https://saurer-siggi.de" target="_blank" rel="noopener noreferrer">saurer-siggi.de</a><br /><br />
          Umsatzsteuer-Identifikationsnummer gem. § 27a UStG: DE359845781<br /><br />
          Inhaltlich Verantwortlich:<br />
          Aiko Bromberger<br />
          Heinrich-Baumann-Straße 21<br />
          70190 Stuttgart<br />
          <a href="mailto:aiko.bromberger@saurer-siggi.de">aiko.bromberger@saurer-siggi.de</a>
        </p>
      </section>

      <section>
        <h3>Datenschutzerklärung</h3>
        <p>
          Wir freuen uns, dass Du unsere SiggiSearch-App nutzt. Der Schutz Deiner Daten ist uns wichtig.
        </p>
        <p>
          <strong>1. Verantwortlicher</strong><br />
          Bromberger, Kemmer, Trommeshauser &amp; Wiederkehr GbR · Ludwig-Pfau-Straße 22 · 70176 Stuttgart ·
          <a href="mailto:info@saurer-siggi.de">info@saurer-siggi.de</a>
        </p>
        <p>
          <strong>2. Erhebung und Verarbeitung von Daten</strong><br />
          Unsere App erhebt keine personenbezogenen Daten, außer Du nutzt die Standortfunktion.
        </p>
        <p>
          <strong>3. Nutzung der Standortdaten</strong><br />
          Wenn Du den „Standort ermitteln"-Button nutzt, wird Dein aktueller Standort temporär ermittelt,
          um Dir nahegelegene Geschäfte anzuzeigen. Diese Standortdaten werden ausschließlich für die
          Dauer der Nutzung verwendet und danach sofort gelöscht. Eine Speicherung oder Weitergabe an
          Dritte erfolgt nicht.
        </p>
        <p>
          <strong>4. Rechtsgrundlage</strong><br />
          Die Verarbeitung erfolgt auf Basis Deiner Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
        </p>
        <p>
          Bei Fragen wende Dich an
          <a href="mailto:info@saurer-siggi.de">info@saurer-siggi.de</a>.<br />
          <em>Stand: 16.08.2024</em>
        </p>
      </section>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 2000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  }

  @media (min-width: 600px) {
    .overlay { align-items: center; padding: 24px; }
  }

  .modal {
    background: #fff;
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-width: 640px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  @media (min-width: 600px) {
    .modal { border-radius: 20px; max-height: 80vh; }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }

  .modal-header h2 { margin: 0; font-size: 1.2rem; font-weight: 700; }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    color: var(--color-grey);
    padding: 4px 8px;
    line-height: 1;
  }

  .close-btn:hover { color: #1a1a1a; }

  .modal-body {
    overflow-y: auto;
    padding: 20px 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  section h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 10px;
    color: #1a1a1a;
  }

  section p {
    margin: 0 0 10px;
    font-size: 0.88rem;
    color: #444;
    line-height: 1.6;
  }

  section a { color: var(--color-blue); text-decoration: none; }
  section a:hover { text-decoration: underline; }
</style>
