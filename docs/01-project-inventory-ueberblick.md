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

Eine Bestandsaufnahme kann hauptsächlich eine Entscheidung vorbereiten, die laufende Arbeit unterstützen oder ein dauerhaftes Projektgedächtnis aufbauen. Ein Inventory Run darf mehrere Zwecke verbinden. Einer davon sollte den Hauptzweck bilden. Er bestimmt die Auswahl der Quellen, die Tiefe der Untersuchung und den Schwerpunkt des Inventory Report.

Das fachliche Wissen ist der eigentliche Wert. Dazu gehören Begriffe, Regeln, Ausnahmen, Zusammenhänge, frühere Entscheidungen und bekannte Grenzen. Technische Quellen helfen, dieses Wissen zu finden und zu prüfen. Sie bilden es nicht immer vollständig ab.

## Der Projektkontextgraph

Project Inventory rekonstruiert aus den zugänglichen Projektspuren schrittweise einen Projektkontextgraphen. Er ist kein vollständiges Abbild des Projekts. Er enthält nur Aussagen, die im untersuchten Bereich beobachtet, abgeleitet oder als offen festgehalten wurden.

Der Entwurf unterscheidet fünf Ebenen.

### Quellen

Quellcode, Dokumente, Tests, Tickets, beobachtetes Laufzeitverhalten und Aussagen von Menschen liefern mögliche Belege.

### Aussagen

Beobachtungen, Deutungen, unbekannte Bereiche und Empfehlungen verbinden die Quellen mit dem beschriebenen Projektkontext.

### Projektkontext

Fachliche Begriffe, Regeln, Module, Abläufe, Entscheidungen, Personen, Risiken und ihre Beziehungen bilden das dauerhaft nutzbare Projektwissen.

### Inventory Run

Der Run legt Auftrag, Bereich, Zeitpunkt, verwendete Quellen und Stand der Prüfung fest.

### Inventory Report

Der Bericht bewertet einen geprüften Ausschnitt des Projektkontextgraphen für den jeweiligen Auftrag. Er ist keine Aussage über nicht untersuchte Bereiche.

Eine wichtige Verbindung wird nicht nur als Linie zwischen zwei Gegenständen behandelt. Sie ist eine eigene Aussage. Zu ihr gehören nach diesem Entwurf mindestens die folgenden Angaben.

- stabile Kennung
- Gegenstand
- Art der Beziehung
- verbundener Gegenstand
- Aussageklasse
- Quelle und erreichbarer Verweis
- Zeitpunkt und untersuchter Bereich
- bekannte Grenzen
- Stand der Prüfung
- Widerspruch, Ersetzung oder offene Gültigkeit

Diese Angaben sind eine Diskussionsgrundlage. Sie legen noch kein Schema, Dateiformat und keine Graphdatenbank fest.

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

### Sprache des Beobachters

Eine Bestandsaufnahme beschreibt nur den untersuchten Bereich und die verfügbaren Belege. Sie unterscheidet besonders die folgenden Aussagen.

- Eine verantwortliche Stelle wurde nicht gefunden.
- Eine verantwortliche Stelle ist nicht vorhanden.
- Ein Budget wurde nicht bestätigt.
- Eine Umsetzung wurde nicht beauftragt.

Diese Aussagen bedeuten nicht dasselbe. Auch die wirtschaftliche Einordnung eines Projekts erklärt ohne weitere Belege keine Priorität und keinen Beweggrund.

Die Aussage nicht vorhanden braucht stärkere Belege als die Aussage nicht gefunden. Aussagen von Personen werden mit ihrer Herkunft wiedergegeben und nicht als direkt beobachtete Tatsache behandelt.

Dasselbe gilt für Beziehungen im Projektkontextgraphen. Eine beobachtete Abhängigkeit, eine fachliche Deutung und eine Aussage aus einem Gespräch erhalten unterschiedliche Aussageklassen. Sie dürfen nicht zu einer scheinbar einheitlichen Tatsache verschmelzen.

## Möglicher Arbeitsablauf

Ein möglicher Ablauf besteht aus diesen Schritten.

1. Anlass, Hauptzweck, Zielgruppe und vorläufige Untersuchungsgrenzen klären.
2. Zugängliche Quellen und bestehende Quellen der Wahrheit erfassen.
3. Evidenz mit Herkunft, Zeitpunkt, Reichweite und Verlässlichkeit registrieren.
4. Beobachtungen, Interpretationen und unbekannte Bereiche getrennt auswerten.
5. Eine zusammenhängende Projektbaseline erstellen.
6. Findings, Risiken und Empfehlungen mit Evidenz verknüpfen.
7. Das Ergebnis durch verantwortliche Menschen prüfen und gegebenenfalls bestätigen.
8. Dauerhaft nutzbare Erkenntnisse nach der Prüfung in das Projektgedächtnis übernehmen.
9. Für unterschiedliche Zielgruppen geeignete Darstellungen aus dem geprüften Bericht ableiten.

Dieser Ablauf ist eine Diskussionsgrundlage. Namen, Reihenfolge, Pflichtfelder und Automatisierungsgrad sind noch nicht festgelegt.

### Grundaufnahme und laufende Vertiefung

Der Entwurf unterscheidet zwei Formen der Bestandsaufnahme.

Die Grundaufnahme schafft eine breite Orientierung. Sie erfasst die vorhandene Struktur, wichtige Bereiche, bekannte Abhängigkeiten, zugängliche Quellen und erkennbare Wissenslücken. Sie muss noch nicht jeden Bereich vollständig erklären.

Die laufende Vertiefung folgt der realen Arbeit. Eine konkrete Aufgabe, ein Fehler oder eine Entscheidung führt zu einer genaueren Untersuchung der betroffenen Bereiche. Dabei gewonnene Erkenntnisse werden geprüft. Dauerhaft nutzbares Wissen fließt in das Projektgedächtnis. Wissen nur für den jeweiligen Vorgang bleibt beim Vorgang.

Damit kann jede Aufgabe zwei Ergebnisse liefern. Sie beantwortet ihren eigentlichen Anlass und verbessert das Verständnis des Projekts.

Diese laufende Vertiefung ersetzt keinen neuen Inventory Report. Ein Bericht beschreibt weiterhin den bewerteten Stand für einen bestimmten Auftrag, Bereich und Zeitpunkt.

## Quelle der Wahrheit und Projektionen

Bestehende fachliche Quellen bleiben für ihr Wissen verantwortlich. Das Projektgedächtnis verbindet dauerhaft nutzbare Erkenntnisse mit ihren Belegen. Der Inventory Report führt die Bewertung für den jeweiligen Auftrag. Andere Darstellungen werden daraus abgeleitet.

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
- einen wachsenden Projektkontextgraphen mit geprüften Aussagen und sichtbaren Wissenslücken
- einen evidenzbasierten Inventory Report als führende Bewertung des jeweiligen Run
- ein Register für Findings und Lücken mit Risiken, Widersprüchen und fehlenden Informationen
- eine geprüfte Ergänzung des Projektgedächtnisses, wenn dauerhaft nutzbares Wissen entstanden ist
- zielgruppengerechte Projektionen wie Management Summary oder Präsentation

Diese Ergebnisse sind noch nicht genau beschrieben. Vorlagen können später Fragen, Angaben und Regeln für Belege vereinheitlichen. Sie dürfen keine Schlüsse oder Bewertungen vorgeben.

## Was ein vollständiger Inventory Run zusätzlich leisten muss

Ein großes Softwareprojekt kann bereits viel gutes Projektwissen enthalten. Dazu können eine Karte des Repositorys, ein Katalog der Module, Beschreibungen der Architektur, Informationen über Tests und eine Liste offener Fragen gehören.

Dieses Wissen ist die Grundlage. Ein vollständiger Inventory Run muss es für einen konkreten Anlass zusammenführen.

Der diskutierte Ansatz soll deshalb mindestens die folgenden Aufgaben abdecken.

1. Den Auftrag, den Anlass und den Hauptzweck der Bestandsaufnahme festhalten.
2. Die Zielgruppe und einen bereits bekannten Entscheidungsbedarf nennen.
3. Die vorläufigen Grenzen und offenen Fragen der Untersuchung sichtbar machen.
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

Der Projektkontextgraph wird dadurch nicht zu einer zweiten Steuerung. Er bewahrt fachlichen und technischen Kontext. AGDF bleibt für Scope, Run State, Evidenzgrenzen, Freigaben und kontrollierte Übergänge verantwortlich.

## Gemeinsames Projektgedächtnis

Der gemeinsame Rahmen für AGDF und Project Inventory ist ein optionales Projektgedächtnis.

Project Inventory ermittelt und ordnet dauerhaft nutzbares Wissen. Dazu gehören fachliche Begriffe, Regeln, Module, Abläufe, Tests, Entscheidungen, Risiken und offene Fragen. Jede Aussage bleibt mit ihren Belegen, ihrem Stand und ihren bekannten Grenzen verbunden.

AGDF kann dieses Wissen bei einer konkreten Aufgabe als Orientierung nutzen. Die betroffenen Aussagen werden erneut an den verantwortlichen Quellen geprüft. Das Projektgedächtnis ist deshalb eine belastbare Einstiegshilfe, aber keine automatische Wahrheit.

Nach der Aufgabe werden neue Erkenntnisse geordnet.

1. Wissen nur für den Vorgang bleibt beim Vorgang.
2. Dauerhaft nutzbares Projektwissen fließt nach der Prüfung in das Projektgedächtnis zurück.
3. Entscheidungen, Risiken, Regeln und Folgen für spätere Veränderungen können zusätzlich in den AGDF Context Graph aufgenommen werden.
4. Änderungen an der verantwortlichen Quelle werden dort vorgenommen und nicht nur im Projektgedächtnis beschrieben.

Für die Verbindung reicht zunächst ein kleiner Vertrag. Er beschreibt den Ort des Projektgedächtnisses, seinen Geltungsbereich, die verantwortliche Stelle, den Stand der letzten Prüfung und bekannte Lücken. Er legt außerdem fest, wie neue Erkenntnisse vorgeschlagen und bestätigt werden.

Dieser Vertrag soll optional bleiben. AGDF muss ohne Project Inventory nutzbar sein. Project Inventory kann ebenfalls Bestandsaufnahmen durchführen, ohne daraus einen gesteuerten Veränderungslauf zu machen.

## Anerkannte fachliche Bezugspunkte

Die vorgeschlagene Verbindung ist neu für diesen Entwurf. Ihre einzelnen Grundlagen sind anerkannt.

- Das [Software Engineering Institute](https://www.sei.cmu.edu/library/playing-detective-reconstructing-software-architecture-from-available-evidence/) beschreibt die Rekonstruktion von Softwarearchitektur aus vorhandenen Belegen.
- [W3C PROV](https://www.w3.org/TR/prov-o/) bietet Begriffe für Herkunft, Ableitung, Tätigkeiten und verantwortliche Stellen.
- [ISO 42010](https://www.iso.org/standard/74393.html) unterscheidet eine tatsächliche Architektur von ihrer Beschreibung und unterstützt verschiedene Sichten für verschiedene Anliegen.
- [ISO 30401](https://www.iso.org/standard/68683.html) behandelt Wissensmanagement als laufenden Aufbau, Pflege, Prüfung und Verbesserung.
- [W3C SHACL](https://www.w3.org/TR/shacl/) könnte später Regeln für die technische Prüfung eines Graphen unterstützen.

Diese Bezugspunkte begründen noch keine technische Architektur. Sie helfen bei Sprache, Abgrenzung und späterer Prüfung.

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

Diese Steuerung beantwortet noch nicht, welche vorhandene Lösung zu einer Aufgabe passt. Dafür braucht die KI belastbaren Projektkontext. Das Projektgedächtnis macht vorhandene Zuständigkeiten, Muster, Abläufe, Tests und Erweiterungspunkte auffindbar. So kann eine erlaubte Änderung innerhalb der bestehenden Lösung erfolgen, statt eine unnötige zweite Lösung zu schaffen.

Ohne eine passende Installation von AGDF können einzelne Vorlagen und Ideen weiter als Orientierung dienen. Ein durch AGDF kontrollierter Inventory Run ist dann aber nicht gesichert. Eine spätere Umsetzung soll diese Abhängigkeit klar prüfen. Sie soll bei einer fehlenden oder unpassenden Version von AGDF mit einer klaren Meldung enden.

Diese Aufteilung ist ein Vorschlag und noch kein verabschiedetes oder implementiertes Produktdesign.

## Möglicher Wert für Unternehmen

Ein belastbarer Ansatz könnte Unternehmen bei den folgenden Aufgaben helfen.

- Projektübernahmen und Anbieterwechsel nachvollziehbarer vorzubereiten
- Modernisierungsentscheidungen auf eine überprüfbare Baseline zu stützen
- bekannte Fakten und bloße Annahmen sichtbar zu trennen
- Wissenslücken früh zu erkennen und gezielt zu schließen
- bereits untersuchte Zusammenhänge bei späteren Aufgaben wiederzuverwenden
- vorhandene Lösungen vor einer Neuanlage zu erkennen
- unnötige parallele Verantwortungen bei Änderungen mit KI zu vermeiden
- technische Erkenntnisse in entscheidungsfähige Managementinformationen zu übersetzen
- wiederholte Bestandsaufnahmen vergleichbarer zu machen
- externe Beratungsergebnisse transparenter und überprüfbarer zu gestalten
- aus Findings kontrollierte Veränderungsvorhaben abzuleiten

Viele Dokumente schaffen noch keinen wirtschaftlichen Wert. Wert entsteht durch weniger Unsicherheit und weniger Fehlentscheidungen. Auch schnellere Übergaben und eine bessere Reihenfolge bei der Modernisierung können einen Wert schaffen.

Dieser Wert setzt keine spätere Bereinigung voraus. Ein Inventory Run kann belastbar abgeschlossen werden, obwohl im untersuchten Bereich kein Budget bestätigt und keine verantwortliche Stelle gefunden wurde. Der Bericht hält die Reichweite dieser Beobachtung sichtbar fest. Damit beginnt eine spätere Prüfung oder Entscheidung nicht wieder bei null.

## Mögliche Anwendungsfälle

- Projektübernahme oder Lieferantenwechsel
- technische Due Diligence
- Vorbereitung der Modernisierung eines Altsystems
- Stabilisierung eines gefährdeten Programms
- Architektur-, Security- oder Betriebsreview
- Vorbereitung regulatorischer oder interner Prüfungen
- Bewertung eines Projekts für die Entwicklung mit KI
- wiederkehrender Project Health Check

## Voraussetzungen für einen Pilotversuch

Eine Umsetzung sollte erst beginnen, wenn die folgenden Punkte ausreichend geklärt sind.

- ein konkreter primärer Anwendungsfall
- eine benannte Zielgruppe und verantwortliche Ergebnisabnahme
- eine begründete Abgrenzung zu bestehenden Werkzeugen
- ein verständliches und überprüfbares Evidenzmodell
- ein kleines und verständliches Modell für Gegenstände, Beziehungen und Aussagen
- ein minimaler, eigenständig nutzbarer Ergebnisumfang
- messbare Erfolgskriterien für einen Pilotversuch
- klare Verantwortungsgrenzen zwischen AGDF Core und der Erweiterung
- ein freigegebener User Requirement Scope

Bis dahin bleibt dieses Repository bewusst ein Diskussionsentwurf.

## Nächster Schritt

Als Nächstes wird der fachliche Aufbau eines Inventory Run beschrieben. Das Dokument zeigt die Teile des Ablaufs und ihre Verantwortung. Es legt noch keine technische Lösung fest.

Das nächste Dokument ist das folgende.

[02 Aufbau und Verantwortung](02-aufbau-und-verantwortung.md)
