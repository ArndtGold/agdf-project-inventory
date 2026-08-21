# Manifest für AGDF Project Inventory

## Warum dieses Projekt existiert

Projektbestandsaufnahmen entstehen oft unter Zeitdruck. Das geschieht etwa bei einer Projektübernahme, einer Modernisierung, einem Lieferproblem, einem Anbieterwechsel, einer Prüfung oder vor einer wichtigen Investition.

Die verfügbaren Informationen sind meist unvollständig. Sie liegen in verschiedenen Quellen.

- Quellcode und Verlauf im Repository
- Architektur- und Betriebsdokumentation
- Backlogs, Tickets und Entscheidungsprotokolle
- Tests und Konfiguration für Build und Deployment
- Sicherheits- und Qualitätsberichte
- Aussagen von Projektbeteiligten
- beobachtbares Laufzeitverhalten

KI kann diese Quellen schnell auswerten und gut zusammenfassen. Eine gute Darstellung ist aber noch keine belastbare Bestandsaufnahme. Die Herkunft und die Grenzen jeder Aussage müssen sichtbar sein. Sonst werden Beobachtungen, Annahmen und Empfehlungen leicht vermischt.

## Eine Analogie

Eine Projektbestandsaufnahme ähnelt einer Landkarte für eine noch nicht vollständig vermessene Landschaft.

Die Karte ist nur dann für Entscheidungen brauchbar, wenn sie klare Unterschiede zeigt. Welche Wege wurden wirklich beobachtet? Welche Verbindungen wurden nur abgeleitet? Welche Bereiche sind noch unbekannt? Eine schöne Karte darf fehlende Messungen nicht verdecken.

Genauso darf eine Bestandsaufnahme mit KI keine Sicherheit vortäuschen. Jede Aussage braucht passende und zugängliche Belege.

## Worum es in diesem Entwurf zunächst geht

Dieser Entwurf ist zunächst keine freigegebene Produktspezifikation und keine Implementierungszusage.

Die erste Frage lautet nicht, wie viele Quellen automatisch angebunden, welche Dokumente generiert oder wie Findings bewertet werden sollen.

Die erste Frage lautet.

> Kann eine durch AGDF gesteuerte Project Inventory Unternehmen helfen? Können sie damit Softwareprojekte besser übernehmen, bewerten und weiterentwickeln?

Daraus folgen weitere Fragen.

- Welche Entscheidungen sollen konkret besser werden?
- Welche Evidenz ist dafür mindestens erforderlich?
- Wie müssen Beobachtung, Interpretation, Unbekanntes und Empfehlung getrennt werden?
- Welche Aussagen müssen durch verantwortliche Menschen geprüft oder bestätigt werden?
- Wie lässt sich der Nutzen in realen Projekten beobachten?

Dieses Repository versteht sich zunächst als Beitrag zu dieser Diskussion.

## Sprache und Kontext

Dieses Projekt beginnt bewusst auf Deutsch.

Projektübernahme, Verantwortung, Nachweise, Unsicherheit und Freigaben sind nicht nur technische Themen. Sie betreffen auch Organisation, Einkauf, Betrieb, Regeln, Zusammenarbeit und Verantwortung im Management.

Einige englische Fachbegriffe bleiben erhalten. Dazu gehören `Project Inventory`, `Evidence Register`, `Finding`, `Brownfield` und `Source of Truth`. Die Erklärung erfolgt zuerst auf Deutsch.

## Kernthese

Unternehmen brauchen für Entscheidungen klare Antworten auf fünf Fragen.

1. Was wurde tatsächlich beobachtet?
2. Durch welche Evidenz ist die Aussage belegt?
3. Was wurde lediglich interpretiert oder abgeleitet?
4. Welche entscheidungsrelevanten Informationen fehlen?
5. Welche Handlungsempfehlungen folgen daraus und wer muss sie bewerten?

Bestehende Werkzeuge beantworten Teile dieser Fragen. Dazu gehören die Analyse von Repositorys, Softwarekataloge, CMDBs, Werkzeuge für Sicherheit, Systeme für Projektmanagement und Werkzeuge für Architektur. Der Ansatz soll diese Werkzeuge nicht ersetzen. Er soll ihre Belege in einen klaren Zusammenhang für Entscheidungen bringen.

## Bestandsaufnahme als Entscheidungsrealität

Eine Project Inventory ist besonders relevant, wenn Entscheidungen unter unvollständigem Wissen getroffen werden müssen.

Belege aus einem Repository zeigen nur den dort beobachteten Stand. Sie beweisen nicht das Verhalten im laufenden Betrieb. Sie beweisen auch nicht den Stand externer Systeme oder eine erfolgreiche Abnahme durch Menschen. Aussagen von Beteiligten können wichtig sein. Sie bleiben aber von direkt prüfbaren Beobachtungen getrennt.

Eine gute Bestandsaufnahme braucht nicht viele Dokumente. Sie braucht klare Grenzen für ihre Aussagen. Widersprüche und fehlende Belege bleiben sichtbar. Verantwortliche Personen können damit bessere Entscheidungen treffen.

## Erfahrung aus einer echten Bestandsaufnahme

Eine frühere Bestandsaufnahme eines großen und gewachsenen Softwareprojekts liefert einen wichtigen Praxisbezug für diesen Entwurf.

In diesem Beispiel wurde umfangreiches Projektwissen aufgebaut. Dazu gehörten ein zentraler Einstieg, eine Karte des Repositorys, ein Katalog der Module, wichtige Abläufe, die Testlandschaft und eine Liste offener Fragen. Viele Aussagen waren direkt mit Dateien und Zeilen im Repository belegt. Fehlende Quellen wurden ausdrücklich genannt.

Damit entstand eine gute technische Grundlage. Trotzdem fehlte ein gemeinsamer Bericht für die Bestandsaufnahme. Anlass, Zielgruppe, Untersuchungsgrenzen und die vorzubereitende Entscheidung waren nicht an einer Stelle zusammengeführt. Auch die wichtigsten Ergebnisse, Risiken, Empfehlungen und die Prüfung durch verantwortliche Menschen waren nicht als ein gemeinsames Ergebnis sichtbar.

Daraus folgt eine wichtige Unterscheidung. Gepflegtes Projektwissen ist ein wesentlicher Teil einer Bestandsaufnahme. Es ist aber noch nicht die vollständige Bestandsaufnahme.

Eine Project Inventory muss vorhandenes Wissen für einen klaren Auftrag auswerten. Sie muss zeigen, was untersucht wurde, was als belegt gilt, was offen bleibt und welche Entscheidung damit vorbereitet werden kann.

Das Praxisbeispiel bleibt vertraulich. Dieser Entwurf übernimmt daraus nur allgemeine Erkenntnisse. Namen, Projektdaten und interne Inhalte werden nicht veröffentlicht.

## Prinzipien

### 1. Evidenz vor Darstellung

Eine überzeugende Zusammenfassung oder Präsentation ersetzt keine überprüfbare Herkunft und Reichweite der Aussagen.

### 2. Aussageklassen bleiben getrennt

Beobachtete Fakten, Interpretationen, Unbekanntes und Empfehlungen dürfen nicht stillschweigend miteinander vermischt werden.

### 3. Unbekanntes bleibt sichtbar

Fehlender Zugriff, widersprüchliche Quellen und nicht beobachtete Laufzeitbedingungen werden nicht durch Annahmen geschlossen.

### 4. Eine belastbare Bestandsaufnahme ist die Quelle der Wahrheit

Eine Zusammenfassung für das Management, eine Architekturansicht, ein Maßnahmenkatalog und eine Präsentation sind abgeleitete Darstellungen. Neue Bewertungen und Schlüsse gehören immer zurück in die Bestandsaufnahme.

### 5. Tiefe ist proportional

Der Anlass, das Risiko und die verfügbaren Belege bestimmen den Umfang. Eine kleine Übergabe braucht weniger Tiefe als eine Modernisierung in einem geregelten Umfeld oder eine Prüfung eines ganzen Unternehmens.

### 6. AGDF behält die Verantwortung für die Steuerung

Project Inventory soll Gates, Freigaben, Run State, Evidenzgrenzen und Delivery-Übergänge nicht parallel neu implementieren.

### 7. Empfehlungen sind keine Entscheidungen

Vorgeschlagene Handlungen werden aus Fakten, Interpretationen und Risiken abgeleitet. Sie sind weder bereits beschlossene Maßnahmen noch Umsetzungsfreigaben.

### 8. Nutzen muss sich im realen Einsatz zeigen

Der Ansatz ist erst belastbar, wenn Pilotversuche zeigen, dass er Unsicherheit reduziert, Übergaben verbessert oder Entscheidungen nachvollziehbarer macht.

## Was dieser Entwurf ist

Dieser Entwurf schlägt einen besonderen Ablauf für die Bestandsaufnahme vor. Er führt verteilte Signale aus einem Projekt in einem geordneten Bild zusammen. Dieses Bild stützt sich auf Belege und dient als Grundlage für Entscheidungen.

Der Entwurf richtet sich an Menschen, die ein Softwareprojekt übernehmen, bewerten, modernisieren oder stabilisieren müssen. Dazu gehören Teams, technische Leitungen, Produktverantwortliche, Personen aus der Architektur, Prüfung und Entscheidung.

## Was dieser Entwurf nicht ist

AGDF Project Inventory ist in der vorgeschlagenen Form Folgendes nicht.

- kein Ersatz für eine CMDB oder einen Softwarekatalog
- kein Werkzeug zur Prüfung von Repositorys, Abhängigkeiten oder Sicherheit
- keine automatische Prüfung der Einhaltung von Regeln
- keine Garantie für Vollständigkeit oder Richtigkeit
- kein Ersatz für Fachwissen, Interviews oder menschliche Verantwortung
- kein Nachweis für das Verhalten im Betrieb allein auf Basis von Daten aus dem Repository
- kein Werkzeug für PowerPoint mit Begriffen aus der Governance
- keine Neuimplementierung von AGDF Core

## Offene Fragen

1. Welche Entscheidungen sollen durch eine Project Inventory konkret besser werden?
2. Wer ist die primäre Zielgruppe und wer verantwortet die Abnahme?
3. Welche Belege braucht eine belastbare Bestandsaufnahme mindestens?
4. Wie werden Aktualität, Herkunft und Reichweite einer Evidenz bewertet?
5. Welche Aussageklassen und Unsicherheitsgrade sind für Unternehmen verständlich genug?
6. Wann genügt eine kompakte Bestandsaufnahme und wann ist eine strukturierte Tiefe erforderlich?
7. Wie lassen sich technische Findings ohne Scheingenauigkeit priorisieren?
8. Welche Informationen dürfen an externe Modelle oder Dienste übertragen werden?
9. Welche Connectoren erzeugen ausreichend zusätzlichen Nutzen, um ihren Betriebs- und Sicherheitsaufwand zu rechtfertigen?
10. Wie kann eine Bestandsaufnahme später reproduzierbar aktualisiert und mit früheren Ständen verglichen werden?
11. Welche Teile des Ergebnisses sollten versioniert, bestätigt oder ausdrücklich verworfen werden?
12. Woran lässt sich in realen Projekten messen, ob der Ansatz tatsächlich bessere Entscheidungen ermöglicht?

## Nächster Schritt

Als Nächstes beschreibt der Überblick das Evidenzmodell, den möglichen Arbeitsablauf, die Ergebnisartefakte und die Verantwortungsgrenze zu AGDF Core.

Das nächste Dokument ist daher das folgende.

[01 Überblick](01-project-inventory-ueberblick.md)
