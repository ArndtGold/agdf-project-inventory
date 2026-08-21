![AGDF Project Inventory. Von verteilten Projektsignalen zur evidenzbasierten Entscheidungsgrundlage](assets/intro.png)

# AGDF Project Inventory

AGDF Project Inventory ist ein deutscher Diskussionsentwurf. Er beschreibt nachvollziehbare Bestandsaufnahmen von Softwareprojekten mit Hilfe von Agenten und KI.

## Dieser Diskussionsentwurf in einem Satz

Projektbestandsaufnahmen mit KI brauchen mehr als Zusammenfassungen. Sie brauchen klare Regeln. Fakten, Deutungen, Wissenslücken und Empfehlungen müssen mit prüfbaren Belegen verbunden sein.

## Status

Dieses Repository ist ein Diskussionsentwurf. Es beschreibt eine Annahme, mögliche Grundsätze und offene Fragen. Es ist keine freigegebene Produktspezifikation. Es ist auch keine Zusage für eine Umsetzung. Der Nutzen in echten Projekten ist noch nicht belegt.

Zuerst soll geprüft werden, ob eine Projektbestandsaufnahme mit AGDF Unternehmen einen eigenen und wiederholbaren Nutzen bietet.

## Erste 5 Minuten

So bekommst du schnell einen Überblick.

1. Lies die Ausgangsbeobachtung und Kernthese im [Manifest](docs/00-manifest.md).
2. Schau dir das Evidenzmodell, den Ablauf und die Ergebnisse im [Überblick](docs/01-project-inventory-ueberblick.md) an.
3. Prüfe dort insbesondere die Verantwortungsgrenze zwischen AGDF Core, Project Inventory und externen Evidenzquellen.

Danach solltest du diese Fragen beantworten können.

- Welches Entscheidungsproblem soll eine Project Inventory lösen?
- Wie werden Fakten, Interpretationen, Unbekanntes und Empfehlungen getrennt?
- Welche Rolle übernimmt AGDF und welche ausdrücklich nicht?

## Warum es dieses Projekt gibt

Projektbestandsaufnahmen entstehen oft unter Zeitdruck. Die Informationen sind verteilt und unvollständig. KI kann diese Quellen schnell auswerten und gut zusammenfassen. Eine gute Darstellung ist aber noch keine belastbare Bestandsaufnahme.

Der Entwurf fragt deshalb nach klaren Regeln. Die Herkunft, die Reichweite und die Unsicherheit von Aussagen müssen sichtbar bleiben. So kann aus technischen Beobachtungen eine prüfbare Grundlage für Entscheidungen entstehen.

## Was der Entwurf vorschlägt

Project Inventory ist hier keine einfache Liste von Dateien, Technik oder Abhängigkeiten. Es ist ein geordnetes Bild des Projekts. Beobachtete Fakten, Deutungen, unbekannte Bereiche und Empfehlungen werden mit Belegen verbunden.

Die belastbare Bestandsaufnahme soll die fachliche Quelle der Wahrheit sein. Daraus entstehen kürzere Darstellungen. Dazu gehören eine Zusammenfassung für das Management, ein Maßnahmenkatalog, eine Architekturansicht, eine Risikoansicht oder eine Präsentation.

## Rolle von AGDF

Der Entwurf ist als ergänzendes Plugin für [AGDF](https://agdf.iself.eu/) vorgesehen. AGDF soll die Regeln für Freigaben, Belege und Lieferung bereitstellen. Project Inventory soll diese Regeln nicht ein zweites Mal aufbauen.

Eine allgemeine Projektbestandsaufnahme ist auch ohne AGDF möglich. Ein durch AGDF gesteuerter Inventory Run braucht dagegen eine passende Installation von AGDF.

## Dokumente

Folgende Reihenfolge ist empfohlen.

1. [00 Manifest](docs/00-manifest.md)
2. [01 Überblick](docs/01-project-inventory-ueberblick.md)

## Welche Fragen sind interessant?

- Welche Entscheidungen sollen durch eine Project Inventory konkret besser werden?
- Welche Belege braucht eine belastbare Bestandsaufnahme mindestens?
- Wann genügt ein kompakter Ansatz und wann ist eine strukturierte Tiefe erforderlich?
- Wie werden technische Findings ohne Scheingenauigkeit priorisiert?
- Woran lässt sich in realen Projekten messen, ob der Ansatz bessere Entscheidungen ermöglicht?

Bis diese Fragen ausreichend geklärt und ein User Requirement Scope freigegeben ist, bleibt dieses Repository bewusst ein Diskussionsentwurf.
