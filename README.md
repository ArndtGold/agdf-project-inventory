![AGDF Project Inventory. Von verteilten Projektsignalen zur evidenzbasierten Entscheidungsgrundlage](assets/intro.png)

# AGDF Project Inventory

AGDF Project Inventory ist ein deutschsprachiger Diskussionsentwurf für nachvollziehbare Bestandsaufnahmen von Softwareprojekten mit Agenten und KI.

## In einem Satz

AGDF Project Inventory führt verteilte Projektsignale zu einem evidenzbasierten Inventory Report zusammen, damit Unternehmen eine konkrete Entscheidung unter sichtbaren Wissensgrenzen treffen können.

## Status

Dieses Repository beschreibt eine Produktidee, mögliche Grundsätze und offene Fragen. Es ist keine freigegebene Produktspezifikation, keine Implementierungszusage und kein Nachweis praktischer Wirksamkeit.

Die Diskussion unterscheidet Beobachtungen, Interpretationen, unbekannte Bereiche und Empfehlungen. Eine vorgeschlagene Regel beschreibt den Entwurf. Sie ist keine Funktion eines bereits vorhandenen Produkts.

## Welches Problem soll gelöst werden?

Bei Projektübernahmen, Modernisierungen, Lieferproblemen, Anbieterwechseln oder Prüfungen müssen Unternehmen entscheiden, obwohl die Informationen verteilt und unvollständig sind.

Quellcode, Dokumentation, Tickets, Tests, Betriebsdaten und Aussagen von Beteiligten zeigen jeweils nur einen Ausschnitt. KI kann diese Quellen schnell zusammenfassen. Eine überzeugende Zusammenfassung ist aber noch keine belastbare Bestandsaufnahme.

Für eine Entscheidung muss sichtbar bleiben:

1. Was wurde tatsächlich beobachtet?
2. Welche Evidenz trägt die Aussage?
3. Was wurde interpretiert?
4. Welche entscheidungsrelevanten Informationen fehlen?
5. Welche Empfehlungen folgen daraus und wer muss entscheiden?

## Was ist das Ergebnis?

Das führende Ergebnis eines Inventory Run ist der **Inventory Report**. Er beschreibt einen abgegrenzten Untersuchungsauftrag zu einem bestimmten Zeitpunkt.

Der Report verbindet Findings mit ihrer Herkunft, Reichweite, Aussageklasse und verbleibenden Unsicherheit. Managementzusammenfassungen, Risikoansichten, Maßnahmenlisten, Architekturansichten und Präsentationen werden daraus abgeleitet. Sie bilden keine zweite Quelle der Wahrheit.

## Unternehmenswert

Der Entwurf zielt auf einen klaren, begrenzten Nutzen:

- schneller zu einem prüfbaren Projektbild gelangen
- Wissenslücken vor einer Entscheidung sichtbar machen
- technische Beobachtungen mit dem geschäftlichen Anlass verbinden
- Empfehlungen von bereits beschlossenen Maßnahmen trennen
- einen nachvollziehbaren Übergang von Bestandsaufnahme zu Veränderung ermöglichen

Project Inventory gewinnt seinen Wert nicht durch möglichst viele Findings. Entscheidend ist, ob der Inventory Report eine konkrete Entscheidung besser vorbereitet.

## Rolle von AGDF

Der Entwurf ist als ergänzendes Plugin für [AGDF](https://agdf.iself.eu/) vorgesehen.

AGDF verantwortet den gesteuerten Rahmen. Dazu gehören Scope, Freigaben, Evidenzgrenzen, Run State und der Übergang von bestätigten Findings in eine mögliche Veränderung.

Project Inventory verantwortet die Bestandsaufnahme. Dazu gehören Untersuchungsauftrag, Evidenzregister, Bewertung, offene Fragen und Inventory Report.

Eine allgemeine Projektbestandsaufnahme kann auch ohne AGDF stattfinden. Ein durch AGDF gesteuerter Inventory Run setzt eine passende AGDF Installation voraus.

## Abgrenzung zu Project Memory

Ein dauerhaftes Projektgedächtnis kann später eine sinnvolle eigene Erweiterung werden. Es ist jedoch nicht das Kernprodukt dieses Entwurfs.

AGDF Project Inventory bleibt begrenzt. Es untersucht ein Projekt für einen konkreten Anlass und liefert einen zeitbezogenen Bericht. Ein mögliches **AGDF Project Memory** würde dagegen dauerhaftes, wiederverwendbares Projektwissen pflegen. Diese Verantwortung sollte als separates Add-in diskutiert werden.

## Erste 5 Minuten

1. Lies die Ausgangsfrage und die Prinzipien im [Manifest](docs/00-manifest.md).
2. Schau dir Auftrag, Evidenzmodell und Ergebnisse im [Überblick](docs/01-project-inventory-ueberblick.md) an.
3. Lies in [Aufbau und Verantwortung](docs/02-aufbau-und-verantwortung.md), wie ein Inventory Run fachlich aufgebaut ist.
4. Prüfe im [Pilotversuch](docs/03-pilotversuch.md), wie der Entscheidungsnutzen beobachtet werden könnte.

## Leitfragen der Diskussion

- Für welche Unternehmensentscheidung ist Project Inventory zuerst wertvoll?
- Welche Evidenz braucht ein belastbarer Inventory Report mindestens?
- Wann genügt eine kompakte Bestandsaufnahme und wann ist mehr Tiefe nötig?
- Wer darf Findings, Wissenslücken und Empfehlungen bestätigen?
- Wie wird der Nutzen beobachtet, ohne Scheingenauigkeit zu erzeugen?
- Wann sollte aus einem Finding ein eigener AGDF Delivery Scope entstehen?

Bis diese Fragen praktisch geprüft und spätere Produktscopes ausdrücklich freigegeben sind, bleibt dieses Repository bewusst ein offener Diskussionsentwurf.
