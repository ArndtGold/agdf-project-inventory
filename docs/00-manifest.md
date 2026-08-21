# Manifest für AGDF Project Inventory

## Ausgangslage

Unternehmen müssen den Zustand eines Softwareprojekts häufig in kurzer Zeit verstehen. Typische Anlässe sind eine Projektübernahme, eine Modernisierungsentscheidung, ein Lieferproblem, ein Anbieterwechsel, eine Prüfung oder eine größere Investition.

Die Informationen liegen selten an einer Stelle. Mögliche Quellen sind:

- Quellcode und Repositoryverlauf
- Architektur- und Betriebsdokumentation
- Backlogs, Tickets und Entscheidungsprotokolle
- Tests, Build- und Deploymentkonfiguration
- Sicherheits- und Qualitätsberichte
- beobachtbares Laufzeitverhalten
- Aussagen verantwortlicher Menschen

Jede Quelle hat Grenzen. Repositorydaten beweisen kein erfolgreiches Laufzeitverhalten. Dokumentation kann veraltet sein. Aussagen von Beteiligten können wichtig sein, sind aber keine direkt beobachteten technischen Fakten.

KI kann diese Informationen schnell verarbeiten. Geschwindigkeit löst jedoch nicht das Problem der Verlässlichkeit. Ohne klare Aussageklassen und Belege kann eine gut formulierte Zusammenfassung mehr Sicherheit zeigen, als tatsächlich vorhanden ist.

## Die zentrale Frage

> Kann eine durch AGDF gesteuerte Project Inventory Unternehmen dabei helfen, ein Softwareprojekt besser zu übernehmen, zu bewerten oder weiterzuentwickeln?

Die erste Produktfrage lautet daher nicht, wie viele Quellen automatisch angeschlossen oder wie viele Dokumente erzeugt werden können.

Entscheidend ist, ob ein begrenzter Inventory Run einen nachvollziehbaren Inventory Report liefert, der eine konkrete Entscheidung besser vorbereitet.

## Kernthese

Eine belastbare Bestandsaufnahme verbindet vier Dinge:

1. einen klaren Untersuchungsauftrag
2. zugängliche Evidenz mit sichtbaren Grenzen
3. eine getrennte Bewertung von Beobachtung, Interpretation, Unbekanntem und Empfehlung
4. einen verantworteten Inventory Report für eine konkrete Entscheidung

Der Inventory Report ist kein vollständiges Abbild des Projekts. Er ist eine bewertete Sicht auf den untersuchten Bereich zu einem festgehaltenen Zeitpunkt.

## Die vier Aussageklassen

### Beobachtung

Eine Beobachtung beschreibt, was in einer zugänglichen Quelle tatsächlich festgestellt wurde. Sie nennt Quelle, Zeitpunkt und Reichweite.

### Interpretation

Eine Interpretation leitet aus einer oder mehreren Beobachtungen eine mögliche Bedeutung ab. Sie bleibt als Deutung erkennbar.

### Unbekannt

Ein unbekannter Bereich benennt fehlende, widersprüchliche oder nicht zugängliche Informationen. Fehlende Evidenz wird nicht durch eine Annahme ersetzt.

### Empfehlung

Eine Empfehlung schlägt eine Handlung vor. Sie ist weder Entscheidung noch Umsetzungsfreigabe.

## Der Inventory Report führt

Der Inventory Report führt die Bewertung eines Inventory Run. Er sollte mindestens erkennen lassen:

- Anlass, Zielgruppe und vorzubereitende Entscheidung
- untersuchten und ausgeschlossenen Bereich
- verwendete und nicht verfügbare Quellen
- wesentliche Beobachtungen und ihre Evidenz
- Interpretationen und widersprüchliche Signale
- entscheidungsrelevante Wissenslücken
- Risiken und Empfehlungen
- verantwortliche Prüfung und verbleibende Grenzen

Eine Managementzusammenfassung, eine Risikosicht oder eine Präsentation darf Inhalte verdichten. Sie muss auf den Report zurückführbar bleiben und darf Unsicherheit nicht stillschweigend entfernen.

## Warum Unternehmen dafür bezahlen könnten

Project Inventory adressiert einen erkennbaren Anlass, einen begrenzten Zeitraum und ein überprüfbares Ergebnis. Das erleichtert Budget, Verantwortung und Nutzenbewertung.

Der mögliche Unternehmenswert liegt in besseren Entscheidungen:

- Risiken vor einer Übernahme früher erkennen
- Modernisierungsoptionen auf beobachtbare Grundlagen stellen
- offene Betriebs- oder Lieferfragen sichtbar machen
- technische Findings in geschäftlichen Zusammenhang setzen
- notwendige Folgearbeit klar von der Bestandsaufnahme trennen

Der Wert ist nicht automatisch gegeben. Ein Pilot muss zeigen, ob der Bericht die Entscheidung tatsächlich verändert, absichert oder nachvollziehbarer macht.

## Prinzipien

### 1. Evidenz vor Darstellung

Eine überzeugende Formulierung ersetzt keinen nachvollziehbaren Beleg.

### 2. Auftrag vor Vollständigkeit

Der Untersuchungsauftrag bestimmt, was betrachtet werden muss. Eine Bestandsaufnahme muss nicht das ganze Projekt erklären.

### 3. Aussageklassen bleiben getrennt

Beobachtung, Interpretation, Unbekanntes und Empfehlung dürfen nicht ineinander übergehen.

### 4. Unbekanntes bleibt sichtbar

Nicht gefunden, nicht zugänglich, nicht bestätigt und nicht vorhanden sind unterschiedliche Aussagen.

### 5. Der Inventory Report ist die führende Sicht

Abgeleitete Darstellungen bleiben auf den Report und seine Evidenz zurückführbar.

### 6. Tiefe ist proportional

Anlass, Risiko, Entscheidungsfolgen und verfügbare Evidenz bestimmen die Tiefe der Untersuchung.

### 7. Empfehlungen sind keine Entscheidungen

Eine vorgeschlagene Maßnahme wird erst durch einen verantwortlichen Entscheidungs- und Delivery Scope zu beauftragter Veränderung.

### 8. AGDF behält die Steuerungsverantwortung

Project Inventory baut Gates, Freigaben, Run State und Delivery Übergänge nicht parallel neu auf.

### 9. Ein Connector liefert Evidenz, keine Wahrheit

Externe Systeme erleichtern den Zugriff. Sie entscheiden nicht über Aussageklasse, Verlässlichkeit oder Relevanz.

### 10. Der Nutzen muss beobachtbar werden

Ein guter Bericht ist kein Selbstzweck. Er muss eine reale Entscheidung besser vorbereiten.

## Rolle von AGDF

AGDF stellt den kontrollierten Rahmen für einen Inventory Run bereit. Der Rahmen kann festhalten:

- welcher Auftrag freigegeben ist
- welche Quellen verwendet werden dürfen
- welche Evidenzgrenzen gelten
- welche Prüfungen und Bestätigungen erforderlich sind
- wann der Inventory Run abgeschlossen ist
- wie ein bestätigtes Finding in einen getrennten Delivery Scope übergeht

Project Inventory liefert Analyse und Bericht innerhalb dieses Rahmens. Es erteilt keine Umsetzungsfreigabe.

## Abgrenzung

AGDF Project Inventory ist zunächst keine CMDB, kein Softwarekatalog, kein Architekturwerkzeug und kein dauerhaftes Wissenssystem. Solche Systeme können Quellen oder Empfänger sein.

Ein mögliches AGDF Project Memory hätte ein anderes Produktversprechen. Es würde dauerhaftes Projektwissen pflegen und über mehrere Aufgaben wiederverwenden. Diese Idee kann später separat untersucht werden. Sie ist keine Voraussetzung für den Wert eines einzelnen Inventory Run.

## Status der Aussagen

Dieser Text ist ein Diskussionsentwurf. Seine Prinzipien sind Vorschläge und keine Beschreibung implementierter Funktionen.

Die nächste sinnvolle Prüfung ist ein begrenzter Pilot mit einer realen Unternehmensentscheidung. Der Pilot muss Beobachtungen, Deutungen und fehlende Evidenz ebenso sauber trennen wie der vorgeschlagene Inventory Report.
