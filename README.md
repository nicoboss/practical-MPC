# Praktische sichere Multi-Party-Computation

## Ausgangslage und Problemstellung
In vielen Fällen wollen mehrere Parteien, welche sich nicht vollständig vertrauen, gemeinsam etwas berechnen. Beispiel: Mehrere Pharmaunternehmen wollen sich über die Wirksamkeit und Nebenwirkungen eines möglichen Corona-Medikaments austauschen. Dabei wollen sie die Details der Studien nicht preisgeben. Spezielle Protokolle, sogenannte sichere Multi-Party Computation (MPC), erlauben diese Berechnungen sicher auszuführen. In den letzten Jahren sind dafür in der Forschungsgemeinschaft Tools und Libraries entwickelt worden.

## Ziel der Arbeit und erwartete Resultate
Ziel dieser Arbeit ist es, anhand eines Beispiel-Anwendungsfalls ein System zu entwickeln, welches die sichere verteilte Berechnung ausführt. Die Teilnehmer sollen mittels Browser an der Berechnung teilnehmen können. Zusätzlich soll die Kommunikation zwischen den involvierten Parteien sichtbar gemacht werden und somit die Sicherheit überprüfbar gemacht werden können. Der entwickelte Code soll dabei aktuellen Software-Engineering Best-Practices (siehe gewünschte Methoden, Vorgehen) entsprechen.

## Projektinstallation
1. NodeJS (inklusive NPM) installieren: https://nodejs.org/en/download/
2. Repository mit git clone oder als zip hinunterladen und extrahieren
3. `npm install` im Hauptverzeichnis des hinuntergeladenen Repostorys ausführen
4. run.cmd/run.sh ausführen um den code zu bilden
5. index.xhtml vom `dist` Ordner mit einem beliebigen Webbrowser öffnen

## Methoden und Vorgehen
- Einlesen in das Thema sichere Multi-Party-Computation
- Vergleich der vorhandenen Tools und Libraries
- Entwicklung von Code, welcher einen Beispiel-Anwendungsfall von sicherer Muli-Party-Computation implementiert. Der Code soll im Browser der Teilnehmer laufen können.
- Aufbauen einer Infrastruktur, welche es erlaubt, die Funktionsweise darzustellen: z.B. mittels mehreren Docker-Container als Teilnehmer und dem Darstellen der Kommunikation mittels Wireshark o.ä.

### Details zur Software-Erstellung
Die Software-Erstellung erfolgt iterativ-inkrementell nach SoDa: https://education.pages.enterpriselab.ch/soda/SoDa.html. Für das Projekt gilt es eine Teststrategie festzulegen und die zugehörigen Artefakte zu erstellen. Die "Definition of Done" der einzelnen Iterationen beinhalten nebst den Umsetzungen der funktionalen und nicht-funktionalen Anforderungen Folgendes:
- sinnvoll gewählte Unit Tests für die umgesetzten Anforderungen 
- Regressionstest laufen erfolgreich 
- Smoke Tests laufen erfolgreich - falls vorhanden 
- für die aktuelle Code-Base existiert eine funktionierende CI-Pipeline mit gitlab-CI. (falls ein GPU-Build-Agent zur Verfügung steht - mit automatisiertem Testing und Reporting). 

### Im Weiteren sind folgende Anforderungen umzusetzen:
- alle Tests sind möglichst weitgehendst automatisiert und unter Verwendung eines Test-Frameworks implementiert. 
- während der gesamten Projektlaufzeit wird die Code Base kontinuierlich integriert (CI) auf gitlab.enterpriselab.ch 
- die CI-Pipeline erstellt automatisiert ein Release pro Revision in Form eines ausführbaren Dockerimages 
- Falls ein GPU-Build-Agent zur Verfügung steht, ist Test-Automatisierung in die CI-Pipeline mitaufzunehmen 
- für wichtige UseCases sind gescriptete (und nach Möglichkeit automatisierte) Systemtests zu bestimmen und zu implementieren 
- die Implementierung erfolgt nach CleanCode 
- die System-Architektur soll mittels üblichen Diagrammen dokumentiert sein: https://education.pages.enterpriselab.ch/blockdiagramme/Blockdiagramme.html 
- für das Software-System ist eine vollständige API-Dokumentation zu erstellen. 
- Für das Deployment und die Inbetriebnahme der finalen Version ist eine Anleitung inklusive Anforderungen und Anleitung zu erstellen Resourcen und Hilfestellungen zur Umsetzung der CI(CD)-Pipeline können beim Auftraggeber angefragt werden.
