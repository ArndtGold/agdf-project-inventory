# Aufbau und Verantwortung

## Ziel dieses Dokuments

Dieses Dokument beschreibt den fachlichen Aufbau eines Inventory Run.

Es zeigt, welche Teile zusammengehören und wer für sie verantwortlich ist. Es beschreibt keine technische Architektur. Datenbanken, Schnittstellen, Dateiformate und die Umsetzung eines Plugins bleiben offen.

Der Aufbau ist ein Diskussionsentwurf. Er ist noch keine freigegebene Produktspezifikation.

Aussagen über den Ablauf und die Verantwortung sind vorgeschlagene Regeln. Das Praxisbeispiel trennt Beobachtungen und Deutungen.

## Grundidee

Ein Inventory Run führt verteilte Informationen zu einer belastbaren Bestandsaufnahme zusammen.

Das fachliche Wissen ist der eigentliche Schatz des Projekts. Der Ablauf beginnt mit einer ausreichenden Ausgangslage und einem vorläufigen Auftrag. Danach werden Quellen erfasst und Belege geprüft. Beobachtungen, Deutungen und offene Bereiche werden getrennt ausgewertet. Dauerhaft nutzbare Erkenntnisse bilden schrittweise einen Projektkontextgraphen. Das führende Ergebnis des Run ist der Inventory Report. Kürzere Darstellungen werden aus dem Bericht abgeleitet.

Im vorgeschlagenen Modell steuert AGDF diesen Ablauf. Project Inventory führt die fachliche Bestandsaufnahme durch. Externe Systeme liefern Informationen. Menschen prüfen die Ergebnisse und bleiben für Entscheidungen verantwortlich.

## 1. Auftrag und Ausgangslage

Ein Inventory Run braucht zu Beginn keinen vollständigen Auftrag. Oft beginnt die Bestandsaufnahme gerade deshalb, weil wichtige Fragen noch nicht beantwortet sind.

Für den Start müssen nur die folgenden Punkte klar sein.

* untersuchtes Projekt
* Anlass der Bestandsaufnahme
* erlaubter Zugriff auf Quellen
* Bereiche, die untersucht werden dürfen
* Informationen, die nicht verarbeitet werden dürfen
* zuständige Person oder Stelle für Zugriff und Rückfragen

Weitere Punkte dürfen zunächst offen sein.

* genaue Zielgruppe
* konkrete Entscheidung, die vorbereitet werden soll
* vollständige Grenzen der Untersuchung
* verfügbare Zeit
* Person für die Prüfung des Ergebnisses
* gewünschte Form des Ergebnisses

Offene Punkte werden im Auftrag sichtbar festgehalten. Sie werden während der Untersuchung geklärt oder im Inventory Report als weiterhin offen benannt.

Der Inventory Run beginnt nicht, wenn das Projekt unklar ist, der Zugriff nicht erlaubt wurde oder der Schutz vertraulicher Informationen nicht geklärt ist.

### Hauptzweck der Bestandsaufnahme

Der Auftrag hält fest, wofür die Bestandsaufnahme hauptsächlich genutzt werden soll.

* Eine Entscheidung vorbereiten. Im Mittelpunkt stehen Risiken, Möglichkeiten, offene Fragen und mögliche Folgen.
* Die laufende Arbeit unterstützen. Im Mittelpunkt stehen Einstiegspunkte, Abhängigkeiten, Abläufe und Tests.
* Ein dauerhaftes Projektgedächtnis aufbauen. Im Mittelpunkt stehen stabiles Wissen, Quellen, Pflege und erkennbare Wissenslücken.

Ein Inventory Run kann mehrere Zwecke verbinden. Einer davon sollte den Hauptzweck bilden. Er bestimmt, welche Quellen zuerst geprüft werden, wie tief die Untersuchung geht und welche Aussagen im Inventory Report besonders wichtig sind.

Die wirtschaftliche Einordnung des Projekts reicht dafür nicht aus. Aus der Zuordnung zu einer Kostenstelle oder einem Profit Center lassen sich ohne weitere Belege weder Budget noch Prioritäten oder Beweggründe ableiten. Der Auftrag soll deshalb nur die festgestellte Lage beschreiben und keine spätere Bereinigung voraussetzen.

### Praxisbeispiel aus einem gewachsenen Projekt

Beobachtet wurde eine Bestandsaufnahme in einem großen gewachsenen Softwareprojekt. Eine genaue Entscheidungsfrage war in den untersuchten Unterlagen nicht erkennbar. Konkrete Aufgaben führten wiederholt zu Suchen nach Modulen, Abhängigkeiten, Laufzeitwegen und passenden Tests.

Zuerst entstanden ein vollständiger Modulkatalog, eine Karte des Projekts, wichtige Abläufe und eine Übersicht der Tests. Weitere Bereiche wurden untersucht, wenn konkrete Aufgaben und Fehler sie berührten. Fehlende Informationen wurden zusammen mit der benötigten Quelle festgehalten.

Aus den vorhandenen Artefakten ergibt sich folgende Deutung. Die Bestandsaufnahme diente hauptsächlich dem Aufbau eines dauerhaften Projektgedächtnisses für Menschen und KI. Sie unterstützte zugleich die laufende Arbeit. Das Projektgedächtnis sollte zeigen, wo eine Änderung beginnt, welche Bereiche zusammenhängen, welche Prüfungen wichtig sind und was noch nicht bekannt ist.

Eine mögliche Deutung des vorläufigen Auftrags lautet: Das Projekt soll so verständlich werden, dass Änderungen schneller und mit weniger Risiko vorbereitet werden können.

In den untersuchten Unterlagen wurde kein gemeinsamer Inventory Report für den jeweiligen Stand gefunden. Auftrag, wichtigste Ergebnisse, Risiken und offene Fragen waren dort nicht an einer Stelle zusammengeführt.

Der Entwurf leitet daraus zwei Annahmen ab. Ein Inventory Run kann mit einem praktischen Anlass beginnen. Dauerhaftes Projektwissen und der Bericht über eine konkrete Bestandsaufnahme erfüllen verschiedene Aufgaben. Als vorgeschlagene Regel darf der Auftrag genauer werden, sobald konkrete Fragen und neue Belege entstehen.

### Grundaufnahme und laufende Vertiefung

Aus dem Praxisbeispiel ergibt sich für den Entwurf eine Arbeitsweise mit zwei Teilen.

Die Grundaufnahme schafft eine erste Orientierung über das Projekt. Sie erfasst die Struktur, wichtige Bereiche, bekannte Abhängigkeiten, vorhandene Quellen und erkennbare Wissenslücken. Sie muss noch nicht jeden Bereich vollständig erklären.

Die laufende Vertiefung beginnt mit einer realen Aufgabe, einem Fehler oder einer Entscheidung. Die Untersuchung folgt von diesem Anlass aus den betroffenen Abläufen, Abhängigkeiten und Tests. Neue Aussagen werden mit Belegen verbunden. Dauerhaft nutzbare Erkenntnisse werden nach ihrer Prüfung in das Projektgedächtnis übernommen. Flüchtige oder nur für den Vorgang wichtige Beobachtungen bleiben beim Vorgang.

Damit kann eine konkrete Aufgabe zwei Ergebnisse liefern. Sie bearbeitet ihren eigentlichen Anlass und verbessert zugleich das Verständnis des Projekts.

Der Ablauf beginnt danach nicht wieder bei null. Spätere Aufgaben nutzen das vorhandene Wissen, prüfen es für ihren Bereich und ergänzen es bei Bedarf. Ein neuer Inventory Report bleibt trotzdem nötig, wenn für einen neuen Auftrag ein bewerteter und geprüfter Gesamtstand gebraucht wird.

Der vorgeschlagene Lebenszyklus lautet daher.

1. Eine Grundaufnahme schafft Orientierung.
2. Eine reale Aufgabe vertieft den betroffenen Bereich.
3. Neue Aussagen werden geprüft.
4. Dauerhaft nutzbare Aussagen werden in den Projektkontextgraphen übernommen.
5. Ein Inventory Report bewertet den nötigen Ausschnitt für einen konkreten Auftrag.

## 2. Quellen

Quellen liefern Informationen über das Projekt.

Dazu können gehören.

* Quellcode und Verlauf im Repository
* fachliche Begriffe, Regeln und Modelle
* Architektur und technische Dokumentation
* Build, Tests und Pipeline
* Tickets, Backlogs und Entscheidungen
* Konfiguration für Betrieb und Lieferung
* Berichte über Qualität und Sicherheit
* beobachtetes Verhalten im laufenden System
* Aussagen von beteiligten Personen
* externe Systeme und spätere Connectoren

Eine Quelle ist noch kein Beleg für jede mögliche Aussage. Ihr Inhalt, ihr Zeitpunkt und ihre Reichweite müssen geprüft werden.

Quellcode kann fachliches Verhalten sichtbar machen. Er erklärt aber nicht immer, warum eine Regel besteht, welche Ausnahme beabsichtigt ist oder wer ihre Bedeutung bestätigen kann. Dafür können weitere Quellen und verantwortliche Menschen nötig sein.

## 3. Belege

Das Register der Belege hält fest, worauf sich eine Aussage stützt.

Zu jedem Beleg gehören mindestens diese Angaben.

* Herkunft
* Zeitpunkt der Beobachtung
* untersuchter Bereich
* Art der Quelle
* erreichbarer Verweis
* bekannte Grenzen
* Stand der Prüfung

Belege aus dem Repository zeigen nur den dort beobachteten Stand. Sie beweisen nicht automatisch das Verhalten im Betrieb. Eine Aussage aus einem Gespräch ist wichtig, bleibt aber von einer direkt prüfbaren Beobachtung getrennt.

## 4. Auswertung

Die Auswertung verbindet den Auftrag mit den verfügbaren Belegen.

Sie unterscheidet vier Arten von Aussagen.

### Beobachtete Fakten

Diese Aussagen lassen sich direkt auf eine geprüfte Quelle zurückführen.

### Deutungen

Diese Aussagen leiten eine Bedeutung aus mehreren Beobachtungen ab. Die zugrunde liegenden Belege bleiben sichtbar.

### Unbekannte Bereiche

Diese Informationen fehlen, sind widersprüchlich oder konnten nicht geprüft werden.

### Empfehlungen

Diese Aussagen schlagen eine Handlung vor. Sie sind keine Entscheidung und keine Freigabe zur Umsetzung.

### Sprache des Beobachters

Der Inventory Report beschreibt immer, was innerhalb des untersuchten Bereichs festgestellt werden konnte.

Er sagt zum Beispiel.

* In den geprüften Quellen wurde kein freigegebenes Budget gefunden.
* Für das Finding konnte keine verantwortliche Stelle festgestellt werden.
* Eine befragte Person nannte Lieferung als aktuelle Priorität.
* Der Grund für diese Priorität konnte nicht geprüft werden.

Nicht gefunden bedeutet nicht automatisch nicht vorhanden. Eine Aussage über Absicht, Priorität oder Verantwortung braucht einen eigenen Beleg.

Die Auswertung soll außerdem Widersprüche, Risiken und fehlende Quellen sichtbar machen.

## 5. Projektkontextgraph

Der Projektkontextgraph verbindet dauerhaft nutzbare Aussagen über das Projekt. Er kann fachliche Begriffe, Regeln, Module, Abläufe, Tests, Entscheidungen, Personen, Risiken und offene Fragen enthalten.

Eine Beziehung im Graphen ist selbst eine Aussage. Sie braucht deshalb eine Quelle, eine Aussageklasse, einen Zeitpunkt, einen untersuchten Bereich und einen Stand der Prüfung. Eine Deutung darf nicht wie eine direkt beobachtete Abhängigkeit behandelt werden.

Der Graph ersetzt die verantwortlichen fachlichen Quellen nicht. Er verweist auf sie und macht Zusammenhänge für spätere Aufgaben auffindbar. Ohne belegte Pflege darf er nicht als vollständig oder aktuell bezeichnet werden.

Offene Fragen und Widersprüche gehören ebenfalls in den Projektkontext. Sie werden nicht durch eine vermutete Verbindung geschlossen.

Der Entwurf legt noch nicht fest, ob der Projektkontextgraph später in Dokumenten, Dateien, einer Datenbank oder einem besonderen Graphformat geführt wird.

## 6. Inventory Report

Der Inventory Report ist das führende fachliche Ergebnis des Inventory Run. Er hält die Bewertung für den jeweiligen Auftrag fest.

Er verbindet mindestens die folgenden Inhalte.

* Auftrag und Grenzen
* verwendete Quellen
* wichtige Beobachtungen
* Deutungen
* unbekannte Bereiche
* Risiken und Widersprüche
* Empfehlungen
* Stand der Prüfung

Der Bericht verweist auf das bestehende fachliche und technische Projektwissen. Er kopiert Details nur dann, wenn sie für den Auftrag nötig sind.

Der Bericht ersetzt die verantwortlichen fachlichen Quellen nicht. Entsteht dauerhaft nutzbares Wissen, wird es nach der Prüfung in das Projektgedächtnis oder die zuständige fachliche Quelle übernommen. Der Inventory Report verweist auf diesen Stand.

Ohne geregelte Pflege bleibt das Ergebnis eine Bestandsaufnahme mit Datum und bekannten Grenzen. Es darf dann nicht als dauerhaft aktuelles Projektgedächtnis bezeichnet werden.

Ändert sich die Bewertung des Run, wird zuerst der Inventory Report geändert. Eine Folie oder eine kurze Zusammenfassung darf keine eigene fachliche Wahrheit bilden.

## 7. Prüfung durch Menschen

Im vorgeschlagenen Ablauf prüfen verantwortliche Menschen den Bericht.

Die Prüfung kann Aussagen bestätigen, Änderungen verlangen oder offene Punkte festhalten. Sie macht aus einer Empfehlung noch keine Freigabe zur Umsetzung.

Wer den Bericht prüft, übernimmt dadurch nicht automatisch die Verantwortung für eine spätere Bereinigung.

Eine Bestandsaufnahme kann technisch gut belegt sein und trotzdem eine fachliche Prüfung brauchen. Das gilt besonders bei Geschäftsregeln, Risiken, Verantwortung und Entscheidungen mit großer Wirkung.

## 8. Abgeleitete Darstellungen

Aus dem geprüften Inventory Report können kürzere Darstellungen entstehen.

Dazu gehören zum Beispiel.

* Zusammenfassung für das Management
* Liste der wichtigsten Risiken
* Maßnahmenliste
* Architekturansicht
* Bericht für eine Übergabe
* Präsentation für ein Gremium

Diese Darstellungen kürzen den Bericht für eine Zielgruppe. Sie dürfen keine neuen Belege, Bewertungen oder Empfehlungen einführen.

## 9. Übergang zu Veränderungen

Ein Finding oder eine Empfehlung führt nicht automatisch zu einer Änderung am untersuchten Projekt.

Ein Finding kann bestehen bleiben, wenn im untersuchten Bereich kein Budget bestätigt, keine verantwortliche Stelle gefunden und keine Umsetzung beauftragt wurde. Der Inventory Report hält diese Beobachtungen mit ihrer Reichweite fest. Sie verhindern nicht den fachlichen Abschluss des Inventory Run.

Wenn aus der Bestandsaufnahme eine Veränderung entstehen soll, beginnt dafür ein eigener und klarer Scope in AGDF. Die Bestandsaufnahme liefert Belege und Kontext. AGDF steuert den neuen Bedarf, die Freigaben und die weitere Lieferung.

So bleiben Bestandsaufnahme und Umsetzung voneinander getrennt.

## Vorgeschlagene Verantwortung von AGDF Core

AGDF Core bleibt verantwortlich für die Steuerung des Run.

Dazu gehören.

* Scope und Run State
* Gates und Freigaben
* Quellen der Wahrheit
* Grenzen von Belegen
* sichtbare Qualitätsentscheidungen
* Übergang von Findings zu einem neuen Veränderungsvorhaben
* Abschluss und Lieferung

Project Inventory baut dafür keine zweite Steuerung auf.

## Vorgeschlagene Verantwortung von Project Inventory

Project Inventory verantwortet die fachliche Bestandsaufnahme.

Dazu gehören.

* Fragen für Auftrag und Untersuchung
* Struktur des Registers der Belege
* Regeln für die Auswertung
* fachliches Modell des Projektkontextgraphen
* Regeln für die Übernahme geprüfter Aussagen
* Aufbau des Inventory Report
* Darstellung von Risiken und offenen Punkten
* Ableitung kürzerer Darstellungen
* fachliche Regeln für eine spätere Erneuerung der Bestandsaufnahme

Project Inventory entscheidet nicht allein über Freigaben, Umsetzung oder Lieferung.

## Rolle externer Systeme

Externe Systeme und spätere Connectoren liefern Informationen und Belege.

Sie können den Zugriff auf Quellen erleichtern. Sie werden dadurch nicht zur Quelle für Freigaben oder Entscheidungen. Ihre Daten müssen mit Herkunft, Zeitpunkt und Reichweite erfasst werden.

Ein Connector darf auch nicht stillschweigend entscheiden, wie zuverlässig oder wichtig eine Aussage ist.

## Schutz vertraulicher Informationen

Ein Inventory Run kann vertrauliche Daten berühren.

Vor dem Zugriff auf eine Quelle muss klar sein, welche Daten untersucht werden dürfen. Dasselbe gilt für die Weitergabe an externe Dienste oder Modelle.

Öffentliche Beispiele dürfen keine internen Namen, Inhalte oder Projektdaten offenlegen. Erkenntnisse aus vertraulichen Projekten werden nur in allgemeiner Form verwendet.

## Was dieser Aufbau noch nicht festlegt

Dieser Entwurf entscheidet noch nicht über die folgenden Punkte.

* technische Architektur
* Speicherung der Daten
* Dateiformate und Schemas
* Auswahl von Connectoren
* Bewertungsskalen
* genaue Pflichtfelder
* technische Prüfung von Belegen
* technische Form des Projektkontextgraphen
* Auswahl einer Graphdatenbank
* Umsetzung als Plugin
* Bedienung durch Menschen oder Agenten

Diese Fragen gehören in einen späteren freigegebenen Scope.

## Offene Fragen

1. Wie genau muss der Auftrag für verschiedene Anlässe beschrieben werden?
2. Welche Quellen sind für eine erste belastbare Fassung mindestens nötig?
3. Wie wird die Verlässlichkeit eines Belegs verständlich beschrieben?
4. Wer darf welche Teile des Inventory Report bestätigen?
5. Wann gilt ein unbekannter Bereich als Risiko?
6. Wie werden widersprüchliche Quellen behandelt?
7. Wie wird eine frühere Bestandsaufnahme erneuert?
8. Wie bleiben ältere Stände nachvollziehbar?
9. Welche Darstellungen werden für welche Zielgruppen gebraucht?
10. Welche Daten dürfen an externe Dienste oder Modelle gehen?
11. Wann reicht eine kompakte Bestandsaufnahme aus?
12. Wann braucht die Untersuchung mehr Tiefe?
13. Welche Arten von Gegenständen und Beziehungen braucht ein erster Pilot?
14. Wie werden widersprüchliche, veraltete und ersetzte Aussagen dargestellt?
15. Wer darf eine fachliche Aussage im Projektkontextgraphen bestätigen?
16. Wie werden vertrauliche Beziehungen geschützt?
17. Wann braucht ein gewachsener Projektkontextgraph einen neuen Inventory Report?
18. Welcher messbare Nutzen rechtfertigt die laufende Pflege?

## Nächster Schritt

Als Nächstes kann diskutiert werden, wie ein kleiner Pilotversuch aussehen soll. Dafür braucht es einen konkreten Anlass, ein geeignetes Projekt, eine Zielgruppe und eine prüfbare Erfolgsfrage.
