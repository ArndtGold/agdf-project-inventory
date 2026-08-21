# Überblick über AGDF Project Inventory

## Zweck

AGDF Project Inventory soll eine begrenzte, nachvollziehbare Bestandsaufnahme eines Softwareprojekts unterstützen.

Ein Inventory Run beginnt mit einer konkreten Frage und endet mit einem Inventory Report. Der Report soll verantwortlichen Menschen helfen, eine Entscheidung unter sichtbaren Wissensgrenzen zu treffen.

## Typische Anlässe

- Übernahme eines Projekts oder Liefergegenstands
- Entscheidung über Modernisierung oder Ablösung
- Stabilisierung bei Liefer- oder Betriebsproblemen
- Vorbereitung eines Anbieterwechsels
- technische Due Diligence
- Prüfung von Risiken, Qualität oder Lieferfähigkeit

Der Anlass bestimmt die Untersuchung. Eine Übernahme braucht andere Belege als eine Sicherheitsprüfung oder eine Modernisierungsentscheidung.

## Auftrag eines Inventory Run

Vor der Untersuchung sollten mindestens folgende Punkte feststehen:

- Anlass und vorzubereitende Entscheidung
- Auftraggeber und verantwortliche Zielgruppe
- untersuchtes Projekt und zeitlicher Stand
- eingeschlossener und ausgeschlossener Bereich
- erlaubte, erwartete und nicht zugängliche Quellen
- verfügbare Zeit und gewünschte Tiefe
- Regeln für vertrauliche Informationen
- erforderliche menschliche Prüfung

Ein unklarer Auftrag erzeugt leicht eine breite Sammlung ohne Entscheidungswert.

## Evidenzmodell

Jede wesentliche Aussage wird einer Klasse zugeordnet.

| Aussageklasse | Bedeutung | Beispielhafte Grundlage |
|---|---|---|
| Beobachtung | direkt in einer zugänglichen Quelle festgestellt | Datei, Testlauf, Konfiguration, Protokoll |
| Interpretation | aus Beobachtungen abgeleitete Bedeutung | vermutete Ursache oder Auswirkung |
| Unbekannt | relevante Information fehlt oder widerspricht sich | fehlender Zugriff, keine Laufzeitdaten |
| Empfehlung | vorgeschlagene Handlung | Prüfung, Stabilisierung, Ablösung |

Zu einer Aussage gehören nach Möglichkeit Quelle, Zeitpunkt, Reichweite, Prüfstatus und verantwortliche Stelle.

## Fachlicher Ablauf

1. **Auftrag klären:** Entscheidung, Zielgruppe, Scope und Grenzen werden festgehalten.

2. **Quellen aufnehmen:** Zugängliche und fehlende Quellen werden sichtbar registriert.

3. **Evidenz untersuchen:** Relevante Projektsignale werden gesammelt, zugeordnet und auf Widersprüche geprüft.

4. **Findings formulieren:** Beobachtungen, Interpretationen, Unbekanntes und Empfehlungen bleiben getrennt.

5. **Verantwortlich prüfen:** Menschen bestätigen Aussagen dort, wo fachliche Verantwortung oder nicht direkt beobachtbare Realität betroffen ist.

6. **Inventory Report abschließen:** Der Report verbindet Auftrag, Evidenz, Findings, Grenzen und Empfehlungen.

7. **Entscheidung oder Folgearbeit übergeben:** Der Inventory Run endet. Eine Veränderung braucht einen eigenen freigegebenen AGDF Scope.

## Ergebnisartefakte

### Assessment Intake

Hält Anlass, Entscheidung, Scope, Quellenzugriff, Zeitrahmen und Verantwortliche fest.

### Evidence Register

Erfasst die verwendete Evidenz mit Herkunft, Zeitpunkt, Reichweite und Zugriffsgrenze.

### Findings and Gaps Register

Ordnet die wesentlichen Aussagen den vier Aussageklassen zu und verbindet sie mit Evidenz.

### Inventory Report

Ist das führende fachliche Ergebnis des Inventory Run. Er fasst nicht nur zusammen, sondern zeigt, worauf die Bewertung beruht und wo sie endet.

### Abgeleitete Sichten

Managementzusammenfassung, Risikosicht, Architekturansicht, Maßnahmenliste oder PowerPoint Präsentation werden aus dem Inventory Report erzeugt. Sie dürfen keine eigene Bewertung einführen.

## Wann ist ein Inventory Run abgeschlossen?

Ein Run ist nicht abgeschlossen, weil alle denkbaren Fragen beantwortet wurden. Er kann abgeschlossen werden, wenn:

- der genehmigte Untersuchungsbereich bearbeitet wurde
- verwendete und fehlende Quellen sichtbar sind
- wesentliche Aussagen klassifiziert und belegt sind
- entscheidungsrelevante Wissenslücken genannt sind
- Empfehlungen von Entscheidungen getrennt bleiben
- erforderliche menschliche Prüfungen erfolgt oder offen ausgewiesen sind
- der Inventory Report für die vereinbarte Entscheidung nutzbar ist

## Compact und Structured Inventory

Nicht jede Bestandsaufnahme braucht dieselbe Tiefe.

Eine **Compact Inventory** kann für eine begrenzte Übergabe, eine einzelne Entscheidung oder einen kleinen Untersuchungsbereich genügen.

Eine **Structured Inventory** kann erforderlich sein, wenn mehrere Verantwortungsbereiche, hohe Risiken, regulatorische Anforderungen, kritische Betriebsfragen oder weitreichende Investitionsentscheidungen betroffen sind.

Die Tiefe wird durch Wirkung und Evidenzbedarf bestimmt. Anzahl der Dateien, Findings oder angeschlossenen Systeme ist kein ausreichender Maßstab.

## Verantwortung von AGDF und Project Inventory

| Bereich | AGDF | Project Inventory |
|---|---|---|
| Scope und Freigaben | verantwortlich | arbeitet innerhalb des Scopes |
| Evidenzgrenzen | steuert und dokumentiert | wendet sie auf die Untersuchung an |
| Quellenanalyse | nicht fachlicher Eigentümer | verantwortlich |
| Findings und Wissenslücken | kontrolliert den Rahmen | formuliert und belegt |
| Inventory Report | steuert Prüfung und Abschluss | erstellt die fachliche Bewertung |
| Entscheidung | macht Verantwortlichkeit sichtbar | spricht Empfehlungen aus |
| Umsetzung | steuert einen getrennten Delivery Scope | erteilt keine Freigabe |

## Templates und Connectoren

Templates können Auftrag, Evidenzangaben, Aussageklassen und Mindestprüfungen standardisieren. Sie dürfen keine Findings, Bewertungen oder Prioritäten vorgeben.

Connectoren können Informationen aus Repositorys, Ticketsystemen, Dokumentationen oder Laufzeitsystemen zugänglich machen. Sie liefern Evidenz. Sie entscheiden nicht, welche Aussage wahr, wichtig oder ausreichend belegt ist.

## Verhältnis zu einem möglichen Project Memory

Project Inventory benötigt kein dauerhaftes Projektgedächtnis. Der Inventory Report kann auf vorhandenes Projektwissen als Quelle zugreifen, muss relevante Aussagen aber für seinen Auftrag und Zeitpunkt prüfen.

Ein späteres AGDF Project Memory könnte bestätigtes Wissen über mehrere Aufgaben hinweg pflegen. Diese dauerhafte Verantwortung sollte nicht stillschweigend Teil von Project Inventory werden.

## Offene Produktfragen

1. Welcher Unternehmensanlass ist der beste erste Anwendungsfall?
2. Welche Mindestangaben machen einen Inventory Report belastbar?
3. Welche Aussage braucht welche Form menschlicher Bestätigung?
4. Wie werden widersprüchliche Quellen behandelt?
5. Welche Kriterien unterscheiden Compact und Structured Inventory?
6. Wie wird der Entscheidungsnutzen eines Reports beobachtet?
7. Welche Templates sind allgemein und welche anlassbezogen?
8. Wie wird ein bestätigtes Finding sauber in einen Delivery Scope überführt?

Der nächste Diskussionsentwurf beschreibt die funktionalen Verantwortungen genauer.

[02 Aufbau und Verantwortung](02-aufbau-und-verantwortung.md)
