# Aufbau und Verantwortung eines Inventory Run

## Ziel dieses Dokuments

Dieses Dokument beschreibt den fachlichen Aufbau eines AGDF gesteuerten Inventory Run. Es legt keine technische Architektur, Speicherung oder Plugin Implementierung fest.

## Das funktionale Bild

Ein Inventory Run verbindet sieben Bereiche.

```text
Unternehmensanlass
        ↓
Untersuchungsauftrag
        ↓
Quellen und Evidenzregister
        ↓
Findings und Wissenslücken
        ↓
Verantwortliche Prüfung
        ↓
Inventory Report
        ↓
Entscheidung oder getrennter Delivery Scope
```

Die Reihenfolge ist wichtig. Ohne Entscheidungsanlass bleibt der Scope beliebig. Ohne Evidenz bleiben Findings bloße Behauptungen. Ohne sichtbare Wissenslücken entsteht Scheinsicherheit. Ohne verantwortliche Prüfung wird eine KI Bewertung leicht mit einer Unternehmensentscheidung verwechselt.

## 1. Unternehmensanlass

Der Anlass erklärt, warum die Bestandsaufnahme jetzt gebraucht wird.

Beispiele sind Übernahme, Modernisierung, Stabilisierung, Due Diligence, Anbieterwechsel oder eine wichtige Investition.

Der Anlass ist noch kein Untersuchungsauftrag. Er gibt jedoch vor, welcher Nutzen am Ende erwartet wird.

## 2. Untersuchungsauftrag

Der Untersuchungsauftrag übersetzt den Anlass in eine begrenzte Frage.

Er hält mindestens fest:

- vorzubereitende Entscheidung
- Auftraggeber und Zielgruppe
- untersuchten Gegenstand und Zeitpunkt
- einbezogene und ausgeschlossene Bereiche
- erlaubte und erwartete Quellen
- gewünschte Tiefe
- Schutz vertraulicher Informationen
- erforderliche Bestätigung

AGDF steuert die Freigabe und den gültigen Scope. Project Inventory führt die Untersuchung innerhalb dieser Grenze durch.

## 3. Quellen und Evidence Register

Quellen bleiben für ihren jeweiligen Inhalt maßgeblich. Project Inventory kopiert ihre Autorität nicht in einen neuen Bericht.

Das Evidence Register hält fest:

- welche Quelle verwendet wurde
- wann sie betrachtet wurde
- welchen Bereich sie abdeckt
- welche Zugriffsgrenzen bestanden
- ob es Widersprüche oder bekannte Qualitätsprobleme gibt

Eine Quelle kann mehrere Findings stützen. Ein Finding kann mehrere Quellen benötigen.

## 4. Findings und Wissenslücken

Ein Finding besteht nicht nur aus einem Satz und einer Priorität. Es macht die Art der Aussage sichtbar.

- Beobachtung
- Interpretation
- Unbekannt
- Empfehlung

Eine Priorisierung darf Unsicherheit nicht verstecken. Ein hohes Risiko ohne belastbare Evidenz bleibt als Interpretation oder offene Frage erkennbar.

## 5. Verantwortliche Prüfung

Agenten und KI können Quellen untersuchen, Beziehungen herstellen und Widersprüche sichtbar machen. Sie übernehmen dadurch nicht automatisch fachliche, technische oder geschäftliche Verantwortung.

Eine verantwortliche Prüfung kann klären:

- ob eine fachliche Aussage zutrifft
- ob eine technische Beobachtung den relevanten Bereich abdeckt
- ob ein unbekannter Bereich entscheidungsrelevant ist
- ob eine Empfehlung realistisch und verantwortbar ist
- ob der Report für die vereinbarte Entscheidung ausreicht

Nicht bestätigte Aussagen bleiben entsprechend gekennzeichnet.

## 6. Inventory Report

Der Inventory Report ist die führende bewertete Sicht des Run.

Er verbindet:

- Auftrag und Grenzen
- Evidenzlage
- wesentliche Findings
- Widersprüche und Wissenslücken
- Risiken und Empfehlungen
- Prüfstatus
- verbleibende Entscheidungsgrenzen

Der Report ist zeitbezogen. Eine spätere Änderung im Projekt macht den damaligen Report nicht falsch, kann ihn aber für eine neue Entscheidung unzureichend machen.

## 7. Entscheidung und Übergang

Project Inventory bereitet eine Entscheidung vor. Es trifft sie nicht automatisch.

Mögliche Ergebnisse sind:

- Entscheidung auf vorhandener Evidenz
- Entscheidung mit ausdrücklich akzeptierter Unsicherheit
- zusätzliche Untersuchung
- keine Entscheidung wegen wesentlicher Evidenzlücken
- Vorbereitung eines getrennten AGDF Delivery Scope

Eine Empfehlung im Inventory Report ist keine Umsetzungsfreigabe. Der Übergang in Veränderung braucht einen eigenen Auftrag, seine Freigaben und seine Nachweise.

## Abgeleitete Sichten

Unterschiedliche Zielgruppen brauchen unterschiedliche Darstellungen.

| Sicht | Zweck | Grenze |
|---|---|---|
| Managementzusammenfassung | Entscheidung und wesentliche Unsicherheit | keine neue Bewertung |
| Risikosicht | Risiken, Wirkung und Evidenzlage | keine versteckte Priorisierung |
| Architekturansicht | relevante technische Zusammenhänge | kein vollständiges Architekturmodell |
| Maßnahmenliste | mögliche Folgearbeit | keine Beauftragung |
| Präsentation | verständliche Kommunikation | bleibt auf Report zurückführbar |

Alle Sichten werden aus dem Inventory Report abgeleitet. Widersprechen sie ihm, muss die Abweichung geklärt werden.

## Verantwortungsgrenzen

### AGDF Core

AGDF verantwortet:

- Scope und Gate Status
- erforderliche Freigaben
- zulässige Evidenzgrenzen
- Run State und Abschluss
- Übergang in einen getrennten Delivery Scope

### AGDF Project Inventory

Project Inventory verantwortet:

- Aufnahme des Untersuchungsauftrags
- Registrierung und Untersuchung der Evidenz
- Trennung der Aussageklassen
- Findings und Wissenslücken
- Inventory Report und abgeleitete Sichten

### Externe Systeme

Repositorys, Ticket- und Dokumentationssysteme, Laufzeitplattformen und spätere Connectoren liefern Informationen. Sie erteilen keine AGDF Freigaben und entscheiden nicht über die Bewertung.

### Menschen

Menschen verantworten Zugriff, fachliche Bestätigung, Risikoakzeptanz und Unternehmensentscheidung.

## Schutz vor parallelen Wahrheiten

Der Inventory Report führt die Bewertung des Run. Er ersetzt jedoch nicht die verantwortlichen Quellsysteme.

Diese Unterscheidung verhindert zwei Fehler:

1. Eine alte Zusammenfassung wird nicht zur neuen fachlichen Wahrheit.
2. Eine Managementfolie wird nicht zum zweiten Inventory Report.

## Project Memory als spätere Erweiterung

Ein dauerhaftes Project Memory könnte bestätigtes Wissen aus mehreren Inventories und Delivery Aufgaben wiederverwendbar machen. Das wäre eine eigene Produktverantwortung mit Fragen zu Aktualität, Pflege, Konflikten und Zugriff.

Dieser Entwurf setzt ein solches Add-in nicht voraus. AGDF Project Inventory muss seinen Nutzen durch einen begrenzten Inventory Run und einen belastbaren Report zeigen können.

## Was noch nicht festgelegt ist

- technische Architektur
- Speicherung und Datenmodell
- Dateiformate und Schemas
- konkrete Connectoren
- Bewertungsskalen
- ausführbare Templates
- technische Belegprüfung
- Bedienung durch Menschen oder Agenten
- Implementierung als Plugin

## Nächster Schritt

Der nächste Entwurf beschreibt einen Pilotversuch, der den Entscheidungsnutzen eines Inventory Report prüft.

[03 Pilotversuch](03-pilotversuch.md)
