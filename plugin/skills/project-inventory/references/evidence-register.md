# Evidence Register Structure

For every evidence item ask for a stable identifier, source type, locator, capture time, evidence
lane, access state, reach, limitation, confidentiality and an integrity digest when locally readable.

`obtained` means content was observed. `inaccessible` records only an access attempt and its outcome;
it never receives a content digest and never counts as substantive support.

The register records provenance and limits. It does not decide whether a finding is true and does
not copy sensitive source content by default.
