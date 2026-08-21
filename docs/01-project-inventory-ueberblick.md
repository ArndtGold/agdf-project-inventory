# Überblick zu AGDF Project Inventory

## Was unter Project Inventory verstanden wird

Project Inventory bezeichnet hier keine reine Liste von Dateien, Technik oder Abhängigkeiten. Gemeint ist ein geordnetes Bild des Projekts. Es verbindet mindestens die folgenden Sichtweisen.

- Zweck, Scope und fachlicher Kontext des Projekts
- Eigentümer, Verantwortlichkeiten und bekannte Beteiligte
- Architektur, Komponenten und technische Abhängigkeiten
- Entwicklungs-, Test-, Build- und Lieferfähigkeit
- Betrieb, Laufzeit, Sicherheit und Wiederherstellung
- Dokumentationsstand und Quellen der Wahrheit
- bekannte Risiken, Widersprüche und Wissenslücken
- Entscheidungsbedarf und priorisierte nächste Schritte

Der Anlass, das Risiko und die verfügbaren Belege bestimmen die nötige Tiefe. Eine kleine Projektübergabe braucht weniger Tiefe als eine Modernisierung in einem geregelten Umfeld oder eine Prüfung eines ganzen Unternehmens.

## Evidenzmodell

Der Entwurf unterscheidet vier Aussageklassen.

### Beobachtete Fakten

Aussagen, die sich direkt auf eine benannte und überprüfbare Quelle zurückführen lassen.

### Interpretationen

Schlussfolgerungen aus beobachteten Fakten. Sie müssen als Interpretation erkennbar bleiben und die zugrunde liegende Evidenz nennen.

### Unbekanntes

Informationen, die für eine belastbare Bewertung fehlen, widersprüchlich sind oder mit den verfügbaren Zugriffsrechten nicht geprüft werden können.

### Empfehlungen

Vorgeschlagene Handlungen, die aus Fakten, Interpretationen und Risiken abgeleitet werden. Empfehlungen sind keine bereits getroffenen Entscheidungen und keine Umsetzungsfreigaben.

Belege aus einem Repository zeigen nur den dort beobachteten Stand. Sie beweisen nicht das Verhalten im laufenden Betrieb. Sie beweisen auch nicht den Stand externer Systeme oder eine erfolgreiche Abnahme durch Menschen.

## Möglicher Arbeitsablauf

Ein möglicher Ablauf besteht aus diesen Schritten.

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

Mögliche Darstellungen sind die folgenden.

- Management Summary
- Bericht für eine Übergabe oder Due Diligence
- priorisierter Maßnahmenkatalog
- Architektur- und Risikodarstellung
- PowerPoint Präsentation für ein Gremium

Eine Präsentation darf geprüfte Aussagen kürzen. Sie darf keine neuen Belege oder mehr Sicherheit vortäuschen. Neue Bewertungen und Schlüsse gehören in die Bestandsaufnahme. Sie dürfen nicht nur auf einer Folie stehen.

## Vorgesehene Ergebnisartefakte

Der besprochene Ablauf verbindet mehrere Ergebnisse.

- ein Intake für Anlass, Zielgruppe, Entscheidungsbedarf und Untersuchungsgrenzen
- ein Evidence Register für Quellen, Herkunft, Zeitpunkt, Reichweite und Verlässlichkeit
- einen evidenzbasierten Inventory Report als fachliche Quelle der Wahrheit
- ein Register für Findings und Lücken mit Risiken, Widersprüchen und fehlenden Informationen
- zielgruppengerechte Projektionen wie Management Summary oder Präsentation

Diese Ergebnisse sind noch nicht genau beschrieben. Vorlagen können später Fragen, Angaben und Regeln für Belege vereinheitlichen. Sie dürfen keine Schlüsse oder Bewertungen vorgeben.

## Was ein vollständiger Inventory Run zusätzlich leisten muss

Ein großes Softwareprojekt kann bereits viel gutes Projektwissen enthalten. Dazu können eine Karte des Repositorys, ein Katalog der Module, Beschreibungen der Architektur, Informationen über Tests und eine Liste offener Fragen gehören.

Dieses Wissen ist die Grundlage. Ein vollständiger Inventory Run muss es für einen konkreten Anlass zusammenführen.

Der diskutierte Ansatz soll deshalb mindestens die folgenden Aufgaben abdecken.

1. Den Auftrag und den Anlass der Bestandsaufnahme festhalten.
2. Die Zielgruppe und die vorzubereitende Entscheidung nennen.
3. Die Grenzen der Untersuchung sichtbar machen.
4. Die verwendeten Quellen mit Herkunft, Zeitpunkt und Reichweite erfassen.
5. Fakten, Deutungen, unbekannte Bereiche und Empfehlungen klar trennen.
6. Die wichtigsten Ergebnisse in einem gemeinsamen Bericht zusammenführen.
7. Risiken, Widersprüche und fehlende Informationen geordnet darstellen.
8. Empfehlungen mit den zugrunde liegenden Belegen verbinden.
9. Eine kurze Fassung für verantwortliche Personen ableiten.
10. Die Prüfung und Bestätigung durch Menschen dokumentieren.

Der gemeinsame Bericht ersetzt das vorhandene Projektwissen nicht. Er verweist darauf und fasst es für den Auftrag zusammen. Technische Details bleiben in ihren bestehenden Quellen der Wahrheit.

Eine kurze Fassung für das Management ist ebenfalls keine neue Quelle der Wahrheit. Sie darf den Bericht kürzen. Sie darf offene Fragen und Grenzen der Aussage nicht verstecken.

## Rolle von AGDF

Die besprochene Erweiterung ist als ergänzendes Plugin für [AGDF](https://agdf.iself.eu/) vorgesehen. AGDF ist die fachliche und später auch technische Grundlage für einen kontrollierten Inventory Run. Nicht jede Projektbestandsaufnahme braucht AGDF. AGDF Project Inventory soll aber die bestehenden Regeln für Freigaben, Belege und Lieferung nicht ein zweites Mal aufbauen.

Die Verantwortung ist wie folgt aufgeteilt.

- AGDF Core bleibt verantwortlich für Gates, Freigaben, Run State, Quellen der Wahrheit, Evidenzgrenzen und kontrollierte Delivery-Übergänge.
- AGDF Project Inventory beschreibt den besonderen Ablauf und seine Ergebnisse.
- Externe Systeme und spätere Connectoren liefern Evidenz, werden aber nicht automatisch zur Entscheidungs- oder Freigabeinstanz.

## Warum AGDF vorausgesetzt wird

Eine reine Bestandsaufnahme ist auch ohne AGDF möglich. Dieser Ansatz soll mehr als Dokumente erzeugen. Er soll den Umfang der Prüfung, die Belege, die Bewertung und die Entscheidungen von Menschen klar miteinander verbinden.

Dafür soll AGDF die grundlegenden Regeln bereitstellen.

- kontrollierter Scope und eindeutiger Run State
- nachvollziehbare Quellen der Wahrheit
- sichtbare Herkunft und Reichweite von Evidenz
- explizite Freigaben und Verantwortungsgrenzen
- Trennung von Nachweisen aus Repository, Laufzeit und UAT
- kontrollierter Übergang von Findings zu Veränderungsvorhaben
- dokumentierte Qualitäts- und Abnahmeentscheidungen

Ohne eine passende Installation von AGDF können einzelne Vorlagen und Ideen weiter als Orientierung dienen. Ein durch AGDF kontrollierter Inventory Run ist dann aber nicht gesichert. Eine spätere Umsetzung soll diese Abhängigkeit klar prüfen. Sie soll bei einer fehlenden oder unpassenden Version von AGDF mit einer klaren Meldung enden.

Diese Aufteilung ist ein Vorschlag und noch kein verabschiedetes oder implementiertes Produktdesign.

## Möglicher Wert für Unternehmen

Ein belastbarer Ansatz könnte Unternehmen bei den folgenden Aufgaben helfen.

- Projektübernahmen und Anbieterwechsel nachvollziehbarer vorzubereiten
- Modernisierungsentscheidungen auf eine überprüfbare Baseline zu stützen
- bekannte Fakten und bloße Annahmen sichtbar zu trennen
- Wissenslücken früh zu erkennen und gezielt zu schließen
- technische Erkenntnisse in entscheidungsfähige Managementinformationen zu übersetzen
- wiederholte Bestandsaufnahmen vergleichbarer zu machen
- externe Beratungsergebnisse transparenter und überprüfbarer zu gestalten
- aus Findings kontrollierte Veränderungsvorhaben abzuleiten

Viele Dokumente schaffen noch keinen wirtschaftlichen Wert. Wert entsteht durch weniger Unsicherheit und weniger Fehlentscheidungen. Auch schnellere Übergaben und eine bessere Reihenfolge bei der Modernisierung können einen Wert schaffen.

## Mögliche Anwendungsfälle

- Projektübernahme oder Lieferantenwechsel
- technische Due Diligence
- Vorbereitung der Modernisierung eines Altsystems
- Stabilisierung eines gefährdeten Programms
- Architektur-, Security- oder Betriebsreview
- Vorbereitung regulatorischer oder interner Prüfungen
- Bewertung eines Projekts für die Entwicklung mit KI
- wiederkehrender Project Health Check

## Übergang zu einem Pilotversuch

Eine Umsetzung sollte erst beginnen, wenn die folgenden Punkte ausreichend geklärt sind.

- ein konkreter primärer Anwendungsfall
- eine benannte Zielgruppe und verantwortliche Ergebnisabnahme
- eine begründete Abgrenzung zu bestehenden Werkzeugen
- ein verständliches und überprüfbares Evidenzmodell
- ein minimaler, eigenständig nutzbarer Ergebnisumfang
- messbare Erfolgskriterien für einen Pilotversuch
- klare Verantwortungsgrenzen zwischen AGDF Core und der Erweiterung
- ein freigegebener User Requirement Scope

Bis dahin bleibt dieses Repository bewusst ein Diskussionsentwurf.
