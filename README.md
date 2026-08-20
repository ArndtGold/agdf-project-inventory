![Intro: AGDF Project Inventory – Von verteilten Projektsignalen zur evidenzbasierten Entscheidungsgrundlage](assets/intro.png)

# AGDF Project Inventory

AGDF Project Inventory ist ein deutschsprachiger Diskussionsentwurf für nachvollziehbare, evidenzbasierte Bestandsaufnahmen von Softwareprojekten mit Unterstützung durch KI-Agenten.

## Dieser Diskussionsentwurf in einem Satz

KI-gestützte Projektbestandsaufnahmen brauchen nicht nur Zusammenfassungen. Sie brauchen einen nachvollziehbaren Arbeitsrahmen, der Fakten, Interpretationen, Wissenslücken und Empfehlungen mit überprüfbarer Evidenz verbindet.

## Status

Dieses Repository ist zunächst ein Diskussionsentwurf. Es beschreibt eine Problemhypothese, mögliche Prinzipien und offene Fragen. Es ist noch keine freigegebene Produktspezifikation, keine Implementierungszusage und kein Nachweis, dass der vorgeschlagene Ansatz in realen Projekten funktioniert.

Ziel ist zuerst zu prüfen, ob eine AGDF-basierte Projektbestandsaufnahme für Unternehmen einen eigenständigen und wiederholbaren Nutzen erzeugen kann.

## Ausgangsbeobachtung

Projektbestandsaufnahmen entstehen häufig unter Zeitdruck: bei Projektübernahmen, Modernisierungen, Lieferproblemen, Anbieterwechseln, Prüfungen oder vor wichtigen Investitionsentscheidungen.

Die verfügbaren Informationen sind dabei meist unvollständig und über verschiedene Quellen verteilt:

- Quellcode und Repository-Historie
- Architektur- und Betriebsdokumentation
- Backlogs, Tickets und Entscheidungsprotokolle
- Tests, Build- und Deployment-Konfiguration
- Sicherheits- und Qualitätsberichte
- Aussagen von Projektbeteiligten
- beobachtbares Laufzeitverhalten

Eine KI kann diese Quellen schnell auswerten und überzeugend zusammenfassen. Eine überzeugende Darstellung ist jedoch noch keine belastbare Bestandsaufnahme. Ohne Herkunftsnachweise, Unsicherheitskennzeichnung und klare Aussagegrenzen können Beobachtungen, Annahmen und Empfehlungen leicht miteinander vermischt werden.

## Problemhypothese

Unternehmen benötigen für Entscheidungen nicht nur mehr Informationen, sondern eine nachvollziehbare Antwort auf fünf Fragen:

1. Was wurde tatsächlich beobachtet?
2. Durch welche Evidenz ist die Aussage belegt?
3. Was wurde lediglich interpretiert oder abgeleitet?
4. Welche entscheidungsrelevanten Informationen fehlen?
5. Welche Handlungsempfehlungen folgen daraus und wer muss sie bewerten?

Bestehende Werkzeuge beantworten jeweils Teile dieser Fragen. Repository-Analyse, Softwarekataloge, CMDBs, Security Scanner, Projektmanagementsysteme und Architekturwerkzeuge bleiben wichtige Informationsquellen. Der hier diskutierte Ansatz soll sie nicht ersetzen. Er soll ihre Evidenz in einen kontrollierten, entscheidungsorientierten Zusammenhang bringen.

## Was unter Project Inventory verstanden wird

Project Inventory bezeichnet hier keine reine Liste von Dateien, Technologien oder Abhängigkeiten. Gemeint ist eine strukturierte Projektbaseline, die mindestens folgende Perspektiven miteinander verbindet:

- Zweck, Scope und fachlicher Kontext des Projekts
- Eigentümer, Verantwortlichkeiten und bekannte Beteiligte
- Architektur, Komponenten und technische Abhängigkeiten
- Entwicklungs-, Test-, Build- und Lieferfähigkeit
- Betrieb, Laufzeit, Sicherheit und Wiederherstellung
- Dokumentationsstand und Quellen der Wahrheit
- bekannte Risiken, Widersprüche und Wissenslücken
- Entscheidungsbedarf und priorisierte nächste Schritte

Welche Perspektiven erforderlich sind, soll proportional zum Anlass, Risiko und verfügbaren Belegmaterial bestimmt werden. Eine kleine Projektübergabe benötigt nicht automatisch dieselbe Tiefe wie eine regulierte Modernisierung oder eine unternehmensweite Due Diligence.

## Evidenzmodell

Der Entwurf unterscheidet vier Aussageklassen:

### Beobachtete Fakten

Aussagen, die sich direkt auf eine benannte und überprüfbare Quelle zurückführen lassen.

### Interpretationen

Schlussfolgerungen aus beobachteten Fakten. Sie müssen als Interpretation erkennbar bleiben und die zugrunde liegende Evidenz nennen.

### Unbekanntes

Informationen, die für eine belastbare Bewertung fehlen, widersprüchlich sind oder mit den verfügbaren Zugriffsrechten nicht geprüft werden können.

### Empfehlungen

Vorgeschlagene Handlungen, die aus Fakten, Interpretationen und Risiken abgeleitet werden. Empfehlungen sind keine bereits getroffenen Entscheidungen und keine Umsetzungsfreigaben.

Repository-Evidenz beweist dabei nur den beobachteten Repository-Zustand. Sie beweist nicht automatisch das Verhalten einer produktiven Laufzeitumgebung, den Status externer Systeme oder eine erfolgreiche menschliche Abnahme.

## Möglicher Arbeitsablauf

Ein möglicher Ablauf könnte aus folgenden Schritten bestehen:

1. Anlass, Zielgruppe, Entscheidungsbedarf und Untersuchungsgrenzen klären.
2. Zugängliche Quellen und bestehende Quellen der Wahrheit erfassen.
3. Evidenz mit Herkunft, Zeitpunkt, Reichweite und Verlässlichkeit registrieren.
4. Beobachtungen, Interpretationen und unbekannte Bereiche getrennt auswerten.
5. Eine zusammenhängende Projektbaseline erstellen.
6. Findings, Risiken und Empfehlungen mit Evidenz verknüpfen.
7. Das Ergebnis durch verantwortliche Menschen prüfen und gegebenenfalls bestätigen.
8. Für unterschiedliche Zielgruppen geeignete Projektionen aus der bestätigten Baseline ableiten.

Dieser Ablauf ist eine Diskussionsgrundlage. Namen, Reihenfolge, Pflichtfelder und Automatisierungsgrad sind noch nicht festgelegt.

## Quelle der Wahrheit und Projektionen

Die belastbare Projektbestandsaufnahme soll als evidenzbasierter Bericht die fachliche Quelle der Wahrheit bilden. Andere Darstellungen werden daraus abgeleitet.

Mögliche Projektionen sind:

- Management Summary
- Übergabe- oder Due-Diligence-Bericht
- priorisierter Maßnahmenkatalog
- Architektur- und Risikodarstellung
- PowerPoint-Präsentation für Entscheidungsgremien

Eine Präsentation darf die geprüften Aussagen verdichten, aber keine neue Evidenz oder stärkere Gewissheit erzeugen. Änderungen an Bewertungen und Schlussfolgerungen gehören zurück in die Bestandsaufnahme und nicht ausschließlich in eine Folie.

## Rolle von AGDF

AGDF könnte den kontrollierten Rahmen für Scope, Evidenz, Freigaben und den Übergang von Erkenntnissen zu Veränderungen bereitstellen. Eine mögliche Erweiterung würde den fachlichen Ablauf der Projektbestandsaufnahme, wiederverwendbare Vorlagen und abgeleitete Ergebnisdarstellungen ergänzen.

Die Verantwortungsgrenze wäre dabei:

- AGDF Core bleibt verantwortlich für Gates, Freigaben, Run State, Quellen der Wahrheit, Evidenzgrenzen und kontrollierte Delivery-Übergänge.
- AGDF Project Inventory beschreibt den spezialisierten Inventory-Workflow und seine Ergebnisartefakte.
- Externe Systeme und spätere Connectoren liefern Evidenz, werden aber nicht automatisch zur Entscheidungs- oder Freigabeinstanz.

Diese Aufteilung ist ein Vorschlag und noch kein verabschiedetes Produktdesign.

## Möglicher Wert für Unternehmen

Ein belastbarer Ansatz könnte Unternehmen insbesondere dabei helfen:

- Projektübernahmen und Anbieterwechsel nachvollziehbarer vorzubereiten
- Modernisierungsentscheidungen auf eine überprüfbare Baseline zu stützen
- bekannte Fakten und bloße Annahmen sichtbar zu trennen
- Wissenslücken früh zu erkennen und gezielt zu schließen
- technische Erkenntnisse in entscheidungsfähige Managementinformationen zu übersetzen
- wiederholte Bestandsaufnahmen vergleichbarer zu machen
- externe Beratungsergebnisse transparenter und überprüfbarer zu gestalten
- aus Findings kontrollierte Veränderungsvorhaben abzuleiten

Der wirtschaftliche Wert entsteht nicht durch die Menge erzeugter Dokumentation. Er entsteht, wenn Unsicherheit reduziert, Fehlentscheidungen vermieden, Übergaben beschleunigt oder Modernisierungsmaßnahmen besser priorisiert werden.

## Mögliche Anwendungsfälle

- Projektübernahme oder Lieferantenwechsel
- technische Due Diligence
- Vorbereitung einer Legacy-Modernisierung
- Stabilisierung eines gefährdeten Programms
- Architektur-, Security- oder Betriebsreview
- Vorbereitung regulatorischer oder interner Prüfungen
- Bewertung der Eignung eines Projekts für KI-gestützte Entwicklung
- wiederkehrender Project Health Check

## Was dieser Entwurf nicht ist

AGDF Project Inventory ist in der vorgeschlagenen Form:

- kein Ersatz für eine CMDB oder einen Softwarekatalog
- kein Repository-, Dependency- oder Security-Scanner
- keine automatische Compliance-Zertifizierung
- keine Garantie für Vollständigkeit oder Richtigkeit
- kein Ersatz für Fachwissen, Interviews oder menschliche Verantwortung
- kein Nachweis produktiven Laufzeitverhaltens allein auf Basis von Repository-Daten
- kein PowerPoint-Generator mit Governance-Begriffen
- keine Neuimplementierung von AGDF Core

## Offene Fragen

1. Welche Entscheidungen sollen durch eine Project Inventory konkret besser werden?
2. Wer ist die primäre Zielgruppe und wer verantwortet die Abnahme?
3. Welche Mindest-Evidenz benötigt eine belastbare Bestandsaufnahme?
4. Wie werden Aktualität, Herkunft und Reichweite einer Evidenz bewertet?
5. Welche Aussageklassen und Unsicherheitsgrade sind für Unternehmen verständlich genug?
6. Wann genügt eine kompakte Bestandsaufnahme und wann ist eine strukturierte Tiefe erforderlich?
7. Wie lassen sich technische Findings ohne Scheingenauigkeit priorisieren?
8. Welche Informationen dürfen an externe Modelle oder Dienste übertragen werden?
9. Welche Connectoren erzeugen ausreichend zusätzlichen Nutzen, um ihren Betriebs- und Sicherheitsaufwand zu rechtfertigen?
10. Wie kann eine Bestandsaufnahme später reproduzierbar aktualisiert und mit früheren Ständen verglichen werden?
11. Welche Teile des Ergebnisses sollten versioniert, bestätigt oder ausdrücklich verworfen werden?
12. Woran lässt sich in realen Projekten messen, ob der Ansatz tatsächlich bessere Entscheidungen ermöglicht?

## Übergang zur Umsetzung

Eine Implementierung sollte erst beginnen, wenn mindestens folgende Punkte ausreichend geklärt sind:

- ein konkreter primärer Anwendungsfall
- eine benannte Zielgruppe und verantwortliche Ergebnisabnahme
- eine begründete Abgrenzung zu bestehenden Werkzeugen
- ein verständliches und überprüfbares Evidenzmodell
- ein minimaler, eigenständig nutzbarer Ergebnisumfang
- messbare Erfolgskriterien für einen Pilotversuch
- klare Verantwortungsgrenzen zwischen AGDF Core und der Erweiterung
- ein freigegebener User Requirement Scope

Bis dahin bleibt dieses Repository bewusst ein Diskussionsentwurf.
